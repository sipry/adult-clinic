"use client";

import type { CSSProperties, FC } from "react";
import ncqa from "@/../public/assets/svg/ncqa.svg";
import adventHealth from "@/../public/assets/svg/adventHealth.svg";
import { useTranslation } from "../contexts/TranslationContext";

/* 🎨 Paleta pictórica */
const PALETTE = {
  amber: "#B67B39",  // ámbar cálido
  moss: "#7C8C4D",   // verde musgo
  wine: "#812D20",   // vino terroso
  ochre: "#D8C27A",  // ocre claro
  olive: "#4F5635",  // oliva profundo
  cream: "#FAF4E6",  // crema suave
  dark: "#2B2725",   // marrón oscuro
};

/* ---------- Tipos ---------- */
type AwardItem = {
  titleKey: string;
  imageSrc: string;
  imageAltKey: string;
  href?: string;
  size?: number;
  className?: string;
};

/* ---------- Componente principal ---------- */
const AwardsStrip: FC = () => {
  const { t } = useTranslation();

  const awards: AwardItem[] = [
    {
      titleKey: "awards.ncqa.title",
      imageSrc: ncqa.src,
      imageAltKey: "awards.ncqa.alt",
      href: "https://www.ncqa.org/programs/health-care-providers-practices/patient-centered-medical-home-pcmh/",
      size: 44,
    },
    {
      titleKey: "awards.adventHealth.title",
      imageSrc: adventHealth.src,
      imageAltKey: "awards.adventHealth.alt",
      href: "https://www.adventhealth.com/",
      size: 68,
      className: "mb-1",
    },
  ];

  return (
    <div
      className="group relative py-1.5"
      role="region"
      aria-label={t("awards.regionLabel")}
      style={{
        backgroundColor: PALETTE.amber, // fondo contrastante
        color: PALETTE.dark, // texto claro
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
          className="awards-track flex flex-none shrink-0 items-center gap-8 whitespace-nowrap will-change-transform"
          style={
            {
              "--marquee-duration": "80s", // ⏳ más lento
            } as CSSProperties
          }
        >
          <StripCopy awards={awards} />
          <StripCopy awards={awards} ariaHidden />
          <StripCopy awards={awards} ariaHidden />
          <StripCopy awards={awards} ariaHidden />
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
          .awards-track { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
};

/* ---------- Contenido desplazable ---------- */
const StripCopy: FC<{ awards: AwardItem[]; ariaHidden?: boolean }> = ({
  awards,
  ariaHidden,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-none shrink-0 items-center gap-8"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {awards.map((item, i) => {
        const size = item.size ?? 36;

        const content = (
          <span
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold px-1 transition-colors duration-200"
            style={{ color: PALETTE.dark }}
          >
            <span
              className="text-xs sm:text-sm"
              style={{ color: PALETTE.dark, opacity: 0.9 }}
            >
              {t("awards.label")}
            </span>
            <img
              src={item.imageSrc}
              alt={t(item.imageAltKey)}
              width={size}
              height={size}
              className={["object-contain", item.className]
                .filter(Boolean)
                .join(" ")}
              loading="lazy"
            />
            <span>{t(item.titleKey)}</span>
          </span>
        );

        return (
          <span key={`${ariaHidden ? "b" : "a"}-${i}`} className="flex items-center">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("awards.linkLabel")}
                className="hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(250,244,230,0.5)] rounded-sm"
                style={{ color: PALETTE.dark }}
              >
                {content}
              </a>
            ) : (
              content
            )}
            <span
              className="mx-4"
              style={{ color: PALETTE.dark, opacity: 0.8 }}
              aria-hidden="true"
            >
              •
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default AwardsStrip;
