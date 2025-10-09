"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Baby,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Shield,
  Syringe,
  Eye,
} from "lucide-react";
import { useTranslation, ServiceTranslation } from "@/app/contexts/TranslationContext";

/* ---------- Decorative SVGs ---------- */
import wave from "@/../public/assets/svg/wave.svg";
import stars from "@/../public/assets/svg/stars.svg";
import Link from "next/link";

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

/* ---------- Types ---------- */
type IconKey =
  | "baby"
  | "brain"
  | "activity"
  | "chevronLeft"
  | "chevronRight"
  | "heart"
  | "clock"
  | "shield"
  | "syringe"
  | "eye";

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Service = {
  id: string;
  icon: IconKey;
  title: string;
  description: string;
  cta: string;
  href?: string;
  more?: string;
  image?: string;
};

/* ---------- Icon mapping ---------- */
const ICONS: Record<IconKey, IconCmp> = {
  baby: Baby,
  brain: Brain,
  activity: Activity,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  heart: Heart,
  clock: Clock,
  shield: Shield,
  syringe: Syringe,
  eye: Eye,
};

/* ---------- Icon color palette ---------- */
const ICON_COLORS = ["#ed624f", "#faea9b", "#cbe3c7", "#9cd3f6", "#f5c284"] as const;

/* --- Color helpers --- */
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
};

const withAlpha = (hex: string, alpha = 0.85) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getReadableTextColor = (hex: string, alpha = 0.85) => {
  const { r, g, b } = hexToRgb(hex);
  const R = Math.round(r * alpha + 255 * (1 - alpha));
  const G = Math.round(g * alpha + 255 * (1 - alpha));
  const B = Math.round(b * alpha + 255 * (1 - alpha));
  const luminance = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
  return luminance > 0.6 ? "#1f2937" : "#ffffff";
};

const iconTextColor = (hex: string) => {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#1f2937" : "#ffffff";
};

const getIconColor = (index: number) => {
  const n = ICON_COLORS.length;
  const c = ICON_COLORS[index % n];
  const prev = ICON_COLORS[(index - 1 + n) % n];
  return c === prev ? ICON_COLORS[(index + 1) % n] : c;
};

