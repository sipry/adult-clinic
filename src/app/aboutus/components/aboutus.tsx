"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import FemaleDoctor from "@/../public/assets/images/foto-doctora.jpg";
import MaleDoctor from "@/../public/assets/images/Bolumen.jpeg";
import balloon from "@/../public/assets/svg/balloon.svg";
import { useTranslation } from "@/app/contexts/TranslationContext";

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
      ? new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 0,
      }).format(n)
      : new Intl.NumberFormat(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(n);
    return fmt + suffix;
  }, [value, compact, fractionDigits, suffix]);

  return <span className={className}>{display}</span>;
};

/* ====================== Data ====================== */
const CONTACT = {
  phonePretty: "(407) 555-0134",
  phoneHref: "+14075550134",
  email: "pediatricians@yourhealthpediatrics.com",
  address: "Kissimmee, Condado de Osceola, FL",
};

type Doctor = {
  id: string;
  name: string;
  tagline: string;
  langs: string;
  bio: string;
  photo?: string | StaticImageData;
};

/* ====================== Sections ====================== */
function Description() {
  const { t } = useTranslation();
  return (
    <section className="relative z-0 py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal y={10}>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
            {t("about.details.title2")}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            { title: t("about.vacunas"), desc: t("about.vacunas.detail") },
            { title: t("about.enfermedades"), desc: t("about.enfermedades.detail") },
            { title: t("about.newborn"), desc: t("about.newborn.detail") },
            { title: t("about.peso"), desc: t("about.peso.detail") },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8 mb-3" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" className="stroke-lime-800/20" strokeWidth="2" />
                <path
                  d="M7 12l3 3 7-7"
                  className="stroke-lime-800"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-slate-600 mt-6">{t("about.text3")}</p>
      </div>
    </section>
  );
}

function Mission() {
  const { t } = useTranslation();
  return (
    <section className="relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">
          {t("about.mission")}
        </h2>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
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
  const sectionRef = useRef<HTMLElement>(null);;

  // Build translated doctors list *inside* the component
  const DOCTORS: Doctor[] = useMemo(
    () => [
      {
        id: "dr-maria-rodriguez",
        name: "Dra. Martha I. Acosta, MD",
        tagline: t("providers.dr1.title"),
        langs: t('providers.dr1.languages'),
        bio: t('provider.bio.dr1'),
        photo: FemaleDoctor,
      },
      {
        id: "dr-james-thompson",
        name: "Dr. Eduardo F. Bolumen, MD",
        tagline: t("providers.dr2.title"),
        langs: t('providers.dr1.languages'),
        bio: t('provider.bio.dr2'),
        photo: MaleDoctor,
      },
    ],
    [t]
  );


  return (
    <main className="relative overflow-hidden">
      {/* Hero (SVGs dentro del section para que no queden tapados) */}
      <section ref={heroRef} className="relative pt-30 md:pt-20 bg-white mb-20">
        {/* Decorativos */}
        <img
          src={asset(balloon)}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-60 top-40 opacity-20 w-[500px] z-10 bounce-slow"
        />

        {/* Contenido */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          <Reveal y={8}>
            <p className="text-xs font-semibold tracking-[0.2em] text-lime-900 uppercase mb-3">
              {t("about.pretitle")}
            </p>
          </Reveal>

          <Reveal y={12} delay={60}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-5">
              {t("about.title.detail")}
            </h1>
          </Reveal>

          <Reveal y={14} delay={120}>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
              {t("about.text1")}
            </p>
          </Reveal>
           <Reveal y={14} delay={120}>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mt-2">
              {t("about.text2")}
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-3 mt-8">
            <Reveal y={12} delay={160}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-lime-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
              >
                {t("about.cta2.detail")}
              </Link>
            </Reveal>
            <Reveal y={12} delay={220}>
              <Link
                href="#equipo"
                className="inline-flex items-center gap-2 rounded-sm bg-amber-200 text-slate-800 transition hover:scale-105 font-semibold px-6 py-3 shadow-sm"
              >
                {t("about.cta1.detail")}
              </Link>
            </Reveal>
          </div>

          {/* Métricas (play atado al heroInView) */}
          <Reveal y={16} delay={240}>
            <div className="mt-10 flex items-end flex-wrap gap-8">
              <div className="flex flex-col items-start">
                <span className="tabular-nums text-3xl md:text-4xl font-extrabold text-lime-700">
                  +
                  <AnimatedNumber
                    end={10000}
                    compact
                    durationMs={900}
                    delayMs={120}
                    play={heroInView}
                  />
                </span>

                <span className="mt-1 text-sm text-slate-600">
                  {t("about.stats.families")}
                </span>
              </div>
              <span className="hidden sm:block h-10 w-px bg-slate-200" />
              <div className="flex flex-col items-start">
                <span className="tabular-nums text-3xl md:text-4xl font-extrabold text-lime-700">
                  +
                  <AnimatedNumber end={20} durationMs={800} play={heroInView} />
                </span>
                <span className="mt-1 text-sm text-slate-600">
                  {t("about.stats.experience")}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Misión */}
      <Mission />

      {/* Doctores */}
      <section id="equipo" ref={sectionRef} className="relative z-10 py-14 md:py-20 bg-white scroll-mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal y={10}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              {t("providers.title")}
            </h2>
          </Reveal>
          <Reveal y={12}>
            <p className="text-slate-600 mb-8">{t("about.equipo")}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {DOCTORS.map((d, i) => (
              <Reveal key={d.name} y={12} delay={i * 90}>
                <article className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 rounded-xl bg-slate-100 ring-1 ring-slate-200 shrink-0 overflow-hidden">
                      {d.photo ? (
                        <Image
                          src={d.photo}
                          alt={`Foto de ${d.name}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid place-items-center h-full w-full text-[11px] text-slate-500">
                          Añade foto
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{d.name}</h3>
                      <p className="text-sm text-slate-600">{d.tagline}</p>
                      <p className="mt-1 text-[13px] text-slate-500">{d.langs}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-700 leading-relaxed">
                      {((bio) => {
                        const MAX = 150; // cámbialo a lo que quieras
                        return bio.length > MAX ? bio.slice(0, MAX).trimEnd() + " ..." : bio;
                      })(d?.bio ?? "")}
                    </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={`/provider/${d.id}`}
                      className="inline-flex items-center rounded-sm bg-lime-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02]"
                      aria-label={`Agendar cita con ${d.name}`}
                    >
                      {t('proider.cta')}
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
