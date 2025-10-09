'use client'
import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

type Props = {
  /** Optional: if your Navbar already tracks scroll, pass it here */
  scrolled?: boolean;
};

const LanguageToggle: React.FC<Props> = ({ scrolled }) => {
  const { language, setLanguage } = useTranslation();
  const [internalScrolled, setInternalScrolled] = useState(false);

  // If no prop provided, detect scroll locally
  useEffect(() => {
    if (scrolled !== undefined) return; // controlled by parent
    const onScroll = () => setInternalScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const isScrolled = scrolled ?? internalScrolled;

  const baseBtn = isScrolled
    ? "px-3 py-1 text-xs font-thin rounded-md transition-colors duration-50"
    : "px-3 py-1 text-xs font-thin rounded-md transition-colors duration-50";

  const activeBtn = isScrolled ? "bg-white shadow-sm text-black text-xs font-thin" : "bg-white text-black shadow-sm text-xs font-thin" ;

  const inactiveText = isScrolled
    ? "text-gray-800"
    : "text-inverse-onSurface";

  const inactiveHover = isScrolled
    ? "hover:text-gray-800 hover:bg-white/50 hover:scale-105 mr-1"
    : "text-gray-800 hover:bg-white/50 hover:scale-105 mr-1";

  return (
    <div
      className={
        "flex items-center gap-2 rounded-lg px-2 py-1 transition-colors duration-50 bg-gray-300/50 "
      }
    >
      <Globe className="w-4 h-4 opacity-90" />

      <div className="flex ">
        {/* ES */}
        <button
          type="button"
          onClick={() => setLanguage("es")}
          aria-pressed={language === "es"}
          className={[
            baseBtn,
            language === "es" ? activeBtn : `${inactiveText} ${inactiveHover}`,
          ].join(" ")}
        >
          Español
        </button>

        {/* EN — per your request:
            not selected -> white at top, black after scroll */}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={[
            baseBtn,
            language === "en" ? activeBtn : `${inactiveText} ${inactiveHover}`,
          ].join(" ")}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
