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

/* ---------------- Paleta de colores por tarjeta ---------------- */
const PALETTE = [
  { base: "#B67B39", light: "#E2C8A6", dark: "#2B2725" }, // ámbar cálido
  { base: "#7C8C4D", light: "#C5CE9A", dark: "#1F1C18" }, // verde musgo
  { base: "#812D20", light: "#C47A6E", dark: "#FAF4E6" }, // vino terroso
  { base: "#D8C27A", light: "#F4E9B3", dark: "#2B2725" }, // ocre claro
  { base: "#4F5635", light: "#A8AD87", dark: "#FAF4E6" }, // oliva profundo
];

/* ---------------- Utilidades ---------------- */
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
const withAlpha = (hex: string, a = 0.85) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

/* ---------------- Component ---------------- */
const ServicesRail: React.FC<{ featuredKeys?: string[] }> = ({
  featuredKeys = ["preventive-medicine", "adult-immunizations"],
}) => {
  const { t, tArray } = useTranslation();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railW, setRailW] = useState(0);
  const [cardW, setCardW] = useState(280);
  const [cardH, setCardH] = useState(320);
  const [gap, setGap] = useState(16);
  const [index, setIndex] = useState(0);
  const adjustingRef = useRef(false);
  const lastScrollLeftRef = useRef(0);

  // --- Services desde i18n ---
  const i18nServices = tArray<ServiceTranslation>("services.list");
  const ICON_BY_KEY: Partial<Record<string, IconKey>> = {
    "preventive-medicine": "shield",
    "adult-immunizations": "syringe",
    "minor-injury-treatment": "activity",
    "chronic-disease-management": "heart",
  };

  const allServices: Service[] = i18nServices.map((s, idx) => {
    const id = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
    const icon = ICON_BY_KEY[id] ?? "heart";
    return { id, icon, title: s.title || `Service ${idx + 1}`, description: s.description || "", href: `/services?detail=${encodeURIComponent(id)}` };
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
  const CLONES = 4;
  const EPS = 0.5;
  const headClones = ordered.slice(0, CLONES);
  const tailClones = ordered.slice(-CLONES);
  const extended = [...tailClones, ...ordered, ...headClones];

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

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      instantJumpToPx(CLONES * snapSize);
      lastScrollLeftRef.current = CLONES * snapSize;
      setIndex(0);
    });
    return () => window.cancelAnimationFrame(id);
  }, [snapSize, N]);

  const onScroll = () => {
    const el = railRef.current; if (!el || adjustingRef.current) return;
    const x = el.scrollLeft;
    lastScrollLeftRef.current = x;
    const leftBoundPx = (CLONES - 1) * snapSize;
    const rightBoundPx = (CLONES + N) * snapSize;
    if (x < (leftBoundPx - EPS)) { instantJumpToPx(x + N * snapSize); return; }
    if (x > (rightBoundPx + EPS)) { instantJumpToPx(x - N * snapSize); return; }
    const raw = Math.round(x / snapSize);
    const logical = ((raw - CLONES) % N + N) % N;
    setIndex(logical);
  };

  const scrollByOne = (dir: -1 | 1) => {
    const el = railRef.current; if (!el) return;
    el.scrollTo({ left: el.scrollLeft + dir * snapSize, behavior: "smooth" });
  };

  const scrollToLogical = (i: number) => {
    const el = railRef.current; if (!el) return;
    el.scrollTo({ left: (CLONES + i) * snapSize, behavior: "smooth" });
  };

  /* ------------------- Render ------------------- */
  return (
    <section id="services" className="relative py-12 md:py-20" style={{ backgroundColor: "#FAF4E6" }}>
      <div>
        {/* ---------- HEADER ---------- */}
        <div className="mb-4 md:mb-6 max-w-7xl mx-auto px-6">
          <div className="space-y-3 md:space-y-0 md:flex md:items-end md:justify-between md:gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em]" style={{ color: "#7C8C4D" }}>
                {t("services.pretitle")}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: "#2B2725" }}>
                {t("services.title")}
              </h2>
              <p className="mt-3 text-base md:text-lg" style={{ color: "#4F5635" }}>
                {t("services.subtitle")}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                href="/services"
                className="inline-flex items-center rounded-md px-10 py-3 text-sm font-semibold text-white shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: "#B67B39" }}
              >
                {t("service.seeAll.button") || "See all services"}
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollByOne(-1)}
                  className="inline-flex px-10 py-3 items-center justify-center rounded-md shadow-sm"
                  style={{ backgroundColor: "rgba(124,140,77,0.15)", color: "#2B2725" }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollByOne(1)}
                  className="inline-flex px-10 py-3 items-center justify-center rounded-md shadow-sm"
                  style={{ backgroundColor: "rgba(124,140,77,0.15)", color: "#2B2725" }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
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
                const color = PALETTE[i % PALETTE.length];

                return (
                  <li
                    key={`${s.id}-${i}`}
                    className="snap-center"
                    style={{
                      minWidth: cardW,
                      maxWidth: cardW,
                    }}
                  >
                    <div className="group h-full w-full [perspective:1200px]">
                      <article
                        className={[
                          "relative w-full rounded-2xl ring-1 ring-slate-200",
                          "shadow-[0_18px_48px_-24px_rgba(0,0,0,0.24)]",
                          "transform-gpu [transform-style:preserve-3d]",
                          "transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
                          "group-hover:[transform:rotateY(180deg)]",
                          "focus-within:[transform:rotateY(180deg)]",
                        ].join(" ")}
                        style={{ height: cardH }}
                        tabIndex={0}
                      >
                        {/* Frente con el MISMO color base */}
                        <div
                          className="absolute inset-0 p-5 md:p-6 [backface-visibility:hidden] flex flex-col items-center justify-center text-center rounded-2xl"
                          style={{
                            backgroundColor: color.base,
                            color: color.dark,
                            backgroundImage: "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.1), transparent 60%)",
                          }}
                        >
                          <div
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full grid place-items-center mb-4"
                            style={{
                              background: withAlpha(color.light, 0.25),
                              color: color.dark,
                              border: `1px solid ${withAlpha(color.dark, 0.3)}`,
                            }}
                          >
                            <Icon className="w-6 h-6 md:w-7 md:h-7" />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold">{s.title}</h3>
                          <p className="mt-2 text-sm md:text-base line-clamp-2 max-w-[30ch]" style={{ opacity: 0.9 }}>
                            {s.description}
                          </p>
                          <span className="mt-4 inline-flex items-center text-sm font-medium underline-offset-2 hover:underline" style={{ color: color.dark }}>
                            {t("services.details") || "View Details"}
                          </span>
                        </div>

                        {/* Reverso (mismo color base) */}
                        <div
                          className="absolute inset-0 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center text-center p-5 md:p-6"
                          style={{
                            backgroundColor: color.base,
                            color: color.dark,
                          }}
                        >
                          <h4 className="font-extrabold text-xl md:text-2xl leading-tight mb-3 max-w-[28ch]">
                            {s.title}
                          </h4>
                          <div className="text-sm md:text-base leading-relaxed max-w-[34ch] mb-4 opacity-95">
                            {s.description}
                          </div>
                          <Link
                            href={s.href || "#"}
                            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
                            style={{
                              backgroundColor: color.light,
                              color: color.dark,
                            }}
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
                const color = PALETTE[i % PALETTE.length];
                return (
                  <button
                    key={i}
                    onClick={() => scrollToLogical(i)}
                    aria-label={`Go to card ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${isActive ? "w-6" : "w-2.5"}`}
                    style={{
                      backgroundColor: isActive ? color.base : withAlpha(color.base, 0.4),
                    }}
                  />
                );
              })}
            </div>
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
