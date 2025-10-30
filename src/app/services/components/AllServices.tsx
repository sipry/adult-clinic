"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Baby,
  Brain,
  Activity,
  Heart,
  Clock,
  Shield,
  Syringe,
  Eye,
} from "lucide-react";
import { useTranslation, ServiceTranslation } from "@/app/contexts/TranslationContext";
import ServiceDetailsPanel, { ServiceDetailsBasic } from "../components/ServiceSidePanel";
import InsuranceModal from "@/app/components/InsuranceModal";


/* =========================================================
   1) Envoltorio con Suspense (arregla el error de build)
   ========================================================= */
function AllServicesFallback() {

  // Skeleton simple mientras el cliente resuelve useSearchParams()
  return (
    <main className="relative overflow-hidden bg-white mt-8">
      <section className="relative z-10 pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-3 w-40 bg-slate-200 rounded mb-3" />
          <div className="h-10 w-72 bg-slate-200 rounded mb-4" />
          <div className="h-5 w-[36rem] max-w-full bg-slate-200 rounded mb-8" />
          <div className="h-10 w-full max-w-xl bg-slate-200 rounded" />
        </div>
      </section>
      <section className="relative z-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white/70 p-6">
                <div className="h-14 w-14 bg-slate-200 rounded-full mb-4" />
                <div className="h-4 w-40 bg-slate-200 rounded mb-3" />
                <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                <div className="h-3 w-5/6 bg-slate-200 rounded mb-5" />
                <div className="h-8 w-28 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AllServices() {

  return (
    <Suspense fallback={<AllServicesFallback />}>
      <AllServicesInner />
    </Suspense>
  );
}

/* =========================================================
   2) Tu componente original (sin cambios funcionales)
   ========================================================= */

/* -------------------- Tipos -------------------- */
type IconKey =
  | "baby"
  | "brain"
  | "activity"
  | "heart"
  | "clock"
  | "shield"
  | "syringe"
  | "eye";

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Service = {
  id: string;
  icon: IconKey;
  title: string;
  description: string;
  href?: string;
  tags?: string[];
  longDescription?: string;
};

/* -------------------- Icon mapping -------------------- */
const ICONS: Record<IconKey, IconCmp> = {
  baby: Baby,
  brain: Brain,
  activity: Activity,
  heart: Heart,
  clock: Clock,
  shield: Shield,
  syringe: Syringe,
  eye: Eye,
};

/* -------------------- Paleta y helpers -------------------- */
const ICON_COLORS = ["#ed624f", "#faea9b", "#cbe3c7", "#9cd3f6", "#f5c284"] as const;

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
};

const withAlpha = (hex: string, alpha = 0.85) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const readableOn = (hex: string, alpha = 0.85) => {
  const { r, g, b } = hexToRgb(hex);
  const R = Math.round(r * alpha + 255 * (1 - alpha));
  const G = Math.round(g * alpha + 255 * (1 - alpha));
  const B = Math.round(b * alpha + 255 * (1 - alpha));
  const L = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
  return L > 0.6 ? "#1f2937" : "#ffffff";
};

const iconTextColor = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return L > 0.6 ? "#1f2937" : "#ffffff";
};

const allInsuranceProviders = [
  "Aetna",
  "BlueCross",
  "Humana",
  "TripleS",
  "Mapfre",
  "UnitedHealthcare",
  "Anthem",
  "Kaiser Permanente",
  "Molina Healthcare",
  "Community Health Choice",
  "Superior HealthPlan",
  "Amerigroup",
  "WellCare",
  "Scott & White Health Plan",
  "Medicaid/CHIP",
  "Tricare",
  "Medicare",
  "Ambetter",
  "Centene",
  "Health Net",
  "Magellan Health",
  "BCBS Federal Employee Program",
  "Caresource",
  "Fidelis Care",
  "Healthfirst",
  "Independence Blue Cross",
  "Medical Mutual",
  "Priority Health",
  "Tufts Health Plan",
  "UPMC Health Plan",
  "Wellmark Blue Cross Blue Shield",
];

const getIconColor = (index: number) => ICON_COLORS[index % ICON_COLORS.length];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* -------------------- Mapa de claves → icono -------------------- */
const ICON_BY_KEY: Partial<Record<string, IconKey>> = {
  well: "baby",
  "well-visit": "baby",

  sick: "clock",
  "sick-visit": "clock",
  followup: "clock",
  "follow-up": "clock",
  urgent: "clock",

  immunizations: "syringe",
  covid: "syringe",

  "food-allergy": "activity",
  "food-allergy-test": "activity",
  "environmental-allergy": "activity",
  "environmental-allergy-test": "activity",
  asthma: "activity",
  "asthma-care-plan": "activity",
  audiology: "activity",
  "audiology-screening": "activity",

  vision: "eye",
  "vision-screening": "eye",

  physical: "shield",

  adhd: "brain",
  "adhd-care-plan": "brain",

  obesity: "heart",
  "obesity-care-plan": "heart",

  adolescent: "heart",
};

