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
  Users,
} from "lucide-react";
import wave from "@/../public/assets/svg/wave.svg";
import { useTranslation } from "../contexts/TranslationContext";

export type ClinicPromoDeluxeFinalProps = {
  nombre?: string;
  telefono?: string;
  ctaHref?: string;
  ciudad?: string;
  direccion?: string;
  tagline?: string;
  websiteHref?: string; // ahora lo usamos como ruta interna
  mostrar?: {
    bilingue?: boolean;
    dosCitasMismaLocalidad?: boolean;
    estacionamiento?: boolean;
    telemedicina?: boolean;
    planes?: boolean;
    citaMismoDia?: boolean;
    recordatorios?: boolean;
    accesoADA?: boolean;
  };
};

export default function ClinicPromoDeluxeFinal({
  nombre = "Your Health",
  telefono = "(407) 554-5707",
  ctaHref = "/commingsoonclinic",
  ciudad = "Oficinas independientes",
  direccion,
  tagline,

  websiteHref = "/commingsoonclinic",
  mostrar = {
    bilingue: true,
    dosCitasMismaLocalidad: true,
    estacionamiento: true,
    telemedicina: true,
    planes: true,
    citaMismoDia: true,
    recordatorios: true,
    accesoADA: true,
  },
}: ClinicPromoDeluxeFinalProps) {
  const { t } = useTranslation();

  const telHref = `tel:${telefono.replace(/[^\d+]/g, "")}`;

  const tv = (key: string) => {
    const val = t(key);
    return typeof val === "string" ? val : String(val ?? "");
  };

  const beneficios = [
    mostrar.bilingue && {
      icon: Languages,
      title: tv("adult.benefits.bilingual.title"),
      desc: tv("adult.benefits.bilingual.desc"),
    },
    mostrar.dosCitasMismaLocalidad && {
      icon: Users,
      title: tv("adult.benefits.twoInSameLocation.title"),
      desc: tv("adult.benefits.twoInSameLocation.desc"),
    },
    {
      icon: MapPin,
      title: tv("adult.benefits.oneAddress.title"),
      desc: direccion
        ? tv("adult.benefits.oneAddress.descWithAddress")
            .replace("{{address}}", direccion)
            .replace("{{city}}", ciudad)
        : tv("adult.benefits.oneAddress.descWithCity").replace("{{city}}", ciudad),
    },
    mostrar.planes && {
      icon: ShieldCheck,
      title: tv("adult.benefits.insurance.title"),
      desc: tv("adult.benefits.insurance.desc"),
    },
  ].filter(Boolean) as { icon: React.ElementType; title: string; desc: string }[];

  return (
    <section
      className="relative isolate overflow-hidden bg-white mt-14 pb-20"
      aria-labelledby="adult-clinic-heading"
    >
      {/* Fondo “ola” */}
      <img
        src={wave.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none select-none absolute inset-x-0 -bottom-1 w-full h-auto opacity-20 -z-10"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* IZQUIERDA */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-lime-900 uppercase mb-2">
              {tv("adult.kicker")}
            </p>

            <h1
              id="adult-clinic-heading"
              className="mt-2 text-4xl sm:text-5xl font-extrabold leading-[1.15] text-neutral-900"
            >
              {tv("adult.heading")}: <span className="whitespace-nowrap">{nombre}</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-neutral-700 max-w-2xl">
              {tagline || tv("adult.tagline")}
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700">
              <li aria-label={tv("adult.hours")}>{tv("adult.hours")}</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                aria-label={tv("adult.ctaAria")}
              >
                <CalendarClock className="h-4 w-4" aria-hidden />
                {tv("adult.cta")}
              </a>

              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-sky-800 ring-1 ring-inset ring-sky-700 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                aria-label={tv("adult.callAria")
                  .replace("{{name}}", nombre)
                  .replace("{{phone}}", telefono)}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {tv("adult.call")} · {telefono}
              </a>
            </div>
          </motion.div>

          {/* DERECHA */}
          <motion.aside
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm backdrop-blur"
            aria-label={tv("adult.asideTitle")}
          >
            <p className="text-sm font-semibold text-neutral-900">
              {tv("adult.asideTitle")}
            </p>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {beneficios.map(({ icon: Icon, title, desc }) => (
                <motion.li
                  key={`${title}-${desc}`}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                >
                  <span className="inline-flex shrink-0 rounded-xl bg-sky-50 p-2 text-sky-700 ring-1 ring-inset ring-sky-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{title}</p>
                    <p className="text-[13px] leading-5 text-neutral-600">{desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-5 flex justify-center">
              {/* 👇 Link interno al Coming Soon */}
              <Link
                href={websiteHref} // por defecto /coming-soon
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 w-full sm:w-auto"
                aria-label={tv("adult.websiteAria")}
              >
                {tv("adult.websiteCta")}
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* CTA de llamada sticky solo en móvil */}
      <div className="fixed inset-x-0 bottom-4 z-20 px-4 sm:hidden">
        <a
          href={telHref}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-sky-900 px-5 py-3 text-base font-semibold text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label={tv("adult.callAria")
            .replace("{{name}}", nombre)
            .replace("{{phone}}", telefono)}
        >
          <Phone className="h-5 w-5" aria-hidden />
          {tv("adult.call")} · {telefono}
        </a>
      </div>
    </section>
  );
}
