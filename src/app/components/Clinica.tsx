"use client";

import React from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

import oficina1 from "@/../public/assets/images/oficina-1.webp";
import oficina2 from "@/../public/assets/images/oficina-2.webp";
import oficina3 from "@/../public/assets/images/oficina-3.webp";
import oficina4 from "@/../public/assets/images/oficina-4.webp";
import oficina5 from "@/../public/assets/images/oficina-5.webp";
import oficina6 from "@/../public/assets/images/oficina-6.webp";
import oficina7 from "@/../public/assets/images/oficina-7.webp";

import { PALETTE, BRAND, getPaletteColor } from "@/app/ui/palette"; // 👈 misma paleta

/* -------------------- Datos -------------------- */
const defaultImages = [
  { alt: "Consultorio", src: oficina1.src },
  { alt: "Consultorio", src: oficina2.src },
  { alt: "Consultorio", src: oficina3.src },
  { alt: "Consultorio", src: oficina4.src },
  { alt: "Consultorio", src: oficina5.src },
  { alt: "Fachada exterior", src: oficina6.src },
  { alt: "Consultorio", src: oficina7.src },
];

/* -------------------- Utils motion / reveal -------------------- */
function usePrefersReducedMotion() {
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
) {
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
        (ents) => ents.forEach((e) => setInView(e.isIntersecting || e.intersectionRatio > 0)),
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
    <div ref={ref} className={className} style={style} aria-hidden={!shown}>
      {children}
    </div>
  );
};

