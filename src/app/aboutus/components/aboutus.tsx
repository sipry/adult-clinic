"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import doctorjaime from "@/../public/assets/images/avatar.jpg";
import doctorjuan from "@/../public/assets/images/Juan.jpg";
import { useTranslation } from "@/app/contexts/TranslationContext";

/* ====================== Palette ====================== */
const PALETTE = {
  amber: "#B67B39", // dorado cálido
  moss: "#7C8C4D", // verde musgo
  wine: "#812D20", // vino terroso
  ochre: "#D8C27A", // ocre claro
  olive: "#4F5635", // oliva profundo
  cream: "#FAF4E6", // crema suave
  dark: "#2B2725", // marrón oscuro neutro
};

/* ====================== Utils ====================== */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// helper por si Next devuelve string o StaticImageData
type AssetModule = string | StaticImageData;
export const asset = (m?: AssetModule | null): string => {
  if (!m) return "";
  return typeof m === "string" ? m : m.src;
};

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

/* ====================== Reveal ====================== */
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

/* ====================== Animated Number ====================== */
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
    const onChange = (e: MediaQueryListEvent) =>
      (prefersReduced.current = e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!play) return;

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

  const display = React.useMemo(() => {
    const n = Math.round(value);
    const base = compact
      ? new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: fractionDigits,
      }).format(n).toLowerCase() // ← “10k”
      : new Intl.NumberFormat(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(n);
    return base + suffix;
  }, [value, compact, fractionDigits, suffix]);

  return <span className={className}>{display}</span>;
};

/* ====================== Types & Data ====================== */
type Doctor = {
  id: string;
  name: string;
  tagline: string;
  langs: string;
  bio: string;
  photo?: string | StaticImageData;
};

