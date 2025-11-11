"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Phone,
  MapPin,
  ShieldCheck,
  Languages,
  Baby,
} from "lucide-react";
import { PALETTE, BRAND } from "@/app/ui/palette";

export type PediatricClinicPromoProps = {
  nombre?: string;
  telefono?: string;
  ctaHref?: string;
  ciudad?: string;
  direccion?: string;
  tagline?: string;
  websiteHref?: string;
};

export default function PediatricClinicPromo({
  nombre = "Clínica Pediátrica DulceCuidado",
  telefono = "(407) 554-5707",
  ctaHref = "/cita-pediatria",
  ciudad = "Área Metropolitana",
  direccion = "123 Calle Salud, Suite 4",
  tagline = "Controles de niño sano, vacunación y atención el mismo día para tus peques.",
  websiteHref = "/cita-pediatria",
}: PediatricClinicPromoProps) {
  const telHref = `tel:${telefono.replace(/[^\d+]/g, "")}`;

  const beneficios = [
    {
      icon: Baby,
      title: "Especialistas en niñez",
      desc: "Atención centrada en bebés, niños y adolescentes.",
    },
    {
      icon: Languages,
      title: "Equipo bilingüe",
      desc: "Español e inglés para que te sientas cómodo en cada visita.",
    },
    {
      icon: CalendarClock,
      title: "Citas rápidas",
      desc: "Intentamos verte el mismo día cuando tu hijo lo necesita.",
    },
    {
      icon: ShieldCheck,
      title: "Aceptamos uan gran variedad de planes",
      desc: "Llámanos para verificar tu cubierta.",
    },
    {
      icon: MapPin,
      title: "Ubicación conveniente",
      desc: `${direccion} · ${ciudad}`,
    },
  ];

  return (
    <section
      className="relative isolate mt-14 pb-20"
      aria-labelledby="peds-clinic-heading"
      style={{ backgroundColor: BRAND.bg }}
    >
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
          {/* IZQUIERDA */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-7 sm:p-9 shadow-sm"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${PALETTE[0].back}33`,
            }}
          >
            {/* pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
              style={{
                backgroundColor: `${PALETTE[0].base}55`,
                color: BRAND.text,
              }}
            >
            
              Pediatría cercana
            </div>

            <h1
              id="peds-clinic-heading"
              className="mt-4 text-4xl sm:text-5xl font-extrabold leading-[1.05]"
              style={{ color: BRAND.text }}
            >
              Your Health Pediatrics
            </h1>

            <p
              className="mt-4 text-base sm:text-lg leading-7"
              style={{ color: BRAND.subtitle }}
            >
              {tagline}
            </p>

            <div className="mt-5 space-y-2 text-sm" style={{ color: BRAND.text }}>
              <p className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" style={{ color: PALETTE[1].back }} />
                Horario extendido para familias ocupadas
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: PALETTE[1].back }} />
                Línea directa con la clínica: {telefono}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: PALETTE[1].back }} />
                {direccion} · {ciudad}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: PALETTE[0].base,
                  color: BRAND.text,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                }}
                aria-label="Agendar cita pediátrica"
              >
                <CalendarClock className="h-4 w-4" aria-hidden />
                Agendar cita pediátrica
              </a>

              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: BRAND.text,
                  border: `1px solid ${PALETTE[1].back}77`,
                }}
                aria-label={`Llamar a ${nombre} al ${telefono}`}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Llamar ahora · {telefono}
              </a>
            </div>

            <p className="mt-4 text-xs" style={{ color: "rgba(0,18,25,0.4)" }}>
              ¿Primera visita? Trae el récord de vacunas y el plan médico del menor.
            </p>
          </motion.div>

          {/* DERECHA */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex flex-col gap-5"
            aria-label="Información rápida de la clínica pediátrica"
          >
          

            {/* tarjetas pequeñas */}
            <div className="grid gap-3 sm:grid-cols-2">
              {beneficios.map(({ icon: Icon, title, desc }, idx) => {
                const col = PALETTE[idx % PALETTE.length];
                return (
                  <motion.div
                    key={title}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex h-full flex-col gap-2 rounded-2xl p-4 shadow-sm border"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: `${col.base}33`,
                    }}
                  >
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset"
                      style={{
                        backgroundColor: `${col.base}33`,
                        color: BRAND.text,
                        borderColor: `${col.base}66`,
                      }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="text-sm font-semibold" style={{ color: BRAND.text }}>
                      {title}
                    </p>
                    <p
                      className="text-[13px] leading-5"
                      style={{ color: "rgba(0,18,25,0.6)" }}
                    >
                      {desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
