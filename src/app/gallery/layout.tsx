// app/galeria/layout.tsx
import type { Metadata } from "next";

export const dynamic = "force-static"; // opcional

export const metadata: Metadata = {
  title: "Galería | Clínica Pediátrica",
  description: "Explora la galería de fotos de la clínica.",
  openGraph: {
    title: "Galería | Clínica Pediátrica",
    description: "Explora la galería de fotos de la clínica.",
    type: "website",
    url: "/galeria",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mantengo el layout minimalista para no duplicar el <Navbar/>,
  // ya que lo estás incluyendo en el page.tsx.
  // Si prefieres mover el Navbar aquí, dime y te paso la variante.
  return <>{children}</>;
}
