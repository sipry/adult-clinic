import React from "react";

/**
 * Sección embebible para mostrar la OFICINA de una pediatra
 * - No es héroe; úsala en cualquier página como un bloque independiente.
 * - Estilo inspirado en el ejemplo (título arriba y tarjetas redondeadas).
 * - Incluye carrusel INFINITO auto‑desplazable, pausado al pasar el mouse.
 * - 100% Tailwind. No requiere configurar Tailwind para keyframes; se definen aquí.
 *
 * Personaliza:
 *  - Pasa tus fotos en la prop `images` (array de {src, alt}).
 *  - Ajusta la velocidad con `speedSeconds`.
 */

export default function SeccionOficinaPediatra({
  title = (
    <>
      Sonrisas en un lugar
      {" "}
      <span className="text-emerald-600">acogedor</span>
    </>
  ),
  subtitle = "Conoce nuestra oficina: luminosa, higiénica y pensada para bebés, niños y familias.",
  images = defaultImages,
  speedSeconds = 30,
}: {
  title?: React.ReactNode;
  subtitle?: string;
  images?: { src: string; alt: string }[];
  speedSeconds?: number;
}) {
  // Duplicamos el arreglo para un loop perfecto (50% -> 100%).
  const loopImages = [...images, ...images];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" aria-label="Oficina física de la pediatra">
      {/* Título */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium tracking-wide text-emerald-700">Nuestra oficina</p>
        <h2 className="mt-1 text-3xl sm:text-4xl font-bold leading-tight">{title}</h2>
        <p className="mt-3 text-slate-600 max-w-3xl mx-auto">{subtitle}</p>
      </div>

      {/* Carrusel infinito */}
      <div className="relative">
        {/* Fades laterales */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" aria-hidden="true" />

        <div className="overflow-hidden rounded-3xl ring-1 ring-slate-100 bg-white/60">
          <ul
            className="marquee flex gap-4 p-4" 
            style={{
             
              ["--speed"]: `${speedSeconds}s`,
            } as React.CSSProperties}
          >
            {loopImages.map((img, i) => (
              <li key={i} className="shrink-0">
                <figure className="w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px] overflow-hidden rounded-3xl ring-1 ring-slate-100 shadow-sm bg-white">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-[300px] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">{img.alt}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Estilos del carrusel: keyframes y pausa al hover */}
      <style>{`
        .marquee {
          width: max-content;
          animation: scroll var(--speed, 30s) linear infinite;
        }
        .marquee:hover { animation-play-state: paused; }
        @keyframes scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// Imágenes de ejemplo: reemplázalas por tus fotos reales
const defaultImages = [
  { alt: "Recepción luminosa", src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200" },
  { alt: "Sala de espera con juegos", src: "https://images.unsplash.com/photo-1604917877933-8d0d6df75f1a?q=80&w=1200" },
  { alt: "Consultorio pediátrico", src: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200" },
  { alt: "Zona de lactancia", src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200" },
  { alt: "Estación de higiene", src: "https://images.unsplash.com/photo-1588771930299-72a39e0642f1?q=80&w=1200" },
  { alt: "Decoración amigable para niños", src: "https://images.unsplash.com/photo-1551292831-023188e78222?q=80&w=1200" },
];
