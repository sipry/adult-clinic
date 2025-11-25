// app/provider/layout.tsx
import React from "react";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Proveedores",
    template: "%s | Proveedores",
  },
  description:
    "Conoce a los profesionales de nuestra clínica y revisa sus perfiles, especialidades y experiencia.",
};

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
        <Navbar scheme="white"/>
        <main className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          {children}
        </main>
      <Footer />
    </div>
  );
}
