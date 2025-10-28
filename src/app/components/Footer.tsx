"use client";

import React from "react";
import { Calendar, MapPin, Mail, Phone, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
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
    const check = () => { raf = 0; setInView(visibleNow()); };

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) => ents.forEach((e) => setInView(e.isIntersecting || e.intersectionRatio > 0)),
        options ?? { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }
    raf = window.requestAnimationFrame(check);
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(check); };
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
  const FACEBOOK_URL = "#";
  const INSTAGRAM_URL = "#";
  const ADDRESS = "201 Hilda St Suite 15, Kissimmee, FL 34741, United States";
  const mapQuery = React.useMemo(() => encodeURIComponent(ADDRESS), [ADDRESS]);
  const MAP_EMBED_SRC = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const { t } = useTranslation();

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
      React.useEffect(() => { if (inView) setShown(true); else if (!once) setShown(false); }, [inView, once]);
      const style: React.CSSProperties = reduce ? {} : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate(${x}px, ${y}px) scale(${scale})`,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      };
      return <div ref={ref} className={className} style={style}>{children}</div>;
    };

  return (
    <footer
      className="overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${PALETTE.olive}, ${PALETTE.dark})`,
        color: `${PALETTE.cream}`,
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B272580] via-transparent to-transparent pointer-events-none" />
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block md:hidden" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-x-8 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: PALETTE.ochre }}>
            {t("footer.brand")}
          </h2>
          <p className="text-sm mb-5 opacity-90">{t("footer.tagline")}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md hover:opacity-90 transition"
            style={{
              backgroundColor: PALETTE.amber,
              color: PALETTE.cream,
            }}
          >
            <Calendar className="w-4 h-4" />
            {t("footer.cta")}
          </Link>
        </div>

        {/* Links */}
        <nav>
          <h3 className="text-base font-semibold mb-3" style={{ color: PALETTE.ochre }}>
            {t("footer.nav.title")}
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link href="/" className="hover:opacity-100 hover:text-amber-200">{t("footer.nav.home")}</Link></li>
            <li><Link href="/all-services" className="hover:opacity-100 hover:text-amber-200">{t("footer.nav.services")}</Link></li>
            <li><Link href="/about" className="hover:opacity-100 hover:text-amber-200">{t("footer.nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:opacity-100 hover:text-amber-200">{t("footer.nav.contact")}</Link></li>
            <li><Link href="/appointment" className="hover:opacity-100 hover:text-amber-200">{t("footer.nav.appointment")}</Link></li>
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold mb-3" style={{ color: PALETTE.ochre }}>
            {t("footer.contact.title")}
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="flex gap-2 items-start">
              <Phone className="w-4 h-4 shrink-0" style={{ color: PALETTE.ochre }} />
              <span>(407) 574 - 4848</span>
            </li>
            <li className="flex gap-2 items-start">
              <Mail className="w-4 h-4 shrink-0" style={{ color: PALETTE.ochre }} />
              <a href="mailto:info@yourhealthadults.com" className="hover:text-amber-200">
                info@yourhealthadults.com
              </a>
            </li>
            <li className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: PALETTE.ochre }} />
              <span>{t("footer.contact.address.line1")}<br />{t("footer.contact.address.line2")}</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-base font-semibold mb-3" style={{ color: PALETTE.ochre }}>
            {t("footer.social.title")}
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold shadow-md hover:opacity-90 transition"
              style={{ backgroundColor: PALETTE.olive, color: PALETTE.cream }}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold shadow-md hover:opacity-90 transition"
              style={{
                background: `linear-gradient(45deg, ${PALETTE.wine}, ${PALETTE.amber})`,
                color: PALETTE.cream,
              }}
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div
        className="text-center text-xs py-4 border-t"
        style={{
          borderColor: `${PALETTE.cream}33`,
          backgroundColor: `${PALETTE.dark}`,
          color: `${PALETTE.cream}cc`,
        }}
      >
        <p>© {year} {t("footer.brand")}. {t("footer.copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
