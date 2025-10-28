"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProvidersData } from "../provider/data";
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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
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
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
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
        options || { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    raf = requestAnimationFrame(check);
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (io) io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, options?.threshold, options?.rootMargin]);

  return inView;
}

/* ✨ Reveal animation */
type RevealProps = {
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
};

const Reveal: React.FC<RevealProps> = ({
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInOutViewport(ref, { threshold, rootMargin });
  const [shown, setShown] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
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
    <div ref={ref} className={className} style={style} aria-hidden={!shown}>
      {children}
    </div>
  );
};

/* 🔶 Componente principal */
interface ProvidersProps {
  onProviderClick?: (providerId: string) => void;
}

const Providers: React.FC<ProvidersProps> = ({ onProviderClick }) => {
  const providers = useProvidersData();
  const { t } = useTranslation();

  return (
    <section
      id="providers"
      className="relative pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden scroll-mt-28"
      style={{ backgroundColor: PALETTE.cream }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:px-8 xl:grid-cols-5">
        {/* Section Header */}
        <div className="max-w-2xl xl:col-span-2 z-10">
          <Reveal y={8} delay={0}>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: PALETTE.olive }}
            >
              {t("providers.pretitle")}
            </p>
          </Reveal>

          <Reveal y={8} delay={40}>
            <h2
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{ color: PALETTE.dark }}
            >
              {t("providers.title")}
            </h2>
          </Reveal>

          <Reveal y={8} delay={80}>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: PALETTE.olive }}>
              {t("providers.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Providers List */}
        <ul role="list" className="divide-y xl:col-span-3" style={{ borderColor: `${PALETTE.dark}22` }}>
          {providers.map((provider) => {
            const imgSrc =
              typeof provider.image === "string"
                ? provider.image
                : provider.image.src;

            return (
              <li
                key={provider.id}
                className="flex flex-col gap-10 py-12 first:pt-0 last:pb-0 sm:flex-row"
              >
                <img
                  alt={provider.name}
                  src={imgSrc}
                  className="aspect-4/5 w-52 flex-none rounded-2xl object-cover shadow-md"
                  loading="lazy"
                  style={{
                    outline: `1px solid ${PALETTE.dark}22`,
                    backgroundColor: `${PALETTE.dark}08`,
                  }}
                />

                <div className="max-w-xl flex-auto">
                  <Reveal y={6} delay={0} duration={520}>
                    <h3 className="text-lg font-semibold" style={{ color: PALETTE.dark }}>
                      {provider.name}
                    </h3>
                  </Reveal>

                  <Reveal y={6} delay={40} duration={520}>
                    <p
                      className="text-base font-medium z-10"
                      style={{ color: PALETTE.moss }}
                    >
                      {provider.title}
                    </p>
                  </Reveal>

                  <Reveal y={8} delay={80} duration={520}>
                    <p
                      className="mt-6 text-base leading-relaxed"
                      style={{ color: `${PALETTE.dark}cc` }}
                    >
                      {((bio) => {
                        const MAX = 102;
                        return bio.length > MAX
                          ? bio.slice(0, MAX).trimEnd() + " ..."
                          : bio;
                      })(provider?.bio ?? "")}
                    </p>
                  </Reveal>

                  <Reveal y={8} delay={120} duration={520}>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm" style={{ color: `${PALETTE.dark}99` }}>
                        {provider.experience}
                      </p>
                      <p className="text-sm" style={{ color: `${PALETTE.dark}99` }}>
                        {provider.languages}
                      </p>
                    </div>
                  </Reveal>

                  <Reveal y={8} delay={160} duration={520}>
                    <div className="mt-6">
                      <Link
                        href={`/provider/${provider.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium transition-all duration-200 w-30"
                        style={{
                          backgroundColor: PALETTE.olive,
                          color: PALETTE.cream,
                        }}
                      >
                        {t("provider.cta")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Providers;
