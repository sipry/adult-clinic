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
  ArrowRight,
  Users
} from "lucide-react";
import Reveal from "../ui/reveal";
import { useTranslation } from "../contexts/TranslationContext";
import { BRAND, PALETTE } from "../ui/palette";

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
  nombre,
  telefono,
  ctaHref = "https://www.yourhealthpediatrics.com/#contact",
  ciudad,
  direccion,
  tagline,
  websiteHref = "https://www.yourhealthpediatrics.com/services",
}: PediatricClinicPromoProps) {
  const { t } = useTranslation();

  // valores con fallback al contexto
  const clinicName = nombre || t("peds.clinicName");
  const phone = telefono || t("peds.phone");
  const city = ciudad || t("peds.city");
  const address = direccion || t("peds.address");
  const finalTagline = tagline || t("peds.tagline");
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const beneficios = [
    {
      icon: Baby,
      title: t("peds.benefits.specialists.title"),
      desc: t("peds.benefits.specialists.desc"),
    },
    {
      icon: Languages,
      title: t("peds.benefits.bilingual.title"),
      desc: t("peds.benefits.bilingual.desc"),
    },
    {
      icon: Users,
      title: t("peds.benefits.fastAppointments.title"),
      desc: t("peds.benefits.fastAppointments.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("peds.benefits.insurance.title"),
      desc: t("peds.benefits.insurance.desc"),
    },
  ];

  return (
    <section
      className="relative isolate mt-14 pb-20"
      aria-labelledby="peds-section-title"
      style={{ backgroundColor: BRAND.bg }}
    >
     

      {/* Contenido */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
          {/* IZQUIERDA */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-6 sm:p-8 h-full"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] mb-4"
              style={{
                color: BRAND.text,
              }}
            >
              {t("peds.badge")}
            </div>

            <h2
              className="text-3xl sm:text-4xl font-extrabold leading-tight"
              style={{ color: BRAND.text }}
            >
              {t("peds.heroTitle")}
            </h2>

            <p
              className="mt-4 text-base sm:text-lg leading-7"
              style={{ color: BRAND.subtitle }}
            >
              {finalTagline}
            </p>

            {/* Info rápida */}
            <div
              className="mt-5 space-y-2 text-sm rounded-2xl p-3"
              style={{
                color: BRAND.text,
              }}
            >
              <p className="flex items-center gap-2">
                <CalendarClock
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                {t("peds.info.schedule")}
              </p>
              <p className="flex items-center gap-2">
                <Phone
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                {t("peds.info.phoneLabel")}
              </p>
              <p className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4"
                  style={{ color: BRAND.accent }}
                  aria-hidden
                />
                {address} · {city}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full sm:w-auto"
                style={{
                  backgroundColor: BRAND.text,
                  color: BRAND.bg,
                }}
                aria-label={t("peds.ctaPrimaryAria")}
              >
                <CalendarClock className="h-4 w-4" aria-hidden />
                {t("peds.ctaPrimary")}
              </a>

              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full sm:w-auto"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${BRAND.accent}`,
                  color: BRAND.accent,
                }}
                aria-label={`${t("peds.ctaSecondaryAria")} ${clinicName} ${phone}`}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {t("peds.ctaSecondary")} · {phone}
              </a>
            </div>

       
          </motion.div>

          {/* DERECHA */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex flex-col gap-5 h-full justify-center"
            aria-label={t("peds.benefits.ariaLabel")}
          >
            <div className="grid gap-4 sm:grid-cols-2 mt-4 sm:mt-0">
              {beneficios.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex h-full flex-col gap-1 mt-1 rounded-2xl p-2"
                >
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl mb-2"
                    style={{
                      backgroundColor: PALETTE[0].base + "80",
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
                    style={{ color: BRAND.text }}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA informativo */}
            <Link
              href={websiteHref}
              className="inline-flex items-center justify-between rounded-2xl px-5 py-4 mt-5text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md w-full"
              style={{
                backgroundColor: PALETTE[0].base + "80",
                color: BRAND.text,
              }}
            >
              <span>{t("peds.viewServices")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
