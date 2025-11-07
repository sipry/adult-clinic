"use client";

import React from "react";
import { useTranslation } from "../contexts/TranslationContext";
import ncqa from "@/../public/assets/svg/ncqa.svg";
import adventHealth from "@/../public/assets/svg/adventHealth.svg";
import { BRAND } from "@/app/ui/palette";

/* 🎨 misma paleta que usas en services */
const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" }, // 0
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" }, // 1 ⭐ pastel verde
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" },
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" },
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" },
  { base: "#E48C7A", back: "#D67463", text: "#001219" },
  { base: "#E57B76", back: "#D66A65", text: "#001219" },
  { base: "#DC767B", back: "#C85D61", text: "#001219" },
];

/* un solo fondo pastel */
const STRIP_BG = PALETTE[1].base; // verde pastel
const STRIP_TEXT = PALETTE[1].text; // #001219
const STRIP_HOVER = BRAND?.cta ?? "#BB3E03";
const STRIP_DOT = PALETTE[7].back;
const LABEL_BG = "rgba(255,255,255,0.22)";

type AwardStripItem = {
  label: string;
  title: string;
  img?: string;
  href?: string;
};

type AwardsStripProps = {
  speedSec?: number;
  pauseOnHover?: boolean;
  className?: string;
};

const AwardsStrip: React.FC<AwardsStripProps> = ({
  speedSec = 55,
  pauseOnHover = true,
  className = "",
}) => {
  const { t } = useTranslation();

  const items: AwardStripItem[] = [
    {
      label: t("awards.label") || "Recognized by",
      title: t("awards.ncqa.title") || "NCQA – Patient Centered",
      img: ncqa.src,
      href: "https://www.ncqa.org/programs/health-care-providers-practices/patient-centered-medical-home-pcmh/",
    },
    {
      label: t("awards.label") || "Recognized by",
      title: t("awards.adventHealth.title") || "AdventHealth",
      img: adventHealth.src,
      href: "https://www.adventhealth.com/",
    },
  ];

  const pauseCls = pauseOnHover ? "group-hover:[animation-play-state:paused]" : "";

  return (
    <div
      className={`group relative py-3 ${className}`}
      role="region"
      aria-label={t("awards.regionLabel") || "Recognitions and affiliations"}
      style={{
        backgroundColor: STRIP_BG,
        color: STRIP_TEXT,
        width: "100%", // si quieres full banda: "100vw"
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          backgroundColor: STRIP_BG, // 👈 fondo atrás del mask también verde
        }}
      >
        <div
          className={`awards-track flex flex-none items-center gap-10 whitespace-nowrap will-change-transform ${pauseCls}`}
          style={
            {
              "--marquee-duration": `${Math.max(20, speedSec)}s`,
              backgroundColor: STRIP_BG, // 👈 el track va sobre verde también
            } as React.CSSProperties
          }
        >
          <StripCopy items={items} />
          <StripCopy items={items} ariaHidden />
          <StripCopy items={items} ariaHidden />
          <StripCopy items={items} ariaHidden />
        </div>
      </div>

      <style>{`
        @keyframes awards-marquee {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-50%,0,0); }
        }
        .awards-track {
          animation: awards-marquee var(--marquee-duration) linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .awards-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const StripCopy: React.FC<{
  items: AwardStripItem[];
  ariaHidden?: boolean;
}> = ({ items, ariaHidden }) => {
  return (
    <div
      className="flex flex-none items-center gap-10"
      aria-hidden={ariaHidden ? "true" : undefined}
      style={{ backgroundColor: STRIP_BG }} // 👈 por si acaso
    >
      {items.map((it, i) => {
        const content = (
          <span className="inline-flex items-center gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
              style={{
                backgroundColor: LABEL_BG,
                color: STRIP_TEXT,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {it.label}
            </span>

            {it.img ? (
              <img
                src={it.img}
                alt={it.title}
                className="h-7 w-auto object-contain"
                loading="lazy"
              />
            ) : null}

            <span
              className="text-sm sm:text-base font-semibold"
              style={{ whiteSpace: "nowrap", color: STRIP_TEXT }}
            >
              {it.title}
            </span>
          </span>
        );

        return (
          <React.Fragment key={`${ariaHidden ? "b" : "a"}-${i}`}>
            {it.href ? (
              <a
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: STRIP_TEXT }}
                onMouseEnter={(e) => (e.currentTarget.style.color = STRIP_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.color = STRIP_TEXT)}
              >
                {content}
              </a>
            ) : (
              content
            )}
            <span
              className="mx-4 text-lg"
              style={{ color: STRIP_DOT }}
              aria-hidden="true"
            >
              •
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AwardsStrip;
