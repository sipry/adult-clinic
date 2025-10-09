"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Baby, Brain, Activity, ChevronLeft, ChevronRight, Heart, Clock, Shield, Syringe, Eye,
} from "lucide-react";
import Link from "next/link";
import { useTranslation, ServiceTranslation } from "@/app/contexts/TranslationContext";

/* ---------------- Types & Icons ---------------- */
type IconKey = "baby" | "brain" | "activity" | "heart" | "clock" | "shield" | "syringe" | "eye";
type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Service = {
  id: string;
  icon: IconKey;
  title: string;
  description: string;
  href?: string;
};

const ICONS: Record<IconKey, IconCmp> = {
  baby: Baby, brain: Brain, activity: Activity, heart: Heart,
  clock: Clock, shield: Shield, syringe: Syringe, eye: Eye,
};

// Ya no rotamos colores; dejamos el arreglo por si quieres volver a usarlo.

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
const withAlpha = (hex: string, a = 0.85) => { const { r, g, b } = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; };
const iconText = (hex: string) => { const { r, g, b } = hexToRgb(hex); const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; return L > 0.6 ? "#1f2937" : "#fff"; };
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

/* ---------------- Component ---------------- */
const ServicesRail: React.FC<{ featuredKeys?: string[]; colorHex?: string }> = ({
  featuredKeys = ["well", "immunizations", "vision"],
  colorHex, // <-- nuevo
}) => {
  const { t, tArray } = useTranslation();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railW, setRailW] = useState(0);
  const [cardW, setCardW] = useState(280);
  const [cardH, setCardH] = useState(320);
  const [gap, setGap] = useState(16);
  const [index, setIndex] = useState(0); // índice lógico (0..N-1)
  const adjustingRef = useRef(false);
  const lastScrollLeftRef = useRef(0);

  // Color uniforme (puedes cambiar el default aquí o pasar colorHex como prop)
  const uniformHex = colorHex ?? "#9cd3f6";

  // MÁS COLCHÓN DE CLONES
  const CLONES = 4;
  const EPS = 0.5; // histéresis en píxeles

  // --- services desde i18n ---
  const i18nServices = tArray<ServiceTranslation>("services.list");
  const ICON_BY_KEY: Partial<Record<string, IconKey>> = {
    well: "baby", "well-visit": "baby",
    sick: "clock", "sick-visit": "clock", followup: "clock", "follow-up": "clock",
    immunizations: "syringe",
    "food-allergy": "activity", "food-allergy-test": "activity",
    "environmental-allergy": "activity", "environmental-allergy-test": "activity",
    vision: "eye", "vision-screening": "eye",
    audiology: "activity", "audiology-screening": "activity",
    obesity: "heart", "obesity-care-plan": "heart",
    asthma: "activity", "asthma-care-plan": "activity",
    adhd: "brain", "adhd-care-plan": "brain",
    adolescent: "heart", urgent: "clock", physical: "shield", covid: "syringe",
  };

  const allServices: Service[] = i18nServices.map((s, idx) => {
    const id = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
    const icon = ICON_BY_KEY[id] ?? "heart";
    return { id, icon, title: s.title || `Servicio ${idx + 1}`, description: s.description || "", href: `/services?detail=${encodeURIComponent(id)}` };
  });

  // --- ordenar: destacados centrados ---
  const ordered = useMemo(() => {
    const featured = allServices.filter((s) => featuredKeys.includes(s.id));
    const others = allServices.filter((s) => !featuredKeys.includes(s.id));
    const left: Service[] = []; const right: Service[] = [];
    others.forEach((s, i) => (i % 2 === 0 ? right : left).push(s));
    return [...left.reverse(), ...featured, ...right];
  }, [allServices, featuredKeys]);

  const N = ordered.length;

  // --- clones para loop infinito ---
  const headClones = ordered.slice(0, CLONES);
  const tailClones = ordered.slice(-CLONES);
  const extended = [...tailClones, ...ordered, ...headClones];

  // --- dims + scroll-padding ---
  const recomputeDims = useCallback(() => {
    const w = railRef.current?.clientWidth ?? 0;
    setRailW(w);
    if (w < 440) { setCardW(240); setGap(12); setCardH(260); }
    else if (w < 768) { setCardW(260); setGap(14); setCardH(280); }
    else if (w < 1024) { setCardW(280); setGap(16); setCardH(300); }
    else { setCardW(300); setGap(18); setCardH(320); }
  }, []);

  useEffect(() => {
    recomputeDims();
    window.addEventListener("resize", recomputeDims);
    return () => window.removeEventListener("resize", recomputeDims);
  }, [recomputeDims]);

  const snapSize = cardW + gap;
  const scrollPad = Math.max(0, (railW - cardW) / 2);

  // --- TELEPORT por píxeles ---
  const instantJumpToPx = (px: number, after?: () => void) => {
    const el = railRef.current; if (!el) return;
    adjustingRef.current = true;
    const prevBehavior = el.style.scrollBehavior;
    const prevSnap = el.style.scrollSnapType;

    el.style.scrollBehavior = "auto";
    el.style.scrollSnapType = "none";
    el.scrollLeft = px;

    void el.offsetHeight;
    requestAnimationFrame(() => {
      el.style.scrollBehavior = prevBehavior || "smooth";
      el.style.scrollSnapType = prevSnap || "x mandatory";
      adjustingRef.current = false;
      if (after) after();
    });
  };

  const instantJumpToRaw = (rawIndex: number, after?: () => void) =>
    instantJumpToPx(rawIndex * snapSize, after);

  // --- inicio ---
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      instantJumpToRaw(CLONES, () => setIndex(0));
      lastScrollLeftRef.current = CLONES * snapSize;
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapSize, N]);

  // --- onScroll ---
  const onScroll = () => {
    const el = railRef.current; if (!el || adjustingRef.current) return;

    const x = el.scrollLeft;
    const dir = x - lastScrollLeftRef.current; // (dir no se usa pero puede servir para debug)
    lastScrollLeftRef.current = x;

    const leftBoundPx  = (CLONES - 1) * snapSize;
    const rightBoundPx = (CLONES + N) * snapSize;
    const tooLeft      = x < (leftBoundPx - EPS);
    const tooRight     = x > (rightBoundPx + EPS);

    if (tooLeft) { instantJumpToPx(x + N * snapSize); return; }
    if (tooRight) { instantJumpToPx(x - N * snapSize); return; }

    const raw = Math.round(x / snapSize);
    const logical = ((raw - CLONES) % N + N) % N;
    setIndex(logical);
  };

  // --- avanzar una (flechas) ---
  const scrollByOne = (dir: -1 | 1) => {
    const el = railRef.current; if (!el) return;
    const x = el.scrollLeft;

    const rightBoundPx = (CLONES + N) * snapSize;
    const leftBoundPx  = (CLONES - 1) * snapSize;

    if (dir === 1 && x > rightBoundPx - snapSize) {
      instantJumpToPx(x - N * snapSize, () => {
        el.scrollTo({ left: el.scrollLeft + snapSize, behavior: "smooth" });
      });
      return;
    }
    if (dir === -1 && x < leftBoundPx) {
      instantJumpToPx(x + N * snapSize, () => {
        el.scrollTo({ left: el.scrollLeft - snapSize, behavior: "smooth" });
      });
      return;
    }

    el.scrollTo({ left: x + dir * snapSize, behavior: "smooth" });
  };

  const scrollToLogical = (i: number) => {
    const el = railRef.current; if (!el) return;
    el.scrollTo({ left: (CLONES + i) * snapSize, behavior: "smooth" });
  };

  return (
    <section id="services" className="relative py-12 md:py-20 bg-white scroll-mt-15">
      <div>
        {/* ---------- HEADER ---------- */}
        <div className="mb-4 md:mb-6 max-w-7xl mx-auto px-6">
          <div className="space-y-3 md:space-y-0 md:flex md:items-end md:justify-between md:gap-4">
            {/* Bloque de textos */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-sky-900 uppercase">
                {t("services.pretitle")}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-6">
                {t("services.title")}
              </h2>
              <p className="mt-1 text-slate-600 text-base md:text-lg mt-3">
                {t("services.subtitle")}
              </p>
            </div>

            {/* Acciones SOLO en md+ (derecha) */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/services"
                className="inline-flex items-center rounded-md bg-sky-900 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:scale-105"
              >
                {t("service.seeAll.button") || "See all services"}
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollByOne(-1)}
                  className="inline-flex px-10 py-3 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollByOne(1)}
                  className="inline-flex px-10 py-3 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Acciones en móvil */}
          <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
            <Link
              href="/services"
              className="inline-flex items-center rounded-md bg-sky-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              {t("service.seeAll.button") || "See all services"}
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollByOne(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollByOne(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------- RAIL INFINITO ---------- */}
        <div className="relative">
          <div
            ref={railRef}
            onScroll={onScroll}
            className="scrollbar-none overflow-x-auto overflow-y-hidden py-10 snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              scrollPaddingLeft: scrollPad,
              scrollPaddingRight: scrollPad,
            }}
            aria-label={t("services.title")}
          >
            <ul
              className="flex items-stretch"
              style={{
                gap,
                paddingInlineStart: scrollPad,
                paddingInlineEnd: scrollPad,
              }}
            >
              {extended.map((s, i) => {
                const Icon = ICONS[s.icon];

                // ---- Color uniforme en todos los items ----
                const hex = uniformHex;
                const chipBg = withAlpha(hex, 0.18);
                const chipFg = iconText(hex);
                const backBg = hex;
                const backFg = iconText(hex);
                const btnBg = backFg === "#fff" ? "rgba(255,255,255,0.96)" : "rgba(0,0,0,0.82)";
                const btnText = backFg === "#fff" ? "#111827" : "#fff";
                const btnBorder = backFg === "#fff" ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(0,0,0,0.28)";

                return (
                  <li
                    key={`${s.id}-${i}`}
                    className="snap-center"
                    style={{
                      minWidth: cardW,
                      maxWidth: cardW,
                    }}
                  >
                    {/* Flip container */}
                    <div className="group h-full w-full [perspective:1200px]">
                      <article
                        className={[
                          "relative w-full rounded-2xl ring-1 ring-slate-200 bg-white",
                          "shadow-[0_18px_48px_-24px_rgba(0,0,0,0.24)]",
                          "transform-gpu [transform-style:preserve-3d]",
                          "transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
                          "group-hover:[transform:rotateY(180deg)]",
                          "focus-within:[transform:rotateY(180deg)]",
                        ].join(" ")}
                        style={{ height: cardH }}
                        tabIndex={0}
                      >
                        {/* Frente */}
                        <div className="absolute inset-0 p-5 md:p-6 [backface-visibility:hidden] flex flex-col items-center justify-center text-center">
                          <div
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full grid place-items-center mb-4"
                            style={{ background: chipBg, color: chipFg, border: `1px solid ${withAlpha(hex, 0.35)}` }}
                          >
                            <Icon className="w-6 h-6 md:w-7 md:h-7" />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-slate-900">{s.title}</h3>
                          <p className="mt-2 text-slate-600 text-sm md:text-base line-clamp-2 max-w-[30ch]">
                            {s.description}
                          </p>
                          <span className="mt-4 inline-flex items-center text-sky-900 text-sm font-medium">
                            {t("services.details") || "View Details"}
                          </span>
                        </div>

                        {/* Back */}
                        <div
                          className="absolute inset-0 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center text-center p-5 md:p-6"
                          style={{
                            backgroundColor: backBg,
                            backgroundImage: "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.12), transparent 60%)",
                            color: backFg,
                          }}
                        >
                          <h4 className="font-extrabold text-xl md:text-2xl leading-tight mb-3 max-w-[28ch]">
                            {s.title}
                          </h4>
                          <div
                            className="text-sm md:text-base leading-relaxed max-w-[34ch] mb-4"
                            style={{ color: backFg === "#fff" ? "rgba(255,255,255,0.92)" : "rgba(31,41,55,0.9)" }}
                          >
                            {s.description}
                          </div>
                          <Link
                            href={s.href || "#"}
                            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold hover:scale-105"
                            style={{ backgroundColor: btnBg, color: btnText, border: btnBorder }}
                          >
                            {t("services.details") || "View Details"}
                          </Link>
                        </div>
                      </article>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Dots */}
          <div className="mt-4 w-full flex justify-center">
            <div className="flex items-center gap-2">
              {ordered.map((_, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => scrollToLogical(i)}
                    aria-label={`Go to card ${i + 1}`}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      isActive ? "w-6 bg-sky-900" : "w-2.5 bg-slate-300 hover:bg-slate-400",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>

          {/* Flechas debajo de los dots */}
          <div className="flex justify-center gap-3 mt-5">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByOne(-1)}
              className="inline-flex h-10 w-30 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByOne(1)}
              className="inline-flex h-10 w-30 items-center justify-center rounded-md bg-sky-100 text-slate-800 shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ServicesRail;
