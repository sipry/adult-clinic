"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Baby, Brain, Activity, Heart, Clock, Shield, Syringe, Eye,
} from "lucide-react";
import { useTranslation, ServiceTranslation } from "@/app/contexts/TranslationContext";

/* ---------- Tipos & Iconos ---------- */
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

const ICON_ACCENTS = ["#111827", "#0f172a", "#0b1020", "#121212"] as const; // acentos sobrios
const ACCENT = "#0ea5e9";

/* Gradientes para el dorso (rotan por índice) */
const BACKGROUNDS = [
  "bg-gradient-to-br from-sky-600 to-sky-800",
  "bg-gradient-to-br from-fuchsia-600 to-fuchsia-800",
  "bg-gradient-to-br from-emerald-600 to-emerald-800",
  "bg-gradient-to-br from-amber-500 to-orange-700",
  "bg-gradient-to-br from-indigo-600 to-indigo-800",
  "bg-gradient-to-br from-rose-600 to-rose-800",
];

const ServicesShowcaseFlipMasonry: React.FC<{
  featuredKeys?: string[];
  initialCount?: number;
}> = ({ featuredKeys = ["well", "immunizations", "vision"], initialCount = 5 }) => {
  const { t, tArray } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // i18n -> servicios
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

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const allServices: Service[] = useMemo(
    () =>
      i18nServices.map((s, idx) => {
        const id = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
        const icon = ICON_BY_KEY[id] ?? "heart";
        return {
          id,
          icon,
          title: s.title || `Service ${idx + 1}`,
          description: s.description || "",
          href: `/services?detail=${encodeURIComponent(id)}`,
        };
      }),
    [i18nServices]
  );

  // Destacados primero
  const ordered = useMemo(() => {
    const featured = allServices.filter((s) => featuredKeys.includes(s.id));
    const others = allServices.filter((s) => !featuredKeys.includes(s.id));
    return [...featured, ...others];
  }, [allServices, featuredKeys]);

  const visibleItems = expanded ? ordered : ordered.slice(0, Math.min(initialCount, ordered.length));

  /** Heurística de span: patrón + contenido */
  const getSpan = (globalIndex: number, s: Service): number => {
    // Patrón visual base (ritmo)
    let base = 1;
    const m = globalIndex % 7;
    if (m === 0) base = 3;
    else if (m === 3 || m === 5) base = 2;

    // Ajuste por contenido (estimación por longitud)
    const tl = (s.title || "").length;
    const dl = (s.description || "").length;

    // Títulos largos suben a 2
    if (tl > 42) base = Math.max(base, 2);

    // Descripción mediana a larga sube a 2–3
    if (dl > 240) base = Math.max(base, 3);
    else if (dl > 140) base = Math.max(base, 2);

    // FIX puntual: las #2 y #3 (índices 1 y 2) tienden a cortarse en tu data → súbelas
    if (globalIndex === 1) base = Math.max(base, 2);
    if (globalIndex === 2) base = Math.max(base, 3);

    return Math.min(base, 3);
  };

  return (
    <section className="relative py-14 md:py-20 bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-slate-700 uppercase">
              {t("services.pretitle")}
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {t("services.title")}
            </h2>
            <p className="mt-1 text-slate-600 text-base md:text-lg">
              {t("services.subtitle")}
            </p>
          </div>
          <Link
            href="/services"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            {t("service.seeAll.button") || "See all services"}
          </Link>
        </div>
      </div>

      {/* Grid tipo masonry (con flip) */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <ul className="masonry grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map((s) => {
            const globalIndex = ordered.findIndex((x) => x.id === s.id);
            const span = getSpan(globalIndex, s);
            const Icon = ICONS[s.icon];
            const dark = ICON_ACCENTS[globalIndex % ICON_ACCENTS.length];
            const backBg = BACKGROUNDS[globalIndex % BACKGROUNDS.length];

            return (
              <li key={s.id} style={{ gridRow: `span ${span} / span ${span}` }}>
                {/* Flip Scene */}
                <div className="group relative h-full w-full flip-scene">
                  <div className="flip-card rounded-2xl ring-1 ring-slate-200">
                    {/* FRONT */}
                    <div className="flip-face flip-front rounded-2xl bg-gradient-to-b from-white to-slate-50 flex flex-col h-full overflow-hidden">
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid place-items-center w-12 h-12 rounded-lg ring-1"
                            style={{
                              background: "white",
                              color: dark,
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-black tracking-tight text-slate-900 break-words">
                            {s.title}
                          </h3>
                        </div>

                        {/* el front ya no corta agresivo; solo un límite suave por fila */}
                        <p className="mt-4 text-slate-600 text-sm md:text-base overflow-hidden" style={{ maxHeight: span >= 3 ? 150 : span === 2 ? 110 : 78 }}>
                          {s.description}
                        </p>
                      </div>

                      <div className="px-6 pb-6">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                          {t("services.details") || "View Details"}
                          <span className="inline-block h-1 w-6 rounded-full" style={{ background: ACCENT }} />
                        </span>
                      </div>

                      {/* Numeral grande */}
                      <div className="absolute -right-2 -top-1 text-[64px] md:text-[84px] font-black leading-none text-slate-900/5 select-none pointer-events-none">
                        {(globalIndex + 1).toString().padStart(2, "0")}
                      </div>
                    </div>

                    {/* BACK con color variable + scroll por si acaso */}
                    <div className={`flip-face flip-back rounded-2xl text-white h-full ${backBg}`}>
                      <div className="flex flex-col justify-between h-full p-6">
                        <div className="flex-1 overflow-auto overscroll-contain pr-1">
                          <h4 className="text-xl font-bold mb-3 break-words">{s.title}</h4>
                          <p className="text-sm md:text-base leading-relaxed opacity-95 break-words">
                            {s.description}
                          </p>
                        </div>

                        <Link
                          href={s.href || "#"}
                          className="mt-4 inline-flex items-center justify-center rounded-md bg-white/90 text-slate-900 px-4 py-2 text-sm font-semibold hover:scale-105 transition"
                        >
                          {t("services.details") || "View Details"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Mostrar más / menos */}
        {ordered.length > initialCount && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? ("Show less") : "Show more"}
            </button>
          </div>
        )}
      </div>

      {/* CSS del flip + masonry (ajusté la altura base de fila) */}
      <style jsx>{`
        .masonry { 
          --row-h: 12rem;             /* filas un poco más altas para dar aire */
          grid-auto-rows: var(--row-h);
        }
        @media (min-width: 768px) {
          .masonry { --row-h: 13rem; }
        }
        .flip-scene { perspective: 1200px; }
        .flip-card {
          position: relative;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: block;
        }
        .flip-front { transform: rotateY(0deg); }
        .flip-back  { transform: rotateY(180deg); }
        .group:hover .flip-card,
        .group:focus-within .flip-card { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
};

export default ServicesShowcaseFlipMasonry;
