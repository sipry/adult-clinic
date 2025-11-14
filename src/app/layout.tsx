// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";
import { TranslationProvider, Language } from "./contexts/TranslationContext";

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

const NO_FLASH = `(function() {
  try {
    var saved = localStorage.getItem('darkMode');
    var preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === null ? preferDark : saved === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  } catch (_) {}
})();`;

// 👇 AHORA ES ASYNC
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👇 usamos await porque cookies() está tipado como Promise<...>
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value as Language | undefined;

  const initialLanguage: Language =
    cookieLang === "es" || cookieLang === "en" ? cookieLang : "en"; // o 'es' si quieres default en español

  return (
    <html
      lang={initialLanguage}
      className={merriweather.variable}
      suppressHydrationWarning
    >
      <body className="font-serif">
        <Script id="no-flash" strategy="beforeInteractive">
          {NO_FLASH}
        </Script>

        {/* 👇 le pasamos el idioma inicial al provider */}
        <TranslationProvider initialLanguage={initialLanguage}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
