"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
import ServiceDetailsPanel from "../components/ServiceSidePanel"; // 🔹 asegúrate de tener este componente

/* 🎨 Paleta */
const PALETTE = {
  base: "#B67B39", // ámbar cálido
  background: "#FAF4E6", // crema
  dark: "#2B2725", // marrón oscuro
};

/* 🩺 Íconos coherentes */
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

/* 🧱 Componente */
const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState("");

  /* ---------- 🔹 Lógica del panel ---------- */
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

  /* ----------------------------------------- */

  const filtered = useMemo(() => {
    if (!query.trim()) return SERVICES;
    return SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <section
      className="relative py-20"
      style={{ backgroundColor: PALETTE.background }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* ---------- HEADER IZQUIERDA ---------- */}
        <div className="mb-10 space-y-3 md:space-y-4 text-left max-w-3xl">
          <p
            className="text-[11px] font-semibold tracking-[0.28em] uppercase"
            style={{ color: "#7C8C4D" }}
          >
            Our Services
          </p>
          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: PALETTE.dark }}
          >
            Comprehensive Primary Care
          </h2>
          <p className="text-base md:text-lg" style={{ color: "#4F5635" }}>
            Personalized care for every stage of life, designed to keep you and
            your family healthy, informed, and supported.
          </p>
        </div>

        {/* ---------- SEARCH ---------- */}
        <div className="relative mb-12 max-w-md">
          <Search
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            strokeWidth={1.6}
          />
          <input
            type="text"
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-[#D8C27A] bg-[#FFFDF8] py-2 pl-10 pr-3 text-sm text-[#2B2725] placeholder-gray-500 shadow-sm focus:border-[#B67B39] focus:ring-1 focus:ring-[#B67B39] outline-none transition"
          />
        </div>

        {/* ---------- GRID ---------- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const Icon = ICONS[s.id as keyof typeof ICONS];
            const words = s.description.split(" ");
            const shortDesc =
              words.length > 20
                ? words.slice(0, 20).join(" ") + "…"
                : s.description;

            return (
              <article
                key={s.id}
                className="group relative rounded-2xl p-6 flex flex-col justify-between"
                style={{
                  backgroundColor: PALETTE.background,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                  color: PALETTE.dark,
                  minHeight: "380px", // 🔹 altura total consistente
                }}
              >
                <div className="flex flex-col">
                  {/* 🔹 Icono */}
                  <div
                    className="mb-4 grid h-14 w-14 place-items-center rounded-full"
                    style={{
                      backgroundColor: "#FFFDF8",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: PALETTE.base }} />
                  </div>

                  {/* 🔹 Contenedor fijo para título */}
                  <div style={{ minHeight: "56px" }}> {/* ≈ dos líneas */}
                    <h3
                      className="text-lg font-bold leading-snug"
                      style={{ color: PALETTE.dark }}
                    >
                      {s.title}
                    </h3>
                  </div>

                  {/* 🔹 Contenedor fijo para descripción */}
                  <div style={{ minHeight: "66px", marginTop: "0.5rem" }}> {/* ≈ tres líneas */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(43,39,37,0.8)",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                      }}
                    >
                      {shortDesc}
                    </p>
                  </div>
                </div>

                {/* 🔹 Botón alineado al fondo */}
                <div className="mt-6">
                  <button
                    onClick={() => setDetail(s.id)}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm"
                    style={{
                      backgroundColor: PALETTE.base,
                      color: PALETTE.background,
                    }}
                  >
                    View Details
                  </button>
                </div>
              </article>
            );
          })}

          {/* Mensaje si no hay resultados */}
          {filtered.length === 0 && (
            <p
              className="text-sm italic col-span-full text-center mt-6"
              style={{ color: "#4F5635" }}
            >
              No services found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* ---------- PANEL DETALLES ---------- */}
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
