"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Stethoscope } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";
import LanguageToggle from "./LanguageToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PALETTE, BRAND } from "@/app/ui/palette";

type NavbarScheme = "auto" | "white" | "dark";

interface NavbarProps {
  scheme?: NavbarScheme;
}

const SECTION_IDS = [
  "home",
  "about",
  "services",
  "insurance",
  "providers",
  "gallery",
  "contact",
];

const Navbar: React.FC<NavbarProps> = ({ scheme = "auto" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { t } = useTranslation();
  const pathname = usePathname();

  const primary = PALETTE[0];

  const onServicesPage = !!pathname && pathname.startsWith("/services");
  const forceWhite =
    scheme === "white" || (scheme === "auto" && onServicesPage);
  const solidNav = forceWhite || isScrolled;

  // scroll + scrollspy + resize
  useEffect(() => {
    const applyScrollState = () => setIsScrolled(window.scrollY > 50);
    applyScrollState();

    const onScrollSection = () => {
      let current = "";
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
        }
      });
      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    window.addEventListener("scroll", applyScrollState, { passive: true });
    window.addEventListener("scroll", onScrollSection, { passive: true });
    window.addEventListener("load", applyScrollState);
    window.addEventListener("pageshow", applyScrollState);

    // cerrar drawer al pasar a desktop
    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", applyScrollState);
      window.removeEventListener("scroll", onScrollSection);
      window.removeEventListener("load", applyScrollState);
      window.removeEventListener("pageshow", applyScrollState);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // re-evaluar scroll al cambiar de ruta
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 50);
    }
  }, [pathname]);

  // bloquear scroll cuando el drawer está abierto
  useEffect(() => {
    const { body, documentElement } = document;
    if (isMobileMenuOpen) {
      const prevBody = body.style.overflow;
      const prevHtml = documentElement.style.overflow;
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
      return () => {
        body.style.overflow = prevBody;
        documentElement.style.overflow = prevHtml;
      };
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/#", id: "home", label: t("nav.home") },
    { href: "/#about", id: "about", label: t("nav.about") },
    { href: "/#services", id: "services", label: t("nav.services") },
    { href: "/#insurance", id: "insurance", label: t("nav.insurance") },
    { href: "/#providers", id: "providers", label: t("nav.providers") },
    { href: "/#gallery", id: "gallery", label: t("nav.gallery") },
    { href: "/#contact", id: "contact", label: t("nav.contact") },
  ];

  const linkClasses = (isActive: boolean) =>
    [
      "relative group transition-colors duration-300 hover:scale-105 font-medium text-sm tracking-widest",
      solidNav
        ? isActive
          ? "text-[#001219]"
          : "text-[#005F73] hover:text-[#001219]"
        : isActive
          ? "text-white"
          : "text-white hover:text-[#94d2bd]",
    ].join(" ");

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24",
          "py-4 transition-all duration-500 flex items-center justify-between",
          solidNav ? "shadow-lg backdrop-blur-md" : "shadow-none",
        ].join(" ")}
        style={{
          backgroundColor: solidNav ? BRAND.bg : "transparent",
          transition: "background-color 400ms ease, box-shadow 400ms ease",
        }}
      >
        {/* contenido derecho */}
        <div className="flex items-center ml-auto">
          {/* desktop links (xl+) */}
          <div className="hidden xl:flex items-center space-x-6 mr-4">
            {navLinks.map(({ href, id, label }) => {
              const isActive = activeSection === id;
              return (
                <a key={href} href={href} className={linkClasses(isActive)}>
                  {label}
                  <span
                    className={[
                      "absolute left-0 -bottom-1 h-[1px] bg-current transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    ].join(" ")}
                  />
                </a>
              );
            })}
          </div>

          {/* acciones en md–<xl (solo cuando el menú NO está abierto) */}
          <div
            className={`${isMobileMenuOpen ? "hidden" : "hidden md:flex xl:hidden"
              } items-center gap-3`}
          >
            <LanguageToggle scrolled={solidNav} />
            <Link
              href="/contact"
              className="transition-transform rounded-md duration-300 font-normal text-sm py-2 px-6 tracking-wide hover:scale-105 shadow-md"
              style={{
                backgroundColor: primary.base,
                color: BRAND.text,
                border: `1px solid ${primary.back}`,
              }}
            >
              {t("nav.explore")}
            </Link>
          </div>

          {/* acciones desktop (>=xl) */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageToggle scrolled={solidNav} />
            <Link
              href="/contact"
              className="transition-transform rounded-md duration-300 font-normal text-sm py-2 px-6 tracking-wide hover:scale-105 shadow-md"
              style={{
                backgroundColor: primary.base,
                color: BRAND.text,
                border: `1px solid ${primary.back}`,
              }}
            >
              {t("nav.explore")}
            </Link>
          </div>

          {/* botón mobile */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 ml-3 flex xl:hidden transition-transform duration-200 hover:scale-110"
            style={{ color: solidNav ? BRAND.text : "#FFFFFF" }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* overlay mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[55] transition-opacity duration-300 xl:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* drawer mobile */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 w-80 max-w-[90vw] shadow-2xl z-[60]
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          h-dvh xl:hidden`}
        style={{ backgroundColor: BRAND.bg }}
      >
        <div className="flex flex-col h-full">
        {/* header */}
<div className="shrink-0 flex items-center justify-between p-6 border-b border-[#00121910]">
  <div className="flex items-center gap-2">
    <Stethoscope className="w-5 h-5" style={{ color: BRAND.text }} />
    <span
      className="text-md tracking-wide font-semibold"
      style={{ color: BRAND.text }}
    >
      Your Health Adult Care
    </span>
  </div>
  <button
    onClick={closeMobileMenu}
    className="p-2 transition-colors"
    style={{ color: BRAND.text }}
    aria-label="Close mobile menu"
  >
    <X className="w-5 h-5" />
  </button>
</div>


          {/* body */}
          <nav className="flex-1 min-h-0 px-6 py-8 overflow-y-auto">
            <div className="space-y-6">
              {navLinks.map(({ href, id, label }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`block text-md font-medium py-2 tracking-wide transition-colors ${isActive
                        ? "text-[#0A9396]"
                        : "text-[#001219] hover:text-[#0A9396]"
                      }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* footer */}
          <div className="shrink-0 p-6 border-t border-[#00121910] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: BRAND.text }}>
                {t("nav.language")}
              </span>
              <LanguageToggle scrolled />
            </div>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="inline-flex items-center justify-center font-semibold py-3 px-4 rounded-md transition-transform hover:scale-[1.015] shadow-sm"
              style={{
                backgroundColor: primary.base,
                color: BRAND.text,
                border: `1px solid ${primary.back}`,
              }}
            >
              {t("nav.explore")}
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
