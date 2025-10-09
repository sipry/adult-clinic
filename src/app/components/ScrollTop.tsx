import React, { useEffect, useState, useCallback } from "react";

export default function ScrollToTop({
  showAfterPx = 300,
  hideNearTopPx = 8,
  title = "Volver arriba",
}: {
  showAfterPx?: number;
  hideNearTopPx?: number;
  title?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const threshold = Math.max(0, showAfterPx);
      setVisible(y > Math.max(threshold, hideNearTopPx));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfterPx, hideNearTopPx]);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, []);

  const baseClasses =
    "fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-white shadow-lg backdrop-blur transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50";
  const stateClasses = visible
    ? "opacity-100 translate-y-0 pointer-events-auto"
    : "opacity-0 translate-y-2 pointer-events-none";

  return (
    <button
      onClick={scrollToTop}
      aria-label={title}
      title={title}
      className={`${baseClasses} ${stateClasses}`}
    >
      {/* Flecha hacia arriba (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M12 3.75a.75.75 0 0 1 .53.22l7.5 7.5a.75.75 0 1 1-1.06 1.06L12.75 6.31v13.94a.75.75 0 0 1-1.5 0V6.31l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5A.75.75 0 0 1 12 3.75Z" />
      </svg>
    </button>
  );
}