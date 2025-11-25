"use client";

import React, { useState, useMemo, type SVGProps, type ComponentType } from "react";
import {
  Stethoscope,
  Syringe,
  Shield,
  Activity,
  HeartPulse,
  Search,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ServiceDetailsPanel from "../components/ServiceSidePanel";
import { BRAND, PALETTE } from "@/app/ui/palette";
import { useTranslation } from "@/app/contexts/TranslationContext";

// i18n de servicios
import {
  svcStr,
  detectLocaleFromPath,
  type ServiceId,
} from "../i18n/serviceDetails.i18n"; 

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const SERVICE_IDS: ServiceId[] = [
  "preventive-medicine",
  "adult-immunizations",
  "minor-illness",
  "minor-injury",
  "chronic-disease",
];

// íconos por id, sin any
const ICONS: Record<ServiceId, IconComponent> = {
  "preventive-medicine": Stethoscope,
  "adult-immunizations": Syringe,
  "minor-illness": Shield,
  "minor-injury": Activity,
  "chronic-disease": HeartPulse,
};

const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // idioma desde el context, si existe
  const { language } = useTranslation();
  const locale =
    (language as "en" | "es") || detectLocaleFromPath(pathname) || "es";

  const detailId = searchParams.get("detail") || "";

  // construimos lista con i18n
  const SERVICES = useMemo(
    () =>
      SERVICE_IDS.map((id) => ({
        id,
        title: svcStr(locale, id, "title") ?? id,
        description: svcStr(locale, id, "summary") ?? "",
      })),
    [locale]
  );

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

  const selected =
    SERVICES.find((s) => s.id === (detailId as ServiceId)) ?? null;

  // filtro por buscador
  const filtered = useMemo(() => {
    if (!query.trim()) return SERVICES;
    const q = query.toLowerCase();
    return SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query, SERVICES]);

  return (
    <section className="relative py-20" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-10 space-y-3 md:space-y-4 text-left max-w-3xl">
          <p
            className="text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: BRAND.accent }}
          >
            {locale === "es" ? "Servicios que ofrecemos" : "Services We Offer"}
          </p>
          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: BRAND.text }}
          >
            {locale === "es"
              ? "Atención primaria integral Kissimmee, FL"
              : "Comprehensive Primary Care Kissimmee, FL"}
          </h2>
          <p
            className="text-base md:text-lg"
            style={{ color: "rgba(0,18,25,0.55)" }}
          >
            {locale === "es"
              ? "Cuidado personalizado para mantenerte sano, informado y acompañado."
              : "Personalized care for every stage of life, designed to keep you healthy, informed, and supported."}
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-12 max-w-md">
          <Search
            className="absolute left-3 top-2.5 h-5 w-5"
            style={{ color: "rgba(0,18,25,0.35)" }}
            strokeWidth={1.6}
          />
          <input
            type="text"
            placeholder={
              locale === "es" ? "Buscar servicios..." : "Search services..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md py-2 pl-10 pr-3 text-sm shadow-sm outline-none transition"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${PALETTE[1].back}55`,
              color: BRAND.text,
            }}
          />
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, idx) => {
            const Icon = ICONS[s.id as ServiceId] ?? Stethoscope;
            const words = s.description ? s.description.split(" ") : [];
            const shortDesc =
              words.length > 20
                ? `${words.slice(0, 20).join(" ")}…`
                : s.description;

            const color = PALETTE[idx % PALETTE.length];

            return (
              <article
                key={s.id}
                className="group relative rounded-2xl p-6 flex flex-col justify-between"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${color.base}30`,
                  boxShadow: "0 3px 12px rgba(0,0,0,0.03)",
                  minHeight: "320px",
                }}
              >
                <div>
                  <div
                    className="mb-4 grid h-14 w-14 place-items-center rounded-full"
                    style={{
                      backgroundColor: `${color.base}33`,
                      border: `1px solid ${color.base}66`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: BRAND.text }} />
                  </div>

                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: BRAND.text }}
                  >
                    {s.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(0,18,25,0.7)" }}
                  >
                    {shortDesc ||
                      (locale === "es"
                        ? "Sin descripción."
                        : "No description.")}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setDetail(s.id)}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition hover:scale-[1.01]"
                    style={{
                      backgroundColor: PALETTE[0].base,
                      color: BRAND.text,
                    }}
                  >
                    {locale === "es" ? "Ver detalles" : "View Details"}
                  </button>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <p
              className="text-sm italic col-span-full text-center mt-6"
              style={{ color: "rgba(0,18,25,0.5)" }}
            >
              {locale === "es"
                ? "No se encontraron servicios que coincidan con tu búsqueda."
                : "No services found matching your search."}
            </p>
          )}
        </div>
      </div>

      {/* PANEL DE DETALLES */}
      <ServiceDetailsPanel
        open={!!selected}
        onClose={() => setDetail(undefined)}
        service={selected}
        locale={locale}
      />
    </section>
  );
};

export default ServicesGrid;
