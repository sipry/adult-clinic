"use client";
import React from "react";
import { useTranslation } from "../contexts/TranslationContext";

// -------- Types --------
export type StripItem = {
  value: string;
  href?: string;
  icon?: "mail" | "phone" | "pin" | "clock" | "globe" | "custom";
  customIcon?: React.ReactNode;
};

export type ClinicInfoStripProps = {
  bgClassName?: string;
  textClassName?: string;
  dotClassName?: string;
  speedSec?: number;
  pauseOnHover?: boolean;
  className?: string;
};

// -------- Helpers --------
const toArray = (v?: string | string[]) => (v ? (Array.isArray(v) ? v : [v]) : []);
const digits = (v: string) => v.replace(/[^\d+]/g, "");
const mapsLink = (addr: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

const Icon: React.FC<{ name?: StripItem["icon"]; className?: string }> = ({ name, className }) => {
  if (!name || name === "custom") return null;
  switch (name) {
    case "mail":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 
               2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
               2v.01L12 13 4 6.01V6h16zM4 18V8.25l7.4 
               5.7c.35.27.85.27 1.2 0L20 8.25V18H4z" />
        </svg>
      );
    case "phone":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path
            fill="currentColor"
            d="M6.6 10.8a15.6 15.6 0 006.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3.1.5.7 0 1.3.6 1.3 1.3v3.4c0 .7-.6 1.3-1.3 1.3C10.5 21.4 2.6 13.5 2.6 3.3 2.6 2.6 3.2 2 3.9 2h3.4c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.1.5 3.1.1.4 0 .9-.3 1.2L6.6 10.8z"
          />
        </svg>
      );
    case "pin":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path fill="currentColor" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </svg>
      );
    case "clock":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 10.25V6h-1.5v7h5v-1.5h-3.5z" />
        </svg>
      );
    case "globe":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 9h-3.2a14 14 0 00-1.26-4.69A8.52 8.52 0 0118.9 11zm-5.4 0H10.5c.22-1.91.86-3.72 1.73-5.11.86 1.39 1.5 3.2 1.72 5.11zM8.3 11H5.1a8.52 8.52 0 014.46-4.69A14 14 0 008.3 11zM5.1 13h3.2c.22 1.91.86 3.72 1.73 5.11A8.52 8.52 0 015.1 13zm5.4 0h3a12.9 12.9 0 01-1.72 5.11A12.9 12.9 0 0110.5 13zm4.1 0h3.2a8.52 8.52 0 01-4.46 4.69c.54-1.07.97-2.33 1.26-4.69z"
          />
        </svg>
      );
  }
};

// -------- Component --------
const ClinicInfoStrip: React.FC<ClinicInfoStripProps> = ({
  bgClassName = "bg-sky-900",
  textClassName = "text-white",
  dotClassName = "text-gray-800/70",
  speedSec = 50,
  pauseOnHover = false,
  className = "",
}) => {
  const { t } = useTranslation();

  // Datos internos hardcodeados
  const email = "info@yourhealthadults.com";
  const phone = "+(407) 574 4848";
  const location = "201 Hilda St Suite # 10, Kissimmee, FL 34741";

  const built: StripItem[] = [
    {
      icon: "mail",
      value: `${t("strip.email")} ${email}`,
      href: `mailto:${email}`,
    },
    {
      icon: "phone",
      value: `${t("strip.number")} ${phone}`,
      href: `tel:${digits(phone)}`,
    },
    {
      icon: "pin",
      value: `${t("strip.location")} ${location}`,
      href: mapsLink(location),
    },
  ];

  if (!built.length) return null;

  const pauseCls = pauseOnHover ? "group-hover:[animation-play-state:paused]" : "";

  return (
    <div
      className={`group relative ${bgClassName} ${textClassName} ${className} py-4`}
      aria-label="Información de la clínica, desplazándose"
      role="region"
    >
      <div
        className="overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          className={`clinic-track flex flex-none shrink-0 items-center gap-10 whitespace-nowrap will-change-transform ${pauseCls}`}
          style={
            {
              "--marquee-duration": `${Math.max(1, speedSec)}s`,
            } as React.CSSProperties
          }
        >
          <StripCopy built={built} dotClassName={dotClassName} ariaHidden />
          <StripCopy built={built} dotClassName={dotClassName} ariaHidden />
          <StripCopy built={built} dotClassName={dotClassName} ariaHidden />
          <StripCopy built={built} dotClassName={dotClassName} ariaHidden />
        </div>
      </div>

      <style>{`
        @keyframes clinic-marquee {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-50%,0,0); }
        }
        .clinic-track {
          animation: clinic-marquee var(--marquee-duration) linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .clinic-track { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
};

const StripCopy: React.FC<{
  built: StripItem[];
  dotClassName: string;
  ariaHidden?: boolean;
}> = ({ built, dotClassName, ariaHidden }) => {
  return (
    <div
      className="flex flex-none shrink-0 items-center gap-10"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {built.map((it, i) => (
        <React.Fragment key={`${ariaHidden ? "b" : "a"}-${i}`}>
          <a
            href={it.href}
            className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold/none hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm px-1"
          >
            {it.customIcon ?? <Icon name={it.icon} className="h-5 w-5" />}
            <span>{it.value}</span>
          </a>
          <span className={`mx-6 ${dotClassName}`} aria-hidden="true">•</span>
        </React.Fragment>
      ))}
    </div>
  );
};                   

export default ClinicInfoStrip;
