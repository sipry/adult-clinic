import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import wave from "@/../public/assets/svg/wave.svg";

export const metadata = {
  title: "Instagram — Coming Soon | Your Health Adult Clinic",
  description: "Our Instagram account will be live soon.",
};

export default function InstagramComingSoonPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-sky-50 to-white">
      {/* Fondo con wave para coherencia visual */}
      <img
        src={wave.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 -top-1 w-full h-auto opacity-20 -rotate-180 z-0"
      />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28 lg:py-32">
        {/* Heading & subheading centrados */}
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold leading-[1.1] text-slate-900">
          Instagram Coming Soon
        </h1>
        <p className="mt-3 text-center text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          We’re preparing our official Instagram account. Thanks for your patience!
        </p>

        {/* Tarjeta principal */}
        <div className="mt-10 rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm shadow-sm p-6 sm:p-8">
          <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <span className="inline-flex items-center justify-center rounded-lg bg-sky-50 p-2">
              <Instagram className="h-6 w-6 text-sky-900" aria-hidden="true" />
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-900">Instagram</p>
              <p className="text-sm text-neutral-600">
                Our handle will go live soon. We’ll announce it on the website.
              </p>
            </div>
          </div>

          {/* Botón: volver al website */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-sky-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              aria-label="Go back to the website"
            >
              Go back to the website
            </Link>
          </div>
        </div>

        {/* Footer discreto */}
        <footer className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Your Health Adult Clinic. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
