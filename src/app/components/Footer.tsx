"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../contexts/TranslationContext";
import { BRAND, PALETTE } from "../ui/palette";

/* 👉 URLs del portal del paciente según idioma (ajusta a tus URLs reales) */
const PATIENT_PORTAL_URL_ES = "https://echeckin.healow.com/webecheckin/echeckin/QRCheckin?v1=R01UQ0RUcW96bTN6SHFNcGV2MUVpVjZIamlkY1VBU3QrRGdoOHZlRmw1WVBEemlHc2pTWm9Eay93dzY5SmN3QVZHdE9aTHEwTmtJM0lLc25hZk82Y3EwZlcxVHJVaFYxV1FvRndTOTBFMHc9";
const PATIENT_PORTAL_URL_EN = "https://echeckin.healow.com/webecheckin/echeckin/QRCheckin?v1=R01UQ0RUcW96bTN6SHFNcGV2MUVpVjZIamlkY1VBU3QrRGdoOHZlRmw1WVBEemlHc2pTWm9Eay93dzY5SmN3QVZHdE9aTHEwTmtJM0lLc25hZk82Y3EwZlcxVHJVaFYxV1FvRndTOTBFMHc9";

/* ---------- Motion utils: Reveal on scroll ---------- */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useInOutViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit
): boolean {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    let io: IntersectionObserver | null = null;
    let raf = 0;
    const visibleNow = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
    };
    const check = () => {
      raf = 0;
      setInView(visibleNow());
    };

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) =>
          ents.forEach((e) =>
            setInView(e.isIntersecting || e.intersectionRatio > 0)
          ),
        options ?? { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    raf = window.requestAnimationFrame(check);

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (io) io.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, options?.threshold, options?.rootMargin]);
  return inView;
}

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const FACEBOOK_URL = "https://www.facebook.com/";
  const INSTAGRAM_URL = "https://www.instagram.com/";
  const ADDRESS = "201 Hilda St Suite 15, Kissimmee, FL 34741, United States";
  const mapQuery = React.useMemo(() => encodeURIComponent(ADDRESS), [ADDRESS]);
  const MAP_EMBED_SRC = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const { t, language } = useTranslation();

  // 🔁 URL del portal según idioma
  const portalUrl =
    language === "es" ? PATIENT_PORTAL_URL_ES : PATIENT_PORTAL_URL_EN;

  // 🔳 QR con la URL dinámica
  const portalQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    portalUrl
  )}`;

  /* ---------- Reveal helper ---------- */
  const Reveal: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    y?: number;
    x?: number;
    scale?: number;
    once?: boolean;
    threshold?: number;
    rootMargin?: string;
  }> = ({
    children,
    className,
    delay = 0,
    duration = 600,
    y = 16,
    x = 0,
    scale = 1,
    once = true,
    threshold = 0.2,
    rootMargin = "0px 0px -10% 0px",
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInOutViewport(ref, { threshold, rootMargin });
    const [shown, setShown] = React.useState(false);
    const reduce = usePrefersReducedMotion();

    React.useEffect(() => {
      if (inView) setShown(true);
      else if (!once) setShown(false);
    }, [inView, once]);

    const style: React.CSSProperties = reduce
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : `translate(${x}px, ${y}px) scale(${scale})`,
          transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          willChange: "opacity, transform",
        };

    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  };

  return (
    <footer
      className="overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        color: BRAND.text,
      }}
    >
      {/* Map strip */}
      <Reveal y={16} delay={120}>
        <div>
          <div className="relative w-screen max-w-[100vw] ml-[calc(50%-50vw)]">
            <div className="relative h-64 sm:h-72 lg:h-80">
              <iframe
                title={t("contact.map.title")}
                src={MAP_EMBED_SRC}
                className="absolute inset-0 block h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* overlay clickable en mobile */}
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 block md:hidden"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-x-8 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2">
          <h2
            className="text-2xl font-semibold mb-3"
            style={{ color: BRAND.text }}
          >
            {t("footer.brand")}
          </h2>
          <p className="text-sm mb-5" style={{ color: `${BRAND.text}CC` }}>
            {t("footer.tagline")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:scale-[1.02] transition"
            style={{
              backgroundColor: PALETTE[7].base,
              color: "#FFFFFF",
            }}
          >
            <Calendar className="w-4 h-4" />
            {t("footer.cta")}
          </Link>
        </div>

        {/* Links */}
        <nav>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: BRAND.text }}
          >
            {t("footer.nav.title")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/#"
                className="transition-colors"
                style={{ color: `${BRAND.text}CC` }}
              >
                {t("footer.nav.home")}
              </Link>
            </li>

            <li>
              <Link
                href="/aboutus"
                className="transition-colors"
                style={{ color: `${BRAND.text}CC` }}
              >
                {t("footer.nav.about")}
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="transition-colors"
                style={{ color: `${BRAND.text}CC` }}
              >
                {t("footer.nav.services")}
              </Link>
            </li>
            <li>
              <Link
                href="/#providers"
                className="transition-colors"
                style={{ color: `${BRAND.text}CC` }}
              >
                {t("footer.nav.providers")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors"
                style={{ color: `${BRAND.text}CC` }}
              >
                {t("footer.nav.appointment")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: BRAND.text }}
          >
            {t("footer.contact.title")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start">
              <Phone
                className="w-4 h-4 shrink-0"
                style={{ color: BRAND.accent }}
              />
              <span style={{ color: `${BRAND.text}CC` }}>(407) 574 - 4848</span>
            </li>
            <li className="flex gap-2 items-start">
              <Mail
                className="w-4 h-4 shrink-0"
                style={{ color: BRAND.accent }}
              />
              <a
                href="mailto:info@yourhealthadults.com"
                className="hover:underline"
                style={{ color: `${BRAND.text}CC` }}
              >
                info@yourhealthadults.com
              </a>
            </li>
            <li className="flex gap-2 items-start">
              <MapPin
                className="w-4 h-4 shrink-0"
                style={{ color: BRAND.accent }}
              />
              <span style={{ color: `${BRAND.text}CC` }}>
                {t("footer.contact.address.line1")}
                <br />
                {t("footer.contact.address.line2")}
              </span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: BRAND.text }}
          >
            {t("footer.social.title")}
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold shadow-sm hover:scale-[1.01] transition"
              style={{
                backgroundColor: "#1877F2",
                color: "#FFFFFF",
              }}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold shadow-sm hover:scale-[1.01] transition"
              style={{
                background:
                  "linear-gradient(45deg, #405DE6 0%, #833AB4 35%, #E1306C 65%, #FCB045 100%)",
                color: "#FFFFFF",
              }}
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* 🧩 Franja especial para el portal del paciente + QR */}
      <div
        className="border-t"
        style={{ borderColor: `${BRAND.text}11`, backgroundColor: "#F8FBFB" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Texto explicativo */}
          <div className="max-w-md text-center md:text-left">
            <p
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: `${BRAND.text}80` }}
            >
              {t("contact.portal.qr.label")}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: `${BRAND.text}CC` }}
            >
              {t("contact.portal.qr.desc")}
            </p>
          </div>

          {/* Bloque QR + botón */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <img
                src={portalQrSrc}
                alt={t("contact.portal.qr.scan")}
                className="h-28 w-28 md:h-32 md:w-32 rounded-md bg-white p-1 shadow-sm"
              />
              <p
                className="text-[11px] text-center"
                style={{ color: `${BRAND.text}80` }}
              >
                {t("contact.portal.qr.scan")}
              </p>
            </div>

            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:scale-[1.01] transition"
              style={{
                backgroundColor: PALETTE[0].base,
                color: BRAND.text,
              }}
            >
              {t("contact.portal.qr.visit")}
            </a>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div
        className="text-center text-xs py-4 border-t"
        style={{
          borderColor: `${BRAND.text}11`,
          backgroundColor: "#FFFFFF",
          color: `${BRAND.text}99`,
        }}
      >
        <p>
          © {year} {t("footer.brand")}. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
