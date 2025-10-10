"use client";

import React from "react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "../contexts/TranslationContext";

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
  const ADDRESS = "201 Hilda St Suite 15 Kisseemmee  FL 34741 United States";
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
      return <div ref={ref} className={className} style={style} aria-hidden={!shown}>{children}</div>;
    };

  return (
    <footer className="bg-sky-950 text-gray-300 overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent pointer-events-none" />
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("contact.map.open")}
                title={t("contact.map.open")}
                className="absolute inset-0 block md:hidden"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main content */}
      <div
        className="
          max-w-7xl mx-auto px-6 py-12 grid gap-x-8 gap-y-10
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]
        "
      >
        {/* 1) Brand — BIG */}
        <div className="min-w-0 sm:col-span-2 md:col-span-1">
          <h2 className="text-2xl font-bold mb-3">{t("footer.brand")}</h2>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {t("footer.tagline")}
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-sky-700 px-4 py-3 text-sm font-light text-white shadow-md hover:bg-sky-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 w-full sm:w-auto justify-center"
            aria-label={t("footer.ctaAria")}
          >
            <Calendar className="w-4 h-4"/>
            {t("footer.cta")}
          </Link>
        </div>

        {/* 2) Enlaces — SMALL */}
        <nav className="min-w-0 sm:col-span-1">
          <h3 className="text-base font-semibold mb-3">{t("footer.nav.title")}</h3>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><Link href="/" className="hover:text-white">{t("footer.nav.home")}</Link></li>
            <li><Link href="/all-services" className="hover:text-white">{t("footer.nav.services")}</Link></li>
            <li><Link href="/about" className="hover:text-white">{t("footer.nav.about")}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t("footer.nav.contact")}</Link></li>
            <li><Link href="/appointment" className="hover:text-white">{t("footer.nav.appointment")}</Link></li>
          </ul>
        </nav>

        {/* 3) Social — SMALL */}
        <div className="min-w-0 sm:col-span-1">
          <h3 className="text-base font-semibold mb-3">{t("footer.social.title")}</h3>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li className="flex items-start gap-2">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white break-words" aria-label={t("footer.social.facebookAria")}>
                {t("footer.social.facebook")}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white break-words" aria-label={t("footer.social.instagramAria")}>
                {t("footer.social.instagram")}
              </a>
            </li>
          </ul>
        </div>

        {/* 4) Contáctanos — BIG */}
        <div className="min-w-0 sm:col-span-1">
          <h3 className="text-base font-semibold mb-3">{t("footer.contact.title")}</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-2 text-xs">
              <span className="break-words">(407) 574 - 4848</span>
            </li>
            <li className="flex items-start gap-2 text-xs">
              <a
                href="mailto:info@yourhealthadults.com"
                className="hover:text-white leading-snug"
                aria-label={t("footer.contact.emailAria")}
              >
                <span className="block">info@</span>
                <span>yourhealthadults.com</span>
              </a>
            </li>
            <li className="flex items-start gap-2 text-xs">
              <span className="break-words">
                {t("footer.contact.address.line1")}
                <br />
                {t("footer.contact.address.line2")}
              </span>
            </li>
          </ul>
        </div>

        {/* 5) Horarios — BIG */}
        <div className="min-w-0 sm:col-span-1">
          <h3 className="text-base font-semibold mb-3">{t("footer.hours.title")}</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2 text-xs">
              <span className="break-words">{t("footer.hours.weekdays")}</span>
            </li>
            <li className="flex items-start gap-2 text-xs">
              <span className="break-words">{t("footer.hours.weekend")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy rights */}
      <div className="border-t border-white/20 py-4 text-center text-xs text-gray-400 mt-6">
        <p>© {year} {t("footer.brand")}. {t("footer.copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
