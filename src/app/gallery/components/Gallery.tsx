"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";

/* 👇 Ajusta las rutas según tu proyecto */
import oficina1 from "@/../public/assets/images/oficina-1.jpg";
import oficina2 from "@/../public/assets/images/oficina-2.jpg";
import oficina3 from "@/../public/assets/images/oficina-3.jpg";
import oficina4 from "@/../public/assets/images/oficina-4.jpg";
import oficina5 from "@/../public/assets/images/oficina-5.jpg";
import oficina6 from "@/../public/assets/images/oficina-6.jpg";

/* 🎨 Paleta pastel (misma que services) */
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

type Category = "Instalaciones";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: Category;
};

const toSrc = (img: StaticImageData) => img?.src ?? "";

const ITEMS: GalleryItem[] = [
  { id: "g1", src: toSrc(oficina1), alt: "Recepción", category: "Instalaciones" },
  { id: "g2", src: toSrc(oficina2), alt: "Recepción", category: "Instalaciones" },
  { id: "g3", src: toSrc(oficina3), alt: "Corte de cinta - equipo", category: "Instalaciones" },
  { id: "g4", src: toSrc(oficina4), alt: "Box de atención", category: "Instalaciones" },
  { id: "g5", src: toSrc(oficina5), alt: "Corte de cinta - invitados", category: "Instalaciones" },
  { id: "g6", src: toSrc(oficina6), alt: "Corte de cinta - equipo", category: "Instalaciones" },
];

export default function Gallery({
  title = "Galería",
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const [active, setActive] = useState<"Todas" | Category>("Todas");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // categorías
  const categories = useMemo<("Todas" | Category)[]>(() => {
    const set = new Set<Category>(ITEMS.map((g) => g.category));
    return ["Todas", ...Array.from(set)];
  }, []);

  // lista filtrada
  const filtered = useMemo(
    () => (active === "Todas" ? ITEMS : ITEMS.filter((g) => g.category === active)),
    [active]
  );

  // si cambia el filtro y el index quedó fuera, lo reseteo
  useEffect(() => {
    if (index >= filtered.length) setIndex(0);
  }, [filtered.length, index]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };

  const prev = () => setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const next = () => setIndex((i) => (i + 1) % filtered.length);

  // teclado en modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered.length]);

  const current = filtered[index];

  return (
    <section
      style={{ backgroundColor: "#FFFFFF" }}
      className="pt-40 pb-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{ color: "#001219" }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-lg" style={{ color: "#275E71" }}>
              {subtitle}
            </p>
          ) : null}
        </header>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categories.map((c, i) => {
            const isActive = active === c;
            const color = PALETTE[i % PALETTE.length];
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset transition-colors"
                style={{
                  backgroundColor: isActive ? color.base : "rgba(154, 218, 216, 0.12)",
                  color: isActive ? color.text : "#001219",
                  borderColor: isActive ? color.back : "transparent",
                }}
                aria-pressed={isActive}
              >
                {c}
              </button>
            );
          })}
          <span className="ml-2 text-sm" style={{ color: "#00121999" }}>
            {filtered.length} fotos
          </span>
        </div>

        {/* Masonry */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <figure
              key={item.id}
              className="mb-4 break-inside-avoid rounded-2xl p-2 transition-transform hover:scale-[1.01]"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid rgba(0,18,25,0.06)`,
              }}
            >
              <button
                className="group block w-full overflow-hidden rounded-xl"
                onClick={() => openAt(i)}
                aria-label={`Abrir imagen ${i + 1}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && current && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          style={{ backgroundColor: "rgba(0,18,25,0.92)" }} // dark de la paleta global
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="fixed z-[60] rounded-full p-3 md:p-3.5 text-white backdrop-blur-md transition hover:scale-105 focus:outline-none focus-visible:ring-2"
            aria-label="Cerrar"
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              top: "max(0.75rem, env(safe-area-inset-top))",
              right: "max(0.75rem, env(safe-area-inset-right))",
            }}
          >
            <X className="h-6 w-6 md:h-7 md:w-7" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="fixed left-2 sm:left-4 md:left-6 top-1/2 z-[60] -translate-y-1/2 rounded-full p-3 md:p-3.5 text-white backdrop-blur-md transition hover:scale-105 focus:outline-none"
            aria-label="Anterior"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="fixed right-2 sm:right-4 md:right-6 top-1/2 z-[60] -translate-y-1/2 rounded-full p-3 md:p-3.5 text-white backdrop-blur-md transition hover:scale-105 focus:outline-none"
            aria-label="Siguiente"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            <ChevronRight className="h-7 w-7 md:h-8 md:w-8" />
          </button>

          {/* Imagen */}
          <div className="relative z-50 max-h-[90vh] w-full max-w-6xl">
            <img
              src={current.src}
              alt={current.alt}
              className="mx-auto max-h-[90vh] w-auto max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
