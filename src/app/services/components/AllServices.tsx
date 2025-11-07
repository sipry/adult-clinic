"use client";

import React, { useState, useMemo } from "react";
import {
  Stethoscope,
  Syringe,
  Shield,
  Activity,
  HeartPulse,
  Eye,
  Brain,
  Search,
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ServiceDetailsPanel from "../components/ServiceSidePanel";
import { BRAND } from "@/app/ui/palette";

/* 🎨 Paleta pastel unificada */
const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" }, // 0 teal pastel
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" }, // 1 mint
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" }, // 2 butter
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" }, // 3 soft yellow
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" }, // 4 peach
  { base: "#E48C7A", back: "#D67463", text: "#001219" }, // 5 coral
  { base: "#E57B76", back: "#D66A65", text: "#001219" }, // 6 warm rose
  { base: "#DC767B", back: "#C85D61", text: "#001219" }, // 7 deep rose
];

/* 🩺 Íconos */
const ICONS = {
  "preventive-medicine": Stethoscope,
  "adult-immunizations": Syringe,
  "minor-illness": Shield,
  "minor-injury": Activity,
  "chronic-disease": HeartPulse,
  "asthma-care": Brain,
  "vision-screening": Eye,
};

/* 🧾 Servicios */
const SERVICES = [
  {
    id: "preventive-medicine",
    title: "Preventive Medicine",
    description:
      "Medical screenings and treatments that can help you avoid unnecessary illness and detect a potentially dangerous health condition early on.",
  },
  {
    id: "adult-immunizations",
    title: "Adult Immunizations",
    description:
      "Our doctors provide all CDC-recommended immunizations including those that protect you against Influenza, Pneumococcal Infections, HPV, and Hepatitis.",
  },
  {
    id: "minor-illness",
    title: "Minor Illness Diagnosis and Treatment",
    description:
      "Evaluation and treatment for acute illnesses such as colds, flu, sinus infections, and other minor health concerns that do not require hospitalization.",
  },
  {
    id: "minor-injury",
    title: "Minor Injury Diagnosis and Treatment",
    description:
      "Care and management for injuries that are not life-threatening, including sprains, cuts, burns, and other common minor physical injuries.",
  },
  {
    id: "chronic-disease",
    title: "Chronic Disease Management",
    description:
      "Monitoring and treatment of chronic conditions such as diabetes, hypertension, asthma, and heart disease to help you maintain optimal health.",
  },
  {
    id: "vision-screening",
    title: "Vision Screening and Eye Health",
    description:
      "Comprehensive eye exams and screenings to help detect vision problems, manage eye health, and provide timely referrals to specialists if needed.",
  },
];

const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const selected = SERVICES.find((s) => s.id === detailId) || null;

  const filtered = useMemo(() => {
    if (!query.trim()) return SERVICES;
    const q = query.toLowerCase();
    return SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section
      className="relative py-20"
      style={{ backgroundColor: "#FFFFFF" }} // 👈 fondo limpio
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-10 space-y-3 md:space-y-4 text-left max-w-3xl">
          <p
            className="text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: BRAND.accent }}
          >
            Our Services
          </p>
          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: PALETTE[0].text }}
          >
            Comprehensive Primary Care
          </h2>
          <p
            className="text-base md:text-lg"
            style={{ color: "rgba(0,18,25,0.55)" }}
          >
            Personalized care for every stage of life, designed to keep you and
            your family healthy, informed, and supported.
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
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md py-2 pl-10 pr-3 text-sm shadow-sm outline-none transition"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${PALETTE[1].back}55`,
              color: PALETTE[0].text,
            }}
          />
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, idx) => {
            const Icon = ICONS[s.id as keyof typeof ICONS];
            const shortDesc =
              s.description.split(" ").length > 20
                ? s.description.split(" ").slice(0, 20).join(" ") + "…"
                : s.description;

            // vamos a rotar colores pastel en los iconos
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
                    <Icon className="h-6 w-6" style={{ color: color.text }} />
                  </div>

                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: PALETTE[0].text }}
                  >
                    {s.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(0,18,25,0.7)" }}
                  >
                    {shortDesc}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setDetail(s.id)}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition hover:scale-[1.01]"
                    style={{
                      backgroundColor: PALETTE[0].back, // pastel teal
                      color: PALETTE[0].text,
                    }}
                  >
                    View Details
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
              No services found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* PANEL DE DETALLES */}
      <ServiceDetailsPanel
        open={!!selected}
        onClose={() => setDetail(undefined)}
        service={selected}
        locale="en"
      />
    </section>
  );
};

export default ServicesGrid;
