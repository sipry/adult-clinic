"use client";
import React from "react";
import { useTranslation } from "../contexts/TranslationContext";
import { BRAND } from "../ui/palette";

/* --------- misma paleta que usas en services --------- */
const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" }, // 0
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" }, // 1
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" }, // 2
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" }, // 3
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" }, // 4
  { base: "#E48C7A", back: "#D67463", text: "#001219" }, // 5
  { base: "#E57B76", back: "#D66A65", text: "#001219" }, // 6
  { base: "#DC767B", back: "#C85D61", text: "#001219" }, // 7
];

/* elegimos colores para el strip */
const STRIP_BG = PALETTE[0].back; // fondo
const STRIP_TEXT = PALETTE[0].text; // texto normal
const STRIP_HOVER = BRAND.cta; // hover texto -> #C85D61
const STRIP_DOT = PALETTE[7].back; // puntos -> #C85D61

/* --------- tipos --------- */
type StripItem = {
  value: string;
  href?: string;
  icon?: "mail" | "phone" | "pin";
  customIcon?: React.ReactNode;
};

type ClinicInfoStripProps = {
  speedSec?: number;
  /** si no lo pasas, por defecto pausa al hacer hover */
  pauseOnHover?: boolean;
  className?: string;
};

/* --------- helpers --------- */
const digits = (v: string) => v.replace(/[^\d+]/g, "");
const mapsLink = (addr: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

/* iconos simples inline */
const Icon: React.FC<{ name?: StripItem["icon"]; className?: string }> = ({
  name,
  className,
}) => {
  if (!name) return null;

  if (name === "mail") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v.01L12 13l8-6.99V6H4zm0 12h16V9l-8 7-8-7v9z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l1.98-1.98a1 1 0 01.94-.26c1.03.26 2.13.4 3.25.4a1 1 0 011 1V20a1 1 0 01-1 1C11.61 21 3 12.39 3 2a1 1 0 011-1h2.46a1 1 0 011 1c0 1.12.14 2.22.4 3.25a1 1 0 01-.26.94l-1.98 1.98z" />
      </svg>
    );
  }

  if (name === "pin") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a7 7 0 00-7 7c0 4.97 7 13 7 13s7-8.03 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
    );
  }

  return null;
};

/* --------- componente principal --------- */
const ClinicInfoStrip: React.FC<ClinicInfoStripProps> = ({
  speedSec = 50,
  pauseOnHover = true, // ← ahora por defecto sí se detiene
  className = "",
}) => {
  const { t } = useTranslation();

  const email = "info@yourhealthadults.com";
  const phone = "+(407) 574 4848";
  const location = "201 Hilda St Suite #10, Kissimmee, FL 34741";

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

  const pauseCls = pauseOnHover ? "group-hover:[animation-play-state:paused]" : "";

  return (
    <div
      className={`group relative ${className} py-4`}
      aria-label="Información de la clínica, desplazándose"
      role="region"
      style={{
        backgroundColor: STRIP_BG,
        color: STRIP_TEXT,
      }}
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
          className={`clinic-track flex flex-none items-center gap-10 whitespace-nowrap will-change-transform ${pauseCls}`}
          style={
            {
              "--marquee-duration": `${Math.max(1, speedSec)}s`,
            } as React.CSSProperties
          }
        >
          <StripCopy built={built} dotColor={STRIP_DOT} ariaHidden />
          <StripCopy built={built} dotColor={STRIP_DOT} ariaHidden />
          <StripCopy built={built} dotColor={STRIP_DOT} ariaHidden />
          <StripCopy built={built} dotColor={STRIP_DOT} ariaHidden />
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
        /* respaldo: si es hover en el contenedor, pausa la animación */
        .group:hover .clinic-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .clinic-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

/* --------- subcomponente --------- */
const StripCopy: React.FC<{
  built: StripItem[];
  dotColor: string;
  ariaHidden?: boolean;
}> = ({ built, dotColor, ariaHidden }) => {
  return (
    <div
      className="flex flex-none items-center gap-10"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {built.map((it, i) => (
        <React.Fragment key={`${ariaHidden ? "b" : "a"}-${i}`}>
          <a
            href={it.href}
            className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold/none rounded-sm px-1 transition-colors"
            style={{ color: STRIP_TEXT }}
            onMouseEnter={(e) => (e.currentTarget.style.color = STRIP_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.color = STRIP_TEXT)}
          >
            {it.customIcon ?? <Icon name={it.icon} className="h-5 w-5" />}
            <span>{it.value}</span>
          </a>
          <span
            className="mx-6"
            style={{ color: dotColor }}
            aria-hidden="true"
          >
            •
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ClinicInfoStrip;
