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

/* 🎨 Paleta pastel unificada (la que vienes usando) */
const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" }, // 0
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" }, // 1
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" }, // 2
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" }, // 3
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" }, // 4
  { base: "#E48C7A", back: "#D67463", text: "#001219" }, // 5
  { base: "#E57B76", back: "#D66A65", text: "#001219" }, // 6
  { base: "#DC767B", back: "#C85D61", text: "#001219" }, // 7
];

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
        color: PALETTE[0].text, // #001219
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
            style={{ color: PALETTE[0].text }}
          >
            {t("footer.brand")}
          </h2>
          <p
            className="text-sm mb-5"
            style={{ color: `${PALETTE[0].text}CC` }}
          >
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
            style={{ color: PALETTE[0].text }}
          >
            {t("footer.nav.title")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="transition-colors"
                style={{ color: `${PALETTE[0].text}CC` }}
              >
                {t("footer.nav.home")}
              </Link>
            </li>
            <li>
              <Link
                href="/all-services"
                className="transition-colors"
                style={{ color: `${PALETTE[0].text}CC` }}
              >
                {t("footer.nav.services")}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="transition-colors"
                style={{ color: `${PALETTE[0].text}CC` }}
              >
                {t("footer.nav.about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors"
                style={{ color: `${PALETTE[0].text}CC` }}
              >
                {t("footer.nav.contact")}
              </Link>
            </li>
            <li>
              <Link
                href="/appointment"
                className="transition-colors"
                style={{ color: `${PALETTE[0].text}CC` }}
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
            style={{ color: PALETTE[0].text }}
          >
            {t("footer.contact.title")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start">
              <Phone
                className="w-4 h-4 shrink-0"
                style={{ color: PALETTE[3].back }}
              />
              <span style={{ color: `${PALETTE[0].text}CC` }}>
                (407) 574 - 4848
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <Mail
                className="w-4 h-4 shrink-0"
                style={{ color: PALETTE[3].back }}
              />
              <a
                href="mailto:info@yourhealthadults.com"
                className="hover:underline"
                style={{ color: `${PALETTE[0].text}CC` }}
              >
                info@yourhealthadults.com
              </a>
            </li>
            <li className="flex gap-2 items-start">
              <MapPin
                className="w-4 h-4 shrink-0"
                style={{ color: PALETTE[3].back }}
              />
              <span style={{ color: `${PALETTE[0].text}CC` }}>
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
            style={{ color: PALETTE[0].text }}
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
                backgroundColor: PALETTE[0].base,
                color: PALETTE[0].text,
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
                backgroundColor: PALETTE[4].base,
                color: PALETTE[0].text,
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
          borderColor: `${PALETTE[0].text}11`,
          backgroundColor: "#FFFFFF",
          color: `${PALETTE[0].text}99`,
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
