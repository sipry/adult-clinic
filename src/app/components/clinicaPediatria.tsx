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
import Reveal from "../ui/reveal";
import { BRAND, PALETTE } from "../ui/palette";
import { b } from "framer-motion/client";

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
      title: "Aceptamos la mayoría de planes",
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
      aria-labelledby="peds-section-title"
      style={{ backgroundColor: BRAND.bg }}
    >
      {/* Header consistente */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center mb-10">
        <Reveal y={8} delay={0}>
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: BRAND.accent }}
          >
            Vea también nuestra clínica de pediatría
          </p>
        </Reveal>
        <Reveal y={8}>
          <h2
            id="peds-section-title"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: BRAND.text }}
          >
            Your Health Clínica Pediátrica
          </h2>
        </Reveal>
        <Reveal y={10} delay={80}>
          <p
            className="mt-2 text-sm max-w-2xl mx-auto"
            style={{ color: BRAND.subtitle }}
          >
            Todo en un solo lugar: consultas, vacunas, seguimiento y orientación
            para padres y madres.
          </p>
        </Reveal>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
          {/* IZQUIERDA */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-7 sm:p-9 shadow-sm"
            style={{
              backgroundColor: BRAND.bg,
              border: `1px solid ${BRAND.border}`,
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] mb-3"
              style={{
                backgroundColor: PALETTE[3].base,
                color: BRAND.text,
              }}
            >

              Atención pediátrica
            </div>

            <h3
              className="text-3xl sm:text-4xl font-extrabold leading-tight"
              style={{ color: BRAND.text }}
            >
              Atención cariñosa para tus hijos
            </h3>

            <p
              className="mt-4 text-base sm:text-lg leading-7"
              style={{ color: BRAND.subtitle }}
            >
              {tagline}
            </p>

            <div className="mt-5 space-y-2 text-sm" style={{ color: BRAND.text }}>
              <p className="flex items-center gap-2">
                <CalendarClock
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                Horario extendido para familias ocupadas
              </p>
              <p className="flex items-center gap-2">
                <Phone
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                Línea directa con la clínica: {telefono}
              </p>
              <p className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                {direccion} · {ciudad}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: BRAND.text,
                  color: BRAND.bg,
                }}
                aria-label="Agendar cita pediátrica"
              >
                <CalendarClock className="h-4 w-4" aria-hidden />
                Agendar cita pediátrica
              </a>

              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: BRAND.bg,
                  border: `1px solid ${BRAND.accent}`,
                  color: BRAND.accent,
                }}
                aria-label={`Llamar a ${nombre} al ${telefono}`}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Llamar ahora · {telefono}
              </a>
            </div>

            <p className="mt-4 text-xs" style={{ color: BRAND.subtitle }}>
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


            <div className="grid gap-3 sm:grid-cols-2">
              {beneficios.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex h-full flex-col gap-2 rounded-2xl p-4 shadow-sm border"
                  style={{
                    backgroundColor: BRAND.bg,
                    border: `1px solid ${BRAND.border}`,
                  }}
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: PALETTE[2].base,
                      color: BRAND.text,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: BRAND.text }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-[13px] leading-5"
                    style={{ color: BRAND.subtitle }}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
