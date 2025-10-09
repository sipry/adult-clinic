// app/galeria/components/Gallery.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";

/* 👇 Ajusta las rutas según tu proyecto */
import oficina1 from "@/../public/assets/images/oficina-1.jpg";
import oficina3 from "@/../public/assets/images/oficina-3.jpg";
import oficina4 from "@/../public/assets/images/oficina-4.jpg";
import oficina5 from "@/../public/assets/images/oficina-5.jpg";

type Category = "Instalaciones" | "Corte de cinta";
type GalleryItem = { id: string; src: string; alt: string; category: Category };

const toSrc = (img: StaticImageData) => img?.src ?? "";

const ITEMS: GalleryItem[] = [
  { id: "g1", src: toSrc(oficina1), alt: "Recepción", category: "Instalaciones" },
  { id: "g3", src: toSrc(oficina3), alt: "Corte de cinta - equipo", category: "Corte de cinta" },
  { id: "g4", src: toSrc(oficina4), alt: "Box de atención", category: "Instalaciones" },
  { id: "g5", src: toSrc(oficina5), alt: "Corte de cinta - invitados", category: "Corte de cinta" },
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

  const categories = useMemo<("Todas" | Category)[]>(() => {
    const set = new Set<Category>(ITEMS.map((g) => g.category));
    return ["Todas", ...Array.from(set)];
  }, []);

  const filtered = useMemo(
    () => (active === "Todas" ? ITEMS : ITEMS.filter((g) => g.category === active)),
    [active]
  );

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
    <section className="pt-40 pb-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Título */}
        <header className="mb-6">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-2 text-lg text-gray-600">{subtitle}</p> : null}
        </header>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={[
                  "rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset transition-colors",
                  isActive
                    ? "bg-sky-900 text-white ring-sky-900"
                    : "bg-sky-50 text-sky-900 ring-sky-200 hover:bg-sky-100",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {c}
              </button>
            );
          })}
          <span className="ml-2 text-sm text-gray-500">{filtered.length} fotos</span>
        </div>

        {/* Masonry */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <figure
              key={item.id}
              className="mb-4 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-shadow hover:shadow"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 md:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Controles FIJOS al viewport (no dependen del tamaño de la imagen) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="fixed z-[60] rounded-full bg-white/15 p-3 md:p-3.5 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar"
            style={{
              // respeta notch/safe-area
              top: "max(0.75rem, env(safe-area-inset-top))",
              right: "max(0.75rem, env(safe-area-inset-right))",
            }}
          >
            <X className="h-6 w-6 md:h-7 md:w-7" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="fixed left-2 sm:left-4 md:left-6 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-white/15 p-3 md:p-3.5 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="fixed right-2 sm:right-4 md:right-6 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-white/15 p-3 md:p-3.5 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-7 w-7 md:h-8 md:w-8" />
          </button>

          {/* Imagen centrada y responsiva */}
          <div className="relative z-50 max-h-[90vh] w-full max-w-6xl">
            {/* Scrim suave arriba/abajo para contraste de los controles en móviles */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

            <img
              src={current.src}
              alt={current.alt}
              className="mx-auto max-h-[90vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
