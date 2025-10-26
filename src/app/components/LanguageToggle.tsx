'use client'
import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
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

type Props = {
  /** Optional: if your Navbar already tracks scroll, pass it here */
  scrolled?: boolean;
};

const LanguageToggle: React.FC<Props> = ({ scrolled }) => {
  const { language, setLanguage } = useTranslation();
  const [internalScrolled, setInternalScrolled] = useState(false);

  // Si no se pasa prop, detecta scroll localmente
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
    boxShadow: isScrolled ? `0 1px 3px ${PALETTE.dark}33` : `0 1px 3px ${PALETTE.dark}33`,
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
        backgroundColor: isScrolled ? `${PALETTE.cream}cc` : `${PALETTE.dark}66`,
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