/* -------------------- Componente -------------------- */
export default function SeccionOficinaPediatra({
  images = defaultImages,
  withFades = false,
}: {
  subtitle?: string;
  images?: { src: string; alt: string }[];
  withFades?: boolean;
}) {
  const { t } = useTranslation();
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const baseStripRef = React.useRef<HTMLUListElement | null>(null);

  const REPEAT = 7;
  const MID = Math.floor(REPEAT / 2);

  const [stripW, setStripW] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [noSnap, setNoSnap] = React.useState(false);

  // 👇 nuevo estado para la galería modal
  const [openGallery, setOpenGallery] = React.useState(false);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  const measure = React.useCallback(() => {
    const ul = baseStripRef.current;
    if (!ul) return;
    const w = Math.ceil(ul.scrollWidth);
    setStripW(w);
    const firstCard = ul.querySelector<HTMLElement>(".card");
    const cardW = firstCard?.getBoundingClientRect().width ?? 0;
    const cs = getComputedStyle(ul);
    const gap = parseFloat(cs.columnGap || "0") || parseFloat(cs.gap || "0") || 16;
    setStep(cardW + gap);
  }, []);

  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (baseStripRef.current) ro.observe(baseStripRef.current);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  React.useEffect(() => {
    const scroller = wrapRef.current;
    if (!scroller || !stripW) return;
    jumpTo(scroller, stripW * MID);
  }, [stripW]);

  const jumpTo = (el: HTMLDivElement, left: number) => {
    setNoSnap(true);
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = left;
    requestAnimationFrame(() => {
      el.style.scrollBehavior = prev || "";
      setNoSnap(false);
    });
  };

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || !stripW) return;
    let raf = 0;
    const nearLeft = stripW * 0.5;
    const nearRight = stripW * (REPEAT - 1.5);
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = el.scrollLeft;
        if (x < nearLeft) {
          jumpTo(el, x + stripW * MID);
        } else if (x > nearRight) {
          jumpTo(el, x - stripW * MID);
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [stripW]);

  const scrollOne = (dir: -1 | 1) => {
    const el = wrapRef.current;
    if (!el || !step) return;
    const x = el.scrollLeft;
    const target = Math.round((x + dir * step) / step) * step;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const headerAccent = BRAND.accent;
  const titleColor = BRAND.text;
  const bgColor = BRAND.bg;

  // helpers para galería
  const openGalleryAt = (i: number) => {
    setGalleryIndex(i);
    setOpenGallery(true);
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "hidden";
    }
  };

  const closeGallery = () => {
    setOpenGallery(false);
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "";
    }
  };

  const prevImg = () => {
    setGalleryIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImg = () => {
    setGalleryIndex((i) => (i + 1) % images.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <section
        id="gallery"
        className="relative z-10 pt-24 pb-10 scroll-mt-10"
        aria-label="Oficina física"
      >
        <div className="text-center mb-6 mx-auto max-w-7xl lg:px-8 px-4 sm:px-6">
          <Reveal y={8} delay={0}>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: headerAccent }}
            >
              {t("clinic.pretitle")}
            </p>
          </Reveal>
          <Reveal y={12} delay={70}>
            <h2
              className="mt-6 mb-6 text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: titleColor }}
            >
              {t("clinic.title")}
            </h2>
          </Reveal>

          <Reveal y={14} delay={140}>
            <div
              className="
      mt-3 mb-10
      flex flex-col items-center gap-3
      sm:flex-row sm:flex-wrap sm:justify-center
    "
            >
              {/* Botón principal: View Gallery */}
              <button
                type="button"
                onClick={() => openGalleryAt(0)}
                className="font-semibold px-10 py-3 md:px-16 rounded-md transition-all inline-flex items-center gap-2 text-sm hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: PALETTE[0].base,
                  color: BRAND.text,
                  border: `1px solid ${PALETTE[0].back}`,
                }}
              >
                <span>{t("clinic.cta")}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Contenedor de flechas */}
              <div className="flex gap-2 w-full justify-center sm:w-auto">
                {/* Prev */}
                <button
                  type="button"
                  onClick={() => scrollOne(-1)}
                  aria-label="Foto anterior"
                  className="font-semibold px-10 py-3 md:px-10 rounded-md transition-all inline-flex items-center gap-2 text-sm hover:scale-105 border shadow-sm"
                  style={{
                    backgroundColor: BRAND.accent,
                    color: BRAND.text,
                    border: `1px solid ${BRAND.accent}`,
                  }}
                >
                  <ChevronLeft className="w-4 h-5" />
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={() => scrollOne(1)}
                  aria-label="Foto siguiente"
                  className="font-semibold px-10 py-3 md:px-10 rounded-md transition-all inline-flex items-center gap-2 text-sm hover:scale-105 border shadow-sm"
                  style={{
                    backgroundColor: BRAND.accent,
                    color: BRAND.text,
                    border: `1px solid ${BRAND.accent}`,
                  }}
                >
                  <ChevronRight className="w-4 h-5" />
                </button>
              </div>
            </div>
          </Reveal>

        </div>

        <Reveal y={16} delay={100}>
          <div
            ref={wrapRef}
            id="gallery-scroller"
            className={`marquee-wrap ${withFades ? "with-fades" : ""} ${noSnap ? "no-snap" : ""
              } relative rounded-3xl`}
            role="region"
            aria-label="Galería de fotos infinita"
            tabIndex={0}
          >
            {/* tira oculta para medir */}
            <ul ref={baseStripRef} className="strip measure-only" aria-hidden="true">
              {images.map((img, i) => (
                <li key={`base-${i}`} className="card">
                  <figure className="card-frame">
                    <img src={img.src} alt="" loading="lazy" decoding="async" className="card-img" />
                  </figure>
                </li>
              ))}
            </ul>

            <div className="repeat-row" aria-label="Fotos">
              {Array.from({ length: REPEAT }).map((_, r) => (
                <ul key={`rep-${r}`} className="strip">
                  {images.map((img, i) => {
                    const color = getPaletteColor(i);
                    return (
                      <li key={`rep-${r}-${i}`} className="card">
                        <figure className="card-frame">
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            decoding="async"
                            className="card-img"
                            onClick={() => openGalleryAt(i)}
                            style={{ cursor: "pointer" }}
                          />
                        </figure>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>

        <style>{`
          .marquee-wrap {
            --card-h: clamp(180px, 32vw, 320px);
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .marquee-wrap::-webkit-scrollbar { display: none; }
          .marquee-wrap.no-snap { scroll-snap-type: none !important; }
          .repeat-row { display: inline-flex; }
          .strip { display:flex; gap:16px; padding:16px; width: max-content; }
          .strip.measure-only { position:absolute; visibility:hidden; pointer-events:none; height:0; padding:0; margin:0; gap:16px; }
          .card { flex:0 0 auto; scroll-snap-align:start; }
          .card-frame {
            height: var(--card-h);
            aspect-ratio: 4 / 3;
            overflow: hidden;
            border-radius: 22px;
            background: white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            border: 2px solid rgba(226,232,240,0.8);
            display: grid;
            place-items: center;
          }
          .card-img { width: 100%; height: 100%; object-fit: cover; }
        `}</style>
      </section>

      {/* ------------ Modal / Galería --------------- */}
      {openGallery && images[galleryIndex] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeGallery();
          }}
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
            className="absolute top-4 right-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="max-h-[90vh] w-full max-w-5xl">
            <img
              src={images[galleryIndex].src}
              alt={images[galleryIndex].alt}
              className="mx-auto max-h-[90vh] w-auto max-w-full rounded-xl object-contain"
            />
        
          </div>
        </div>
      ) : null}
    </div>
  );
}
