"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";
import InsuranceModal from "./InsuranceModal";

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

/* ---------- Utils: motion ---------- */
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

/* ---------- Animación Reveal ---------- */
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

/* ---------- Componente Principal ---------- */
const CompactMedicalPlans: React.FC = () => {
  const { t } = useTranslation();
  const [insuranceOpen, setInsuranceOpen] = useState(false);

  return (
    <>
      <style jsx>{`
        .marquee-viewport {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .marquee-viewport {
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 3rem,
              black calc(100% - 3rem),
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 3rem,
              black calc(100% - 3rem),
              transparent 100%
            );
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: scroll-x 25s linear infinite reverse;
        }
        @keyframes scroll-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <section
        id="insurance"
        className="scroll-mt-28 py-16 md:py-20 overflow-x-clip"
        style={{
          backgroundColor: PALETTE.cream,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Izquierda */}
            <div className="min-w-0 text-center lg:text-left">
              <Reveal y={8}>
                <h2
                  className="text-xl md:text-4xl font-bold mb-2"
                  style={{ color: PALETTE.dark }}
                >
                  {t("insurance.title")}
                </h2>
              </Reveal>
              <Reveal y={12} delay={80}>
                <p
                  className="text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ color: PALETTE.olive }}
                >
                  {t("insurance.subtitle")}
                </p>
              </Reveal>
            </div>

            {/* Derecha */}
            <div className="relative flex flex-col items-center min-w-0">
              <Reveal y={0} x={0} delay={60} className="w-full">
                <div className="marquee-viewport w-full py-4 min-h-[40px] flex items-center overflow-x-hidden">
                  <div className="marquee-track items-center gap-x-12 opacity-80">
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="flex items-center gap-x-12">
                        {["Aetna", "BlueCross", "Humana", "Cigna", "UnitedHealthcare"].map((name) => (
                          <span
                            key={name}
                            className="text-sm font-semibold"
                            style={{ color: PALETTE.moss }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal y={14} delay={140}>
                <button
                  onClick={() => setInsuranceOpen(true)}
                  className="mt-2 font-semibold px-10 py-3 md:px-16 rounded-lg transition-all inline-flex items-center gap-2 text-sm hover:scale-105"
                  style={{
                    backgroundColor: PALETTE.olive,
                    color: PALETTE.cream,
                    boxShadow: `0 4px 10px ${PALETTE.dark}33`,
                  }}
                >
                  <Search className="w-4 h-4" />
                  <span>{t("insurance.search")}</span>
                </button>
              </Reveal>
            </div>
          </div>
        </div>

        <InsuranceModal
          open={insuranceOpen}
          onClose={() => setInsuranceOpen(false)}
        />
      </section>
    </>
  );
};

export default CompactMedicalPlans;
