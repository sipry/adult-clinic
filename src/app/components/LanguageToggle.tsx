"use client";
import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";
import { PALETTE, BRAND } from "@/app/ui/palette";

type Props = {
  scrolled?: boolean;
};

const LanguageToggle: React.FC<Props> = ({ scrolled }) => {
  const { language, setLanguage } = useTranslation();
  const [internalScrolled, setInternalScrolled] = useState(false);

  useEffect(() => {
    if (scrolled !== undefined) return;
    const onScroll = () => setInternalScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const isScrolled = scrolled ?? internalScrolled;

  const baseBtn =
    "px-3 py-1 text-xs font-thin rounded-md transition-all duration-200";

  const activeBtn: React.CSSProperties = {
    backgroundColor: BRAND.accent,
    color: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };

  const inactiveBtn: React.CSSProperties = {
    backgroundColor: "transparent",
    color: BRAND.text,
  };

  const inactiveHover: React.CSSProperties = {
    backgroundColor: "rgba(10, 147, 150, 0.08)",
    color: BRAND.text,
  };

  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200"
      style={{
        backgroundColor: "#F3F4F6", // 👈 lo dejamos gris clarito
        boxShadow: "inset 0 0 4px rgba(0,0,0,0.02)",
        backdropFilter: "blur(2px)",
      }}
    >
      <Globe
        className="w-4 h-4 opacity-70"
        style={{ color: BRAND.text }}
      />

      <div className="flex">
        {/* ES */}
        <button
          type="button"
          onClick={() => setLanguage("es")}
          aria-pressed={language === "es"}
          className={baseBtn}
          style={language === "es" ? activeBtn : inactiveBtn}
          onMouseEnter={(e) =>
            Object.assign(
              e.currentTarget.style,
              language === "es" ? {} : inactiveHover
            )
          }
          onMouseLeave={(e) =>
            Object.assign(
              e.currentTarget.style,
              language === "es" ? activeBtn : inactiveBtn
            )
          }
        >
          Español
        </button>

        {/* EN */}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`${baseBtn} ml-1`}
          style={language === "en" ? activeBtn : inactiveBtn}
          onMouseEnter={(e) =>
            Object.assign(
              e.currentTarget.style,
              language === "en" ? {} : inactiveHover
            )
          }
          onMouseLeave={(e) =>
            Object.assign(
              e.currentTarget.style,
              language === "en" ? activeBtn : inactiveBtn
            )
          }
        >
          English
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