function AllServicesInner() {
  const { t, tArray, language } = useTranslation();
  const [q, setQ] = useState("");
  const [insuranceOpen, setInsuranceOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* -------------------- URL state (?detail=) -------------------- */
  const detailId = searchParams.get("detail") || "";
  const setDetail = (id?: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (id) {
      sp.set("detail", id);
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    } else {
      sp.delete("detail");
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  };

  /* -------------------- Servicios desde i18n -------------------- */
  const i18nServices = tArray<ServiceTranslation>("services.list");

  const services: Service[] = useMemo(() => {
    return i18nServices.map((s, idx) => {
      const key = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
      const icon = ICON_BY_KEY[key] ?? ("heart" as const);
      return {
        id: key,
        icon,
        title: s.title || `Service ${idx + 1}`,
        description: s.description || "",
        longDescription: s.longDescription,
        tags: s.tags || undefined,
      };
    });
  }, [i18nServices]);

  /* -------------------- Búsqueda -------------------- */
  const filtered = useMemo(() => {
    if (!q.trim()) return services;
    const needle = q.toLowerCase();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        s.description.toLowerCase().includes(needle) ||
        s.id.toLowerCase().includes(needle) ||
        (s.tags || []).some((tag) => tag.toLowerCase().includes(needle))
    );
  }, [q, services]);

  /* -------------------- Selección para panel -------------------- */
  const selected = services.find((s) => s.id === detailId) || null;
  const selectedForPanel: ServiceDetailsBasic | null = useMemo(() => {
    if (!selected) return null;
    const IconCmp = ICONS[selected.icon];
    return {
      id: selected.id,
      title: selected.title,
      description: selected.description,
      longDescription: selected.longDescription,
      tags: selected.tags,
      icon: IconCmp,
    };
  }, [selected]);

  return (
    <main className="relative overflow-hidden bg-white mt-8">


      {/* Hero */}
      <section className="relative z-10 pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-sky-900 uppercase">
            {t("services.pretitle") || "Nuestros servicios"}
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-[-0.02em] text-slate-900">
            {t("services.title") || "Todos los servicios"}
          </h1>
          <p className="mt-4 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
            {t("services.subtitle") ||
              "Atención pediátrica integral con un enfoque preventivo, educación a familias y coordinación continua del cuidado."}
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <label htmlFor="svc-search" className="sr-only">
              {t("services.search.label") || "Buscar servicios"}
            </label>
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="svc-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("services.search.placeholder") || "Buscar por nombre, síntoma, plan…"}
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  {t("common.clear") || "Limpiar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          {filtered.length === 0 ? (
            <div className="rounded-md border border-slate-200 bg-white/70 p-8 text-center text-slate-600">
              {t("services.search.empty") || "No encontramos servicios con ese criterio."}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s, idx) => {
                const Icon = ICONS[s.icon];
                const baseHex = getIconColor(idx);
                const iconBg = withAlpha(baseHex, 0.9);
                const iconFg = readableOn(baseHex, 0.9);
                const chipFg = iconTextColor(baseHex);
                const cardId = s.id || slugify(s.title);

                const detailsHref = `/services?detail=${encodeURIComponent(cardId)}`;

                return (
                  <article
                    key={cardId}
                    id={cardId}
                    className="group relative rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  >
                    {/* Icono */}
                    <div
                      className="mb-4 grid h-14 w-14 place-items-center rounded-full shadow-lg"
                      style={{
                        backgroundColor: iconBg,
                        color: iconFg,
                        boxShadow: `0 12px 24px -8px ${withAlpha(baseHex, 0.35)}`,
                        border: `1px solid ${withAlpha(baseHex, 0.35)}`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Título (abre panel) */}
                    <button
                      onClick={() => setDetail(cardId)}
                      className="text-left text-lg font-bold text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
                      aria-label={`Ver detalles de ${s.title}`}
                    >
                      {s.title}
                    </button>

                    {/* Descripción */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {s.description}
                    </p>

                    {/* Tags (si existen) */}
                    {!!s.tags?.length && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm px-2 py-1 text-[11px] font-medium"
                            style={{
                              backgroundColor: withAlpha(baseHex, 0.15),
                              color: chipFg,
                              border: `1px solid ${withAlpha(baseHex, 0.25)}`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA único: Ver detalles (abre panel) */}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={detailsHref}
                        onClick={(e) => {
                          e.preventDefault();
                          setDetail(cardId);
                        }}
                        className="inline-flex items-center justify-center rounded-sm bg-lime-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] hover:bg-lime-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
                      >
                        {t("services.details") || "Ver detalles"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* CTA de aseguradoras */}
          <section aria-labelledby="insurance-cta" className="mt-12">
            <h2 id="insurance-cta" className="sr-only">Aseguradoras</h2>
            <p className="text-slate-700">
              {t("insurance.inline") || "¿Quieres saber si tu plan está cubierto?"}{" "}
              <button
                type="button"
                onClick={() => setInsuranceOpen(true)}
                className="font-semibold text-lime-900 underline underline-offset-4 hover:text-lime-800"
              >
                {t("insurance.search") || "Ver aseguradoras"}
              </button>
            </p>
          </section>
        </div>
      </section>

      {/* Panel de detalles */}
      <ServiceDetailsPanel
        open={!!selectedForPanel}
        onClose={() => setDetail(undefined)}
        service={selectedForPanel}
        locale={language as 'es' | 'en'}
      />

      {/* Modal de aseguradoras */}
      <InsuranceModal
        open={insuranceOpen}
        onClose={() => setInsuranceOpen(false)}
      />
    </main>
  );
}