/* ---------- Helpers ---------- */
function getOffset(i: number, active: number, len: number) {
  const diff = (i - active + len) % len;
  if (diff === 0) return 0;
  if (diff === 1) return 1;
  if (diff === len - 1) return -1;
  return -2;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ---------- Component ---------- */
const ServicesShowcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapW, setWrapW] = useState(0);
  const [isLg, setIsLg] = useState(false);

  const { t, tArray } = useTranslation();

  // ----- AUTOPLAY -----
  const AUTOPLAY_MS = 4000;
  const intervalRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const startAutoplay = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (pausedRef.current || reducedMotionRef.current) return;
    intervalRef.current = window.setInterval(() => {
      if (!pausedRef.current && document.visibilityState === "visible") {
        setActive((i) => i + 1);
      }
    }, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pause = () => {
    pausedRef.current = true;
    stopAutoplay();
  };

  const resume = () => {
    pausedRef.current = false;
    startAutoplay();
  };

  useEffect(() => {
    const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = !!mqlReduce.matches;

    const onChangeReduce = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) stopAutoplay();
      else startAutoplay();
    };
    mqlReduce.addEventListener?.("change", onChangeReduce);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stopAutoplay();
      else startAutoplay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopAutoplay();
      document.removeEventListener("visibilitychange", onVisibility);
      mqlReduce.removeEventListener?.("change", onChangeReduce);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeIndex = (i: number, len: number) => ((i % len) + len) % len;

  /* -------------------- Dynamic services from i18n -------------------- */
  const i18nServices = tArray<ServiceTranslation>("services.list");

  const ICON_BY_KEY: Partial<Record<string, IconKey>> = {
    well: "baby",
    "well-visit": "baby",
    sick: "clock",
    "sick-visit": "clock",
    followup: "clock",
    "follow-up": "clock",
    immunizations: "syringe",
    "food-allergy": "activity",
    "food-allergy-test": "activity",
    "environmental-allergy": "activity",
    "environmental-allergy-test": "activity",
    vision: "eye",
    "vision-screening": "eye",
    audiology: "activity",
    "audiology-screening": "activity",
    obesity: "eye",
    "obesity-care-plan": "eye",
    asthma: "activity",
    "asthma-care-plan": "activity",
    adhd: "brain",
    "adhd-care-plan": "brain",
    adolescent: "heart",
    urgent: "clock",
    physical: "shield",
    covid: "syringe",
  };

  const servicesFromI18n: Service[] = i18nServices.map((s, idx) => {
    // Aseguramos que el id coincida con AllServices:
    const id = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
    const icon = ICON_BY_KEY[id] ?? "heart";
    return {
      id,
      icon,
      title: s.title || `Service ${idx + 1}`,
      description: s.description || "",
      cta: t("services.details") || "View Details",
      // opcional: dejamos href apuntando ya al detalle
      href: `/services?detail=${encodeURIComponent(id)}`,
      more: s.description || "",
    };
  });

  const services: Service[] = servicesFromI18n;

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => {
      setWrapW(wrapRef.current?.clientWidth ?? 0);
      setIsLg(mql.matches);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    mql.addEventListener?.("change", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mql.removeEventListener?.("change", handleResize);
    };
  }, []);

  const peek = isLg ? 150 : 0;
  const RIGHT_X = useMemo(() => Math.max(0, wrapW - peek + 24), [wrapW, peek]);
  const LEFT_X = useMemo(
    () => -Math.max(140, Math.round((wrapW - peek) * 0.45)),
    [wrapW, peek]
  );

  const go = (dir: 1 | -1) => {
    setActive((i) => i + dir);
    stopAutoplay();
    startAutoplay();
  };

  const activeSafe = normalizeIndex(active, services.length);
  const sectionRef = useRef<HTMLElement>(null);

  /* ---------- SWIPE & TAP STATE ---------- */
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const tapWithinCardRef = useRef(false);
  const startTargetRef = useRef<EventTarget | null>(null);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const THRESHOLD_PX = 60;
  const MAX_DRAG_PX = 140;
  const MIN_VELOCITY = 0.35;
  const TAP_MAX_MOVE = 8;

  useEffect(() => {
    setFlipped(false);
  }, [activeSafe]);

  const isInteractive = (el: Element | null) => {
    if (!el) return false;
    return !!el.closest(
      'a,button,input,textarea,select,summary,[role="button"],[role="link"]'
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button && e.button !== 0) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startTRef.current = performance.now();
    startTargetRef.current = e.target;

    const rect = activeCardRef.current?.getBoundingClientRect();
    tapWithinCardRef.current = !!(
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );

    setDragging(false);
    setDragX(0);
    pausedRef.current = true;
    stopAutoplay();
    pointerIdRef.current = e.pointerId;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (!dragging) {
      if (Math.abs(dx) > TAP_MAX_MOVE && Math.abs(dx) > Math.abs(dy)) {
        setDragging(true);
        try {
          (e.target as Element).setPointerCapture?.(pointerIdRef.current);
        } catch {}
      } else {
        return;
      }
    }

    const clamped = Math.max(-MAX_DRAG_PX, Math.min(MAX_DRAG_PX, dx));
    setDragX(clamped);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === null) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const dt = Math.max(1, performance.now() - startTRef.current);
    const v = absDx / dt;

    const isTap = absDx < TAP_MAX_MOVE && absDy < TAP_MAX_MOVE;

    if (isTap && tapWithinCardRef.current && !isInteractive(startTargetRef.current as Element)) {
      setFlipped((f) => !f);
      setDragX(0);
      setDragging(false);
      startAutoplay();
      pointerIdRef.current = null;
      tapWithinCardRef.current = false;
      return;
    }

    const shouldSwitch = Math.abs(dx) > THRESHOLD_PX || v > MIN_VELOCITY;
    if (dragging && shouldSwitch) {
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      setDragX(0);
      setDragging(false);
      go(dir);
    } else {
      setDragX(0);
      setDragging(false);
      startAutoplay();
    }
    pointerIdRef.current = null;
    tapWithinCardRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 md:py-28 bg-white overflow-hidden scroll-mt-20"
    >
      {/* --- Background decor (left) --- */}
      <img
        src={stars.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-13 -top-6 block w-[350px] z-0 opacity-60"
      />
      <img
        src={wave.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-1 lg:block w-full opacity-20 rotate-180"
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left column */}
        <div className="max-w-xl lg:self-center mx-auto text-center lg:text-left">
          <Reveal y={8} delay={0}>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-sky-900 uppercase mb-3">
              {t("services.pretitle")}
            </p>
          </Reveal>

          <Reveal y={12} delay={70}>
            <h2 className="text-4xl md:text-5xl mt-3 tracking-[-0.02em] leading-[1.05] text-slate-900 text-[clamp(36px,6.2vw,64px)] font-extrabold">
              {t("services.title")}
            </h2>
          </Reveal>

          <Reveal y={14} delay={130}>
            <p className="mt-4 text-slate-600 text-lg">{t("services.subtitle")}</p>
          </Reveal>

          {/* Arrows + CTA */}
          <Reveal y={10} delay={260}>
            <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Anterior"
                className="inline-flex h-10 w-20 lg:w-30 items-center justify-center rounded-sm bg-fuchsia-100 text-slate-800 shadow-sm hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Siguiente"
                className="inline-flex h-10 w-20 lg:w-30 items-center justify-center rounded-sm bg-fuchsia-100 text-slate-800 shadow-sm hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <Link
                href="/services"
                className="ml-1 h-10 inline-flex items-center gap-2 rounded-sm bg-fuchsia-900 px-4 py-2.5 text-xs md:text-sm font-semibold text-white shadow-sm hover:scale-105 whitespace-nowrap"
              >
                {t("service.seeAll.button") || "See all our Services"}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right column: cards */}
        <div
          className="relative svc-wrap"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <Reveal y={16} delay={80}>
            <div
              ref={wrapRef}
              className="svc-peek relative"
              style={{
                minHeight: "var(--card-h)",
                touchAction: "pan-y",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {services.map((s, i) => {
                const off = getOffset(i, activeSafe, services.length);
                const x =
                  off === 0 ? 0 : off === 1 ? RIGHT_X : off === -1 ? LEFT_X : LEFT_X - 80;

                const scale = isLg
                  ? off === 0
                    ? 1
                    : off === 1
                    ? 0.985
                    : 0.92
                  : 1;

                const opacity = off === 0 ? 1 : isLg ? (off === 1 ? 0.7 : 0) : 0;
                const zIndex = off === 0 ? 30 : off === 1 ? 20 : 10;
                const isCenter = off === 0;
                const Icon = ICONS[s.icon];
                const mountDelay = 120 + i * 60;

                const tx = isCenter ? x + dragX : x;

                // --- Colores del ícono y reverso ---
                const baseHex = getIconColor(i);
                const alpha = isCenter ? 0.9 : 0.25;
                const iconBg = withAlpha(baseHex, alpha);
                const iconFg = getReadableTextColor(baseHex, alpha);

                const backBg = baseHex;
                const backFg = iconTextColor(baseHex);
                const btnBg =
                  backFg === "#ffffff" ? "rgba(255,255,255,0.96)" : "rgba(0,0,0,0.82)";
                const btnText = backFg === "#ffffff" ? "#111827" : "#ffffff";
                const btnHoverBg =
                  backFg === "#ffffff" ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.74)";

                // href hacia el panel del servicio:
                const detailsHref = `/services?detail=${encodeURIComponent(s.id)}`;

                return (
                  <Reveal key={s.id} y={10} delay={mountDelay} duration={520}>
                    <div
                      ref={isCenter ? activeCardRef : undefined}
                      className="absolute top-0 left-0 will-change-transform"
                      style={{
                        width: "calc(100% - var(--peek))",
                        height: "var(--card-h)",
                        transform: `translateX(${tx}px) scale(${scale})`,
                        opacity,
                        zIndex,
                        transition: "none",
                        pointerEvents: isCenter ? "auto" : "none",
                      }}
                      aria-hidden={!isCenter}
                    >
                      <div className="group h-full w-full [perspective:1200px]">
                        <article
                          className={[
                            "relative h-full w-full rounded-[28px]",
                            "ring-1 ring-slate-200 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)]",
                            "transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] transform-gpu",
                            "[transform-style:preserve-3d]",
                            "group-hover:[transform:rotateY(180deg)]",
                            "focus-within:[transform:rotateY(180deg)]",
                            "bg-white text-slate-900",
                            dragging && isCenter ? "cursor-grabbing" : "cursor-grab",
                          ].join(" ")}
                          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (!isCenter) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFlipped((f) => !f);
                            }
                          }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center text-center p-8 md:p-10">
                            <div
                              className={[
                                "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20",
                                "rounded-full grid place-items-center mb-4 md:mb-6 shadow-lg",
                              ].join(" ")}
                              style={{
                                backgroundColor: iconBg,
                                color: iconFg,
                                boxShadow: `0 12px 24px -8px ${withAlpha(baseHex, 0.35)}`,
                                border: `1px solid ${withAlpha(baseHex, 0.35)}`,
                              }}
                            >
                              <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                            <p className="text-lg leading-relaxed text-slate-600 mb-6 max-w-[28ch]">
                              {(s.description || "").slice(0, 50)}...
                            </p>
                            <Link
                              href={detailsHref}
                              className="inline-flex items-center text-sky-900 font-medium hover:underline"
                            >
                              {t("services.details") || "View Details"}
                              <ChevronRight className="ml-1 mt-1 h-4 w-4" />
                            </Link>
                          </div>

                          {/* Back */}
                          <div
                            className="absolute inset-0 rounded-[28px] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden"
                            style={{
                              backgroundColor: backBg,
                              backgroundImage:
                                "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.12), transparent 60%)",
                            }}
                          >
                            <div
                              className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-8 md:px-10"
                              style={{ color: backFg }}
                            >
                              <h4 className="font-extrabold text-2xl leading-tight mb-4">
                                {s.title}
                              </h4>
                              <p
                                className="text-lg leading-relaxed max-w-[30ch] mb-6"
                                style={{ color: backFg === "#ffffff" ? "rgba(255,255,255,0.92)" : "rgba(31,41,55,0.88)" }}
                              >
                                {s.description?.replace(/\s+/g, " ").slice(0, 160)}
                                {(s.description?.length ?? 0) > 160 ? "..." : ""}
                              </p>
                              <Link
                                href={detailsHref}
                                className="inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline-none hover:scale-105"
                                style={{
                                  backgroundColor: btnBg,
                                  color: btnText,
                                  boxShadow:
                                    backFg === "#ffffff"
                                      ? "0 10px 22px -12px rgba(0,0,0,0.35)"
                                      : "0 10px 22px -12px rgba(0,0,0,0.45)",
                                  border:
                                    backFg === "#ffffff"
                                      ? "1px solid rgba(255,255,255,0.55)"
                                      : "1px solid rgba(0,0,0,0.28)",
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnHoverBg;
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnBg;
                                }}
                              >
                                {t("services.details") || "View Details"}
                              </Link>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>

          {/* Pager dots */}
          <Reveal y={10} delay={120}>
            <div className="mt-4 w-[calc(100%-var(--peek))]">
              <div className="flex justify-center gap-2">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActive(i);
                      stopAutoplay();
                      startAutoplay();
                    }}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      normalizeIndex(i, services.length) === activeSafe
                        ? "w-6 bg-sky-900"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400",
                    ].join(" ")}
                    aria-label={`Ir a ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CSS vars */}
      <style>{`
        .svc-wrap { --peek: 0px; --card-h: 340px; }
        @media (max-width: 1023.98px) {
          .svc-peek { margin-left: -12px; width: calc(100% + 24px); }
        }
        @media (min-width: 1024px) {
          .svc-wrap { --peek: 150px; --card-h: 380px; }
          .svc-peek { margin-left: 0; width: auto; }
        }
      `}</style>
    </section>
  );
};

export default ServicesShowcase;

/* ----------------------- Reveal component ----------------------- */
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
