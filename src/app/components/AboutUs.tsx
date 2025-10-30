"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "../contexts/TranslationContext";
import brandGrid from "@/../public/assets/svg/brand-grid.svg";

/* -------------------- Palette -------------------- */
const PALETTE = {
  amber: "#B67B39", // dorado cálido
  moss: "#7C8C4D", // verde musgo
  wine: "#812D20", // vino terroso
  ochre: "#D8C27A", // ocre claro
  olive: "#4F5635", // oliva profundo
  cream: "#FAF4E6", // crema suave
  dark: "#2B2725", // marrón oscuro neutro
};

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
          ents.forEach((e) => setInView(e.isIntersecting || e.intersectionRatio > 0)),
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInOutViewport(ref, { threshold, rootMargin });
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

/* -------------------- Count-up -------------------- */
type AnimatedNumberProps = {
  start?: number;
  end: number;
  durationMs?: number;
  delayMs?: number;
  fractionDigits?: number;
  suffix?: string;
  compact?: boolean;
  className?: string;
  play?: boolean;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  start = 0,
  end,
  durationMs = 1000,
  delayMs = 0,
  fractionDigits = 0,
  suffix = "",
  compact = false,
  className,
  play = true,
}) => {
  const [value, setValue] = useState<number>(start);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.current = mql.matches;
    const onChange = (e: MediaQueryListEvent) => (prefersReduced.current = e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!play) return;
    if (prefersReduced.current || durationMs <= 0) {
      setValue(end);
      return;
    }
    setValue(start);

    const run = () => {
      const t0 = performance.now();
      const delta = end - start;
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / durationMs);
        setValue(start + delta * easeOutCubic(t));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (delayMs && delayMs > 0) {
      timeoutRef.current = window.setTimeout(run, delayMs);
    } else {
      run();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current!);
      rafRef.current = null;
      timeoutRef.current = null;
    };
  }, [play, start, end, durationMs, delayMs]);

  const display = useMemo(() => {
    const n = Math.round(value);
    const fmt = compact
      ? new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 0 }).format(n)
      : new Intl.NumberFormat(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(n);
    return fmt + suffix;
  }, [value, compact, fractionDigits, suffix]);

  return <span className={className}>{display}</span>;
};

/* -------------------- Component -------------------- */
export const AboutUsProfessional: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInOutViewport(sectionRef, { threshold: 0.2 });
  const { t } = useTranslation();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-10"
      style={{ backgroundColor: PALETTE.cream }}
    >
      {/* Decorative SVGs */}


      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        {/* Left column */}
        <div>
          <Reveal y={8}>
            <div className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: PALETTE.moss }}>
              {t("about.pretitle")}
            </div>
          </Reveal>

          <Reveal y={12} delay={60}>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-5"
              style={{ color: PALETTE.dark }}>
              {t("about.title")}
            </h2>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p className="text-lg leading-relaxed mb-6"
              style={{ color: PALETTE.olive }}>
              {t("about.subtitle")}
            </p>
          </Reveal>

          <ul className="space-y-3 mb-8 mt-6">
            {[t("about.bullet1"), t("about.bullet2"), t("about.bullet3")].map((item, idx) => (
              <Reveal key={item} y={14} delay={160 + idx * 90}>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-5 w-5 rounded-sm grid place-items-center text-xs font-bold"
                    style={{ backgroundColor: PALETTE.ochre, color: PALETTE.dark }}>
                    ✓
                  </span>
                  <span style={{ color: PALETTE.dark }}>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mb-10">
            <Reveal y={12} delay={160}>
              <a href="/aboutus"
                className="inline-flex w-full items-center gap-2 rounded-sm font-semibold px-6 py-3 shadow-lg transition"
                style={{
                  backgroundColor: PALETTE.olive,
                  color: PALETTE.cream,
                }}>
                {t("about.cta1")}
              </a>
            </Reveal>
            <Reveal y={12} delay={220}>
              <a href="#services"
                className="inline-flex lg:w-full w-62 items-center gap-2 rounded-sm font-semibold px-6 py-3 shadow-sm"
                style={{
                  backgroundColor: PALETTE.cream,
                  border: `1px solid ${PALETTE.olive}`,
                  color: PALETTE.olive,
                }}>
                {t("about.cta2")}
              </a>
            </Reveal>
          </div>

          <Reveal y={10} delay={260}>
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider mb-3"
                style={{ color: PALETTE.olive }}>
                {t("about.insurance")}
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-70 grayscale">
                {["OSCAR",
                  "CIGNA",
                  "SUNSHINE HEALTH",
                  "HUMANA MEDICAID",
                  "AETNA",
                  "UNITED HEALTH CARE",
                  "HEALTH FIRST"].map((logo, i) => (
                    <Reveal key={logo} y={8} delay={280 + i * 80}>
                      <span className="text-sm font-semibold"
                        style={{ color: PALETTE.olive }}>
                        {logo}
                      </span>
                    </Reveal>
                  ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column */}
        <div className="relative">
          <div className="space-y-3 md:space-y-3 text-lg leading-relaxed mt-6"
            style={{ color: PALETTE.dark }}>
            {[t("about.text1"), t("about.text2"), t("about.text3")].map((txt, i) => (
              <Reveal key={i} y={14} delay={80 + i * 120}>
                <p>{txt}</p>
              </Reveal>
            ))}

            <Reveal y={16} delay={120}>
              <div className="mt-8 flex items-end justify-center gap-10">
                <Reveal y={10} delay={140}>
                  <div className="flex flex-col items-center text-center">
                    <span className="tabular-nums text-3xl md:text-4xl font-extrabold"
                      style={{ color: PALETTE.wine }}>
                      <AnimatedNumber
                        end={10000}
                        compact
                        durationMs={900}
                        delayMs={120}
                        play={sectionInView}
                      />
                    </span>
                    <span className="mt-1 text-sm"
                      style={{ color: PALETTE.olive }}>
                      {t("about.stats.families")}
                    </span>
                  </div>
                </Reveal>

                <span className="hidden sm:block h-10 w-px"
                  style={{ backgroundColor: PALETTE.olive }} />

                <Reveal y={10} delay={200}>
                  <div className="flex flex-col items-center text-center">
                    <span className="tabular-nums text-3xl md:text-4xl font-extrabold"
                      style={{ color: PALETTE.wine }}>
                      <AnimatedNumber end={20} suffix="+" durationMs={800} play={sectionInView} />
                    </span>
                    <span className="mt-1 text-sm"
                      style={{ color: PALETTE.olive }}>
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