function Mission() {
  const { t } = useTranslation();
  return (
    <section style={{ backgroundColor: PALETTE.cream }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2
          className="text-2xl md:text-3xl font-extrabold mb-5"
          style={{ color: PALETTE.dark }}
        >
          {t("about.mission")}
        </h2>
        <div
          className="prose max-w-none leading-relaxed"
          style={{ color: PALETTE.olive }}
        >
          <p className="mt-0 mb-6 text-lg">{t("mission.text1")}</p>
          <p className="mt-0 text-lg">{t("mission.text2")}</p>
        </div>
      </div>
    </section>
  );
}

/* ====================== Main Component ====================== */
export default function AboutUs() {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInOutViewport(heroRef, { threshold: 0.2 });
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  // Lista de doctores traducida
  const DOCTORS: Doctor[] = useMemo(
    () => [
      {
        id: "dr-Jaime-acosta",
        name: "Dr. Jaime A. Acosta, MD",
        tagline: t("providers.dr1.title"),
        langs: t("providers.dr1.languages"),
        bio: t("provider.bio.dr1"),
        photo: doctorjaime,
      },
      {
        id: "dr-Juan-Ortiz",
        name: "Dr. Juan Ortiz Guevara, MD",
        tagline: t("providers.dr2.title"),
        langs: t("providers.dr2.languages"),
        bio: t("provider.bio.dr2"),
        photo: doctorjuan,
      },
    ],
    [t]
  );

  return (
    <main style={{ backgroundColor: PALETTE.cream }}>
      {/* Hero / About */}
      <section
        ref={heroRef}
        className="relative pt-30 md:pt-20 mb-20"
        style={{ backgroundColor: PALETTE.cream }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          <Reveal y={8}>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: PALETTE.moss }}
            >
              {t("about.pretitle")}
            </p>
          </Reveal>

          <Reveal y={12} delay={60}>
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-[1.1] mb-5"
              style={{ color: PALETTE.dark }}
            >
              {t("about.title.detail")}
            </h1>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p
              className="text-lg leading-relaxed max-w-none"
              style={{ color: PALETTE.olive }}
            >
              {t("about.text1.detail")}
            </p>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p
              className="text-lg leading-relaxed max-w-none mt-2"
              style={{ color: PALETTE.olive }}
            >
              {t("about.text2.detail")}
            </p>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p
              className="text-lg leading-relaxed max-w-none mt-2"
              style={{ color: PALETTE.olive }}
            >
              {t("about.text3.detail")}
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-3 mt-8">
            <Reveal y={12} delay={160}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 font-semibold shadow-lg transition hover:scale-105"
                style={{
                  backgroundColor: PALETTE.olive,
                  color: PALETTE.cream,
                }}
              >
                {t("about.cta2.detail")}
              </Link>
            </Reveal>
            <Reveal y={12} delay={220}>
              <Link
                href="#equipo"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 font-semibold shadow-sm transition hover:scale-105"
                style={{
                  backgroundColor: PALETTE.ochre,
                  color: PALETTE.dark,
                }}
              >
                {t("about.cta1.detail")}
              </Link>
            </Reveal>
          </div>

          <Reveal y={16} delay={240}>
            <div className="mt-10 flex items-end flex-wrap gap-8">
              <div className="flex flex-col items-start">
                <span
                  className="tabular-nums text-3xl md:text-4xl font-extrabold"
                  style={{ color: PALETTE.wine }}
                >
                  +
                  <AnimatedNumber
                    end={10000}
                    compact
                    durationMs={900}
                    delayMs={120}
                    play={heroInView}
                  />
                </span>
                <span className="mt-1 text-sm" style={{ color: PALETTE.olive }}>
                  {t("about.stats.families")}
                </span>
              </div>

              <span
                className="hidden sm:block h-10 w-px"
                style={{ backgroundColor: PALETTE.olive }}
              />

              <div className="flex flex-col items-start">
                <span
                  className="tabular-nums text-3xl md:text-4xl font-extrabold"
                  style={{ color: PALETTE.wine }}
                >
                  +
                  <AnimatedNumber end={20} durationMs={800} play={heroInView} />
                </span>
                <span className="mt-1 text-sm" style={{ color: PALETTE.olive }}>
                  {t("about.stats.experience")}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Misión */}
      <Mission />

      {/* Doctores / Providers */}
      {/* Doctores / Providers */}
      <section
        id="equipo"
        ref={sectionRef}
        className="relative z-10 py-14 md:py-20 scroll-mt-10"
        style={{ backgroundColor: PALETTE.cream }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <Reveal y={10}>
            <h2
              className="text-2xl md:text-3xl font-extrabold mb-3"
              style={{ color: PALETTE.dark }}
            >
              {t("providers.title")}
            </h2>
          </Reveal>
          <Reveal y={12}>
            <p style={{ color: PALETTE.olive, marginBottom: "2rem" }}>
              {t("about.equipo")}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {DOCTORS.map((d, i) => (
              <Reveal key={d.id} y={12} delay={i * 90}>
                <article
                  className="group relative rounded-xl p-6 transition h-full flex flex-col shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: PALETTE.cream, // mismo fondo
                    border: `1px solid ${PALETTE.olive}40`, // borde semitransparente
                    boxShadow:
                      "0 2px 6px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)", // sombra sutil
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 ring-1"
                      style={{
                        backgroundColor: `${PALETTE.olive}15`,
                        borderColor: `${PALETTE.olive}33`,
                      }}
                    >
                      {d.photo ? (
                        <Image
                          src={d.photo}
                          alt={`Foto de ${d.name}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="grid place-items-center h-full w-full text-[11px]"
                          style={{ color: `${PALETTE.dark}99` }}
                        >
                          Añade foto
                        </div>
                      )}
                    </div>
                    <div>
                      <h3
                        className="text-lg font-extrabold"
                        style={{ color: PALETTE.dark }}
                      >
                        {d.name}
                      </h3>
                      <p className="text-sm" style={{ color: PALETTE.olive }}>
                        {d.tagline}
                      </p>
                      <p
                        className="mt-1 text-[13px]"
                        style={{ color: `${PALETTE.dark}99` }}
                      >
                        {d.langs}
                      </p>
                    </div>
                  </div>

                  <p
                    className="mt-4 leading-relaxed"
                    style={{ color: PALETTE.dark }}
                  >
                    {((bio) => {
                      const MAX = 150;
                      return bio.length > MAX
                        ? bio.slice(0, MAX).trimEnd() + " ..."
                        : bio;
                    })(d?.bio ?? "")}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={`/provider/${d.id}`}
                      className="inline-flex items-center rounded-sm px-4 py-2 text-sm font-semibold shadow transition hover:scale-[1.02]"
                      style={{
                        backgroundColor: PALETTE.olive,
                        color: PALETTE.cream,
                      }}
                      aria-label={`Agendar cita con ${d.name}`}
                    >
                      {t("provider.cta")}
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
