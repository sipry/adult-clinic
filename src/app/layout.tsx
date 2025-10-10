// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import Script from "next/script";
import { TranslationProvider } from "./contexts/TranslationContext"; // si aplica

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Health Adult Care",
  description: "Adult health care clinic site",
};

// IMPORTANTE: que sea STRING, no IIFE ejecutada.
const NO_FLASH = `(function() {
  try {
    var saved = localStorage.getItem('darkMode');
    var preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === null ? preferDark : saved === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  } catch (_) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={merriweather.variable} suppressHydrationWarning>
      <body className="font-serif">
        {/* Ejecuta antes de hidratar, sin tocar SSR */}
        <Script id="no-flash" strategy="beforeInteractive">
          {NO_FLASH}
        </Script>

        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}
