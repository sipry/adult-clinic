"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "../contexts/TranslationContext";
import { PALETTE, BRAND } from "@/app/ui/palette";

/* -------------------- Utils -------------------- */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
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
  const [inView, setInView] = useState(false);
  useEffect(() => {
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

/* -------------------- Reveal -------------------- */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}> = ({
  children,
  className,
  delay = 0,
  duration = 600,
  y = 16,
  once = true,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInOutViewport(ref, { threshold: 0.2 });
    const [shown, setShown] = useState(false);
    const reduce = usePrefersReducedMotion();

    useEffect(() => {
      if (inView) setShown(true);
      else if (!once) setShown(false);
    }, [inView, once]);

    const style: React.CSSProperties = reduce
      ? {}
      : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      };

    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  };

/* -------------------- Count-up -------------------- */
const AnimatedNumber: React.FC<{
  start?: number;
  end: number;
  durationMs?: number;
  delayMs?: number;
  suffix?: string;
  play?: boolean;
}> = ({
  start = 0,
  end,
  durationMs = 1000,
  delayMs = 0,
  suffix = "",
  play = true,
}) => {
    const [value, setValue] = useState(start);
    useEffect(() => {
      if (!play) return;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        setValue(start + (end - start) * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
      };
      const timeout = setTimeout(() => requestAnimationFrame(step), delayMs);
      return () => clearTimeout(timeout);
    }, [play, start, end, durationMs, delayMs]);
    return (
      <span>
        {Math.round(value).toLocaleString()}
        {suffix}
      </span>
    );
  };

/* -------------------- Component -------------------- */
export const AboutUsProfessional: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInOutViewport(sectionRef, { threshold: 0.2 });
  const { t } = useTranslation();

  // tomamos un par de colores de la paleta
  const bulletColor = PALETTE[3]; // amarillo cálido
  const counterColor = PALETTE[7]; // rosado fuerte

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-10"
      style={{ backgroundColor: BRAND.bg }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        {/* LEFT COLUMN */}
        <div>
          <Reveal y={8}>
            <div
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: BRAND.accent }}
            >
              {t("about.pretitle")}
            </div>
          </Reveal>

          <Reveal y={12} delay={60}>
            <h2
              className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-5"
              style={{ color: BRAND.title }}
            >
              {t("about.title")}
            </h2>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: BRAND.subtitle }}
            >
              {t("about.subtitle")}
            </p>
          </Reveal>

          <ul className="space-y-3 mb-8 mt-6">
            {[t("about.bullet1"), t("about.bullet2"), t("about.bullet3")].map(
              (item, idx) => (
                <Reveal key={item} y={14} delay={160 + idx * 90}>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-5 w-5 rounded-sm grid place-items-center text-xs font-bold"
                      style={{
                        backgroundColor: bulletColor.base,
                        color: bulletColor.text,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ color: BRAND.title }}>{item}</span>
                  </li>
                </Reveal>
              )
            )}
          </ul>

          <div className="flex flex-wrap gap-3 mb-10">
            <Reveal y={12} delay={160}>
              <a
                href="/aboutus"
                className="inline-flex w-full items-center gap-2 rounded-sm font-semibold px-6 py-3 shadow-md transition hover:translate-y-[1px]"
                // TODO: change color on hover
                //                 onMouseEnter={(e) => {
                //   e.currentTarget.style.backgroundColor = PALETTE[4].back; // #E48B4F
                // }}
                // onMouseLeave={(e) => {
                //   e.currentTarget.style.backgroundColor = PALETTE[4].base; // #F3A96C
                // }}
                style={{
                  backgroundColor: PALETTE[4].base,   // #F3A96C
                  color: PALETTE[4].text,             // #001219
                }}
              >
                {t("about.cta1")}
              </a>
            </Reveal>

            <Reveal y={12} delay={220}>
              <a
                href="#services"
                className="inline-flex lg:w-full w-62 items-center gap-2 rounded-sm font-semibold px-6 py-3 border shadow-sm hover:translate-y-[1px]"
                style={{
                  backgroundColor: BRAND.bg,
                  border: `1px solid ${BRAND.accent}`,
                  color: BRAND.title,
                }}
              >
                {t("about.cta2")}
              </a>
            </Reveal>
          </div>

          <Reveal y={10} delay={260}>
            <div className="mt-6">
              <div
                className="text-xs uppercase tracking-wider mb-3"
                style={{ color: PALETTE[7].base }}
              >
                {t("about.insurance")}
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {[
                  "OSCAR",
                  "CIGNA",
                  "SUNSHINE HEALTH",
                  "HUMANA MEDICAID",
                  "AETNA",
                  "UNITED HEALTH CARE",
                  "HEALTH FIRST",
                ].map((logo, i) => (
                  <Reveal key={logo} y={8} delay={280 + i * 80}>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "rgba(0,0,0,0.8)" }}
                    >
                      {logo}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative">
          <div
            className="space-y-3 md:space-y-3 text-lg leading-relaxed mt-6"
            style={{ color: BRAND.title }}
          >
            {[t("about.text1"), t("about.text2"), t("about.text3")].map(
              (txt, i) => (
                <Reveal key={i} y={14} delay={80 + i * 120}>
                  <p>{txt}</p>
                </Reveal>
              )
            )}

            <Reveal y={16} delay={120}>
              <div className="mt-8 flex items-end justify-center gap-10">
                {/* CONTADOR 1: 10k */}
                <Reveal y={10} delay={140}>
                  <div className="flex flex-col items-center text-center">
                    <span
                      className="tabular-nums text-3xl md:text-4xl font-extrabold"
                      style={{ color: BRAND.cta }}
                    >
                      <AnimatedNumber
                        end={10}
                        suffix="k"
                        play={sectionInView}
                        durationMs={900}
                      />
                    </span>
                    <span
                      className="mt-1 text-sm"
                      style={{ color: "rgba(0,0,0,0.8)" }}
                    >
                      {t("about.stats.families")}
                    </span>
                  </div>
                </Reveal>

                <span
                  className="hidden sm:block h-10 w-px"
                  style={{ backgroundColor: BRAND.accent }}
                />

                {/* CONTADOR 2: 20+ */}
                <Reveal y={10} delay={200}>
                  <div className="flex flex-col items-center text-center">
                    <span
                      className="tabular-nums text-3xl md:text-4xl font-extrabold"
                      style={{ color: BRAND.cta }}
                    >
                      <AnimatedNumber end={20} suffix="+" play={sectionInView} />
                    </span>
                    <span
                      className="mt-1 text-sm"
                      style={{ color: "rgba(0,0,0,0.8)" }}
                    >
                      {t("about.stats.experience")}
                    </span>
                  </div>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsProfessional;
