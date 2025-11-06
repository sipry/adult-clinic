"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
import Link from "next/link";
import {
  useTranslation,
  ServiceTranslation,
} from "@/app/contexts/TranslationContext";

/* ---------------- Types & Icons ---------------- */
type IconKey =
  | "baby"
  | "brain"
  | "activity"
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
  href?: string;
};

const ICONS: Record<IconKey, IconCmp> = {
  baby: Baby,
  brain: Brain,
  activity: Activity,
  heart: Heart,
  clock: Clock,
  shield: Shield,
  syringe: Syringe,
  eye: Eye,
};

const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" },
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" },
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" },
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" },
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" },
  { base: "#E48C7A", back: "#D67463", text: "#001219" },
  { base: "#E57B76", back: "#D66A65", text: "#001219" },
  { base: "#DC767B", back: "#C85D61", text: "#001219" },
];

/* ---------------- Utils ---------------- */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const truncate = (text: string, maxLength: number) =>
  text && text.length > maxLength
    ? text.slice(0, maxLength).trim() + "..."
    : text;

/* ---------------- Component ---------------- */
const ServicesRail: React.FC<{ featuredKeys?: string[] }> = ({
  featuredKeys = ["preventive-medicine", "adult-immunizations"],
}) => {
  const { t, tArray } = useTranslation();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [cardW, setCardW] = useState(280);
  const [cardH, setCardH] = useState(320);
  const [gap, setGap] = useState(16);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- datos desde i18n ---
  const i18nServices = tArray<ServiceTranslation>("services.list");
  const ICON_BY_KEY: Partial<Record<string, IconKey>> = {
    "preventive-medicine": "shield",
    "adult-immunizations": "syringe",
    "minor-injury-treatment": "activity",
    "chronic-disease-management": "heart",
  };

  const baseServices: Service[] = i18nServices.map((s, idx) => {
    const id = (s.key || slugify(s.title || `svc-${idx}`)).toLowerCase();
    const icon = ICON_BY_KEY[id] ?? "heart";
    return {
      id,
      icon,
      title: s.title || `Service ${idx + 1}`,
      description: s.description || "",
      href: `/services?detail=${encodeURIComponent(id)}`,
    };
  });

  // mismo orden que tenías
  const ordered = useMemo(() => {
    const featured = baseServices.filter((s) => featuredKeys.includes(s.id));
    const others = baseServices.filter((s) => !featuredKeys.includes(s.id));
    const left: Service[] = [];
    const right: Service[] = [];
    others.forEach((s, i) => (i % 2 === 0 ? right : left).push(s));
    return [...left.reverse(), ...featured, ...right];
  }, [baseServices, featuredKeys]);

  const N = ordered.length;

  // cuántas copias tenemos renderizadas
  const [copies, setCopies] = useState(3); // empezamos con 3 bloques
  const items = useMemo(() => {
    // [ordered, ordered, ordered, ...]
    return Array.from({ length: copies }, (_, blockIdx) =>
      ordered.map((item, i) => ({
        ...item,
        __key: `${item.id}-${blockIdx}-${i}`,
      }))
    ).flat();
  }, [ordered, copies]);

  const recomputeDims = useCallback(() => {
    const w = railRef.current?.clientWidth ?? 0;
    if (w < 440) {
      setCardW(240);
      setGap(12);
      setCardH(260);
    } else if (w < 768) {
      setCardW(260);
      setGap(14);
      setCardH(280);
    } else if (w < 1024) {
      setCardW(280);
      setGap(16);
      setCardH(300);
    } else {
      setCardW(300);
      setGap(18);
      setCardH(320);
    }
  }, []);

  useEffect(() => {
    recomputeDims();
    window.addEventListener("resize", recomputeDims);
    return () => window.removeEventListener("resize", recomputeDims);
  }, [recomputeDims]);

  const snapSize = cardW + gap;

  // observamos el scroll para ir clonando más
  useEffect(() => {
    const el = railRef.current;
    if (!el || N === 0) return;

    const handleScroll = () => {
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - snapSize * 2;

      // si estamos cerca del final: agregamos otra copia
      if (nearEnd) {
        setCopies((c) => c + 1);
      }

      // índice lógico dentro de UN solo bloque
      const logicalPos = el.scrollLeft % (N * snapSize);
      const logicalIndex = Math.round(logicalPos / snapSize) % N;
      setActiveIndex((logicalIndex + N) % N);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [N, snapSize]);

  const scrollByOne = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({
      left: el.scrollLeft + dir * snapSize,
      behavior: "smooth",
    });
  };

  const scrollToLogical = (i: number) => {
    const el = railRef.current;
    if (!el || N === 0) return;
    // tomamos en qué bloque estoy (entero)
    const block = Math.floor(el.scrollLeft / (N * snapSize));
    const base = block * N * snapSize;
    el.scrollTo({
      left: base + i * snapSize,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="services"
      className="relative py-12 md:py-20"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* HEADER */}
      <div className="mb-4 md:mb-6 max-w-7xl mx-auto px-6">
        <div className="space-y-3 md:flex md:items-end md:justify-between md:gap-4">
          <div>
            <p
              className="text-[11px] font-semibold tracking-[0.28em]"
              style={{ color: "#0A9396" }}
            >
              {t("services.pretitle")}
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#001219]">
              {t("services.title")}
            </h2>
            <p className="mt-3 text-base md:text-lg text-[#005F73]">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center rounded-md px-10 py-3 text-sm font-semibold text-white shadow-sm hover:scale-105 transition-transform"
              style={{ backgroundColor: "#BB3E03" }}
            >
              {t("service.seeAll.button") || "See all services"}
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollByOne(-1)}
                className="inline-flex px-10 py-3 items-center justify-center rounded-md shadow-sm border border-[#CA6702]/30"
                style={{ color: "#001219" }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollByOne(1)}
                className="inline-flex px-10 py-3 items-center justify-center rounded-md shadow-sm border border-[#CA6702]/30"
                style={{ color: "#001219" }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RAIL */}
      <div className="relative">
        <div
          ref={railRef}
          className="scrollbar-none overflow-x-auto overflow-y-hidden py-10 snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
            paddingInline: gap / 2,
          }}
        >
          <ul className="flex items-stretch" style={{ gap }}>
            {items.map((s, i) => {
              const Icon = ICONS[s.icon];
              const color = PALETTE[i % PALETTE.length];
              return (
                <li
                  key={s.__key}
                  className="snap-start"
                  style={{ minWidth: cardW, maxWidth: cardW }}
                >
                  <div className="group h-full w-full [perspective:1200px]">
                    <article
                      className="relative w-full h-full rounded-2xl shadow-md [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]"
                      style={{ height: cardH }}
                    >
                      {/* cara frontal */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-2xl text-center [backface-visibility:hidden]"
                        style={{ backgroundColor: color.base, color: color.text }}
                      >
                        <div
                          className="mb-4 flex items-center justify-center rounded-full"
                          style={{
                            width: "64px",
                            height: "64px",
                            backgroundColor: "rgba(255,255,255,0.18)",
                          }}
                        >
                          <Icon className="w-7 h-7" style={{ color: color.text }} />
                        </div>

                        <h3 className="text-lg md:text-xl font-bold mb-2">{s.title}</h3>
                        <p className="text-sm md:text-base opacity-90 line-clamp-3">
                          {s.description}
                        </p>
                      </div>

                      {/* cara trasera */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]"
                        style={{ backgroundColor: color.back, color: color.text }}
                      >
                        <h4 className="text-lg md:text-xl font-semibold mb-3">
                          {s.title}
                        </h4>
                        <p className="text-sm md:text-base text-center opacity-90 mb-4">
                          {truncate(s.description, 120)}
                        </p>
                        <Link
                          href={s.href || "#"}
                          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition-transform"
                          style={{ color: color.text }}
                        >
                          {t("services.details") || "View Details"}
                        </Link>
                      </div>
                    </article>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* dots */}
        <div className="mt-4 w-full flex justify-center">
          <div className="flex items-center gap-2">
            {ordered.map((_, i) => {
              const isActive = i === activeIndex;
              const color = PALETTE[i % PALETTE.length];
              return (
                <button
                  key={i}
                  onClick={() => scrollToLogical(i)}
                  aria-label={`Go to card ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive ? "w-6" : "w-2.5"
                  }`}
                  style={{
                    backgroundColor: isActive ? color.base : "#D9D9D9",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ServicesRail;
