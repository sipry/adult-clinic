"use client";

import * as React from "react";
import { motion, animate } from "framer-motion";
import { UserRound, Calendar, Stethoscope } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

import balloon2 from "@/../public/assets/svg/balloon2.svg";
import wave from "@/../public/assets/svg/wave.svg";

/* ---------- Motion utils ---------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useInOutViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit
) {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    let io: IntersectionObserver | null = null;
    let raf = 0;

    const visibleNow = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
    };

    const check = () => {
      raf = 0;
      setInView(visibleNow());
    };

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) =>
          ents.forEach((e) =>
            setInView(e.isIntersecting || e.intersectionRatio > 0)
          ),
        options || { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    raf = requestAnimationFrame(check);
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (io) io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, options?.threshold, options?.rootMargin]);

  return inView;
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
};
const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 600,
  y = 16,
  x = 0,
  scale = 1,
  once = true,
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInOutViewport(ref, { threshold, rootMargin });
  const [shown, setShown] = React.useState(false);
  const reduce = usePrefersReducedMotion();

  React.useEffect(() => {
    if (inView) setShown(true);
    else if (!once) setShown(false);
  }, [inView, once]);

  const style: React.CSSProperties = reduce
    ? {}
    : {
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : `translate(${x}px, ${y}px) scale(${scale})`,
      transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      willChange: "opacity, transform",
    };

  return (
    <div ref={ref} className={className} style={style} aria-hidden={!shown}>
      {children}
    </div>
  );
};

/* ---------- Types ---------- */
export type Step = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export type AppointmentProcessProps = {
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  steps?: Step[];
  className?: string;
  stepDurationSec?: number;
};

// Icon bubble — zoom con framer-motion
const IconBubble: React.FC<{ children: React.ReactNode; active?: boolean }> = ({
  children,
  active,
}) => (
  <motion.div
    animate={active ? { scale: [1, 1.14, 1] } : { scale: 1 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    className="relative z-10 grid size-16 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
    style={{ willChange: "transform" }}
  >
    <div className="grid size-12 place-items-center rounded-full bg-sky-100">
      <div className="text-sky-900">{children}</div>
    </div>
  </motion.div>
);

/* ---------- Component ---------- */
export default function AppointmentProcess({
  eyebrow,
  heading,
  blurb,
  steps,
  className = "",
  stepDurationSec = 1.4,
}: AppointmentProcessProps) {
  const { t } = useTranslation();

  const eyebrowText = eyebrow ?? t("appointment.pretitle");
  const headingText = heading ?? t("appointment.title");
  const blurbText = blurb ?? t("appointment.subtitle");

  const fallbackSteps = React.useMemo<Step[]>(
    () => [
      {
        id: "choose-doctor",
        title: t("appointment.step1"),
        description: t("appointment.step1.desc"),
        icon: <UserRound className="size-6" aria-hidden />,
      },
      {
        id: "schedule",
        title: t("appointment.step2"),
        description: t("appointment.step2.desc"),
        icon: <Calendar className="size-6" aria-hidden />,
      },
      {
        id: "attend",
        title: t("appointment.step3"),
        description: t("appointment.step3.desc"),
        icon: <Stethoscope className="size-6" aria-hidden />,
      },
    ],
    [t]
  );

  const stepsData = steps ?? fallbackSteps;
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, 1, {
      duration: stepDurationSec,
      ease: "linear",
      onComplete: () => setCurrent((prev) => (prev + 1) % stepsData.length),
    });
    return () => controls.stop();
  }, [current, stepDurationSec, stepsData.length]);

  const sectionRef = React.useRef<HTMLElement>(null);
  useInOutViewport(sectionRef, { threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={
        "relative isolate px-6 pt-20 md:pt-28 lg:pt-32 pb-10 md:pb-18 lg:pb-22 overflow-hidden " +
        className
      }
    >
      
      <div className="relative z-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24 mx-auto max-w-7xl ">
          {/* Texto (primero en el DOM, arriba en mobile, derecha en desktop) */}
          <div className="order-1 lg:order-2 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <Reveal y={8} delay={0}>
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-900 uppercase mb-3">
                {eyebrowText}
              </div>
            </Reveal>
            <Reveal y={12} delay={80}>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
                {headingText}
              </h2>
            </Reveal>
            <Reveal y={12} delay={140}>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                {blurbText}
              </p>
            </Reveal>
          </div>

          {/* Timeline */}
          <Reveal y={16} delay={60} className="order-2 lg:order-1">
            <ol className="relative w-full max-w-xl mx-auto space-y-12">
              {stepsData.map((step, idx) => (
                <li
                  key={step.id}
                  className="
                    relative
                    grid gap-y-4 gap-x-6
                    grid-cols-1 text-center place-items-center
                    md:grid-cols-[64px_1fr] md:text-left md:place-items-start
                  "
                >
                  <div className="col-start-1 md:row-span-2">
                    <IconBubble active={current === idx}>{step.icon}</IconBubble>
                  </div>

                  <Reveal y={6} delay={0} duration={520}>
                    <h3 className="md:col-start-2 text-xl font-semibold tracking-tight text-zinc-900">
                      {step.title}
                    </h3>
                  </Reveal>
                  <Reveal y={8} delay={50} duration={520}>
                    <p className="md:col-start-2 mt-2 text-base leading-7 text-zinc-600">
                      {step.description}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-sky-950/[0.01]" />

     
    </section>
  );
}
