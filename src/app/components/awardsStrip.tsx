"use client";

import type { CSSProperties, FC } from "react";
import ncqa from "@/../public/assets/svg/ncqa.svg";
import adventHealth from "@/../public/assets/svg/adventHealth.svg";
import { useTranslation } from "../contexts/TranslationContext";

type AwardItem = {
  /** Clave de traducción del título */
  titleKey: string;
  /** Ruta de imagen (import .src) */
  imageSrc: string;
  /** Clave de traducción del alt */
  imageAltKey: string;
  href?: string;
  size?: number;
  className?: string;
};

const AwardsStrip: FC = () => {
  const { t } = useTranslation();

  const awards: AwardItem[] = [
    {
      titleKey: "awards.ncqa.title",
      imageSrc: ncqa.src,
      imageAltKey: "awards.ncqa.alt",
      href: "https://www.ncqa.org/programs/health-care-providers-practices/patient-centered-medical-home-pcmh/",
      size: 50,
    },
    {
      titleKey: "awards.adventHealth.title",
      imageSrc: adventHealth.src,
      imageAltKey: "awards.adventHealth.alt",
      href: "https://www.adventhealth.com/",
      size: 80,
      className: "mb-2",
    },
  ];

  const marqueeStyle: CSSProperties & { ["--marquee-duration"]?: string } = {
    // duración del marquee (puedes internacionalizarla si lo necesitas)
    ["--marquee-duration"]: "26s",
  };

  return (
    <div
      className="group relative bg-amber-100 text-gray-900 py-2"
      role="region"
      aria-label={t("awards.regionLabel")}
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
          className="awards-track flex flex-none shrink-0 items-center gap-10 whitespace-nowrap will-change-transform"
          style={marqueeStyle}
        >
          <StripCopy awards={awards} />
          <StripCopy awards={awards} ariaHidden />
        </div>
      </div>

      <style jsx>{`
        @keyframes awards-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
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

type StripCopyProps = {
  awards: AwardItem[];
  ariaHidden?: boolean;
};

const StripCopy: FC<StripCopyProps> = ({ awards, ariaHidden }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-none shrink-0 items-center gap-10"
      aria-hidden={ariaHidden ?? undefined}
    >
      {awards.map((item) => {
        const size = item.size ?? 32;

        const content = (
          <span className="inline-flex items-center gap-3 sm:text-base font-normal px-1">
            <span className="opacity-80">{t("awards.label")}</span>
            <img
              src={item.imageSrc}
              alt={t(item.imageAltKey)}
              width={size}
              height={size}
              className={["object-contain", item.className].filter(Boolean).join(" ")}
              loading="lazy"
            />
            <span className="font-bold opacity-80">{t(item.titleKey)}</span>
          </span>
        );

        const key = `${ariaHidden ? "b" : "a"}-${item.titleKey}`;

        return (
          <span key={key} className="flex items-center">
            {item.href ? (
              <a
                href={item.href}
                className="hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("awards.linkLabel")}
              >
                {content}
              </a>
            ) : (
              content
            )}
            <span className="mx-6 text-gray-700/60" aria-hidden>
              •
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default AwardsStrip;
