'use client'
import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

/* 🎨 Paleta pictórica */
const PALETTE = {
  amber: "#B67B39",
  moss: "#7C8C4D",
  wine: "#812D20",
  ochre: "#D8C27A",
  olive: "#4F5635",
  cream: "#FAF4E6",
  dark: "#2B2725",
};

type Props = {
  /** Optional: if your Navbar already tracks scroll, pass it here */
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

  const activeBtn = {
    backgroundColor: isScrolled ? PALETTE.olive : PALETTE.cream,
    color: isScrolled ? PALETTE.cream : PALETTE.dark,
    boxShadow: `0 1px 3px ${PALETTE.dark}33`,
  };

  const inactiveBtn = {
    backgroundColor: "transparent",
    color: isScrolled ? PALETTE.dark : PALETTE.cream,
  };

  const inactiveHover = {
    backgroundColor: isScrolled ? `${PALETTE.olive}20` : `${PALETTE.cream}33`,
    color: isScrolled ? PALETTE.dark : PALETTE.cream,
  };

  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200"
      style={{
        // 👇 Fondo ligeramente grisáceo / neutro para resaltar sutilmente
        backgroundColor: isScrolled
          ? "rgba(240, 236, 226, 0.92)" // un toque más gris que PALETTE.cream
          : "rgba(43, 39, 37, 0.55)",   // un poco más neutro en modo oscuro
        boxShadow: isScrolled
          ? `inset 0 0 4px rgba(0,0,0,0.06)`
          : `inset 0 0 4px rgba(255,255,255,0.08)`,
        backdropFilter: "blur(4px)",
      }}
    >
      <Globe
        className="w-4 h-4 opacity-90"
        style={{ color: isScrolled ? PALETTE.dark : PALETTE.cream }}
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
