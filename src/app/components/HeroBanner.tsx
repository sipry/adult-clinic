// components/HeroBannerMixedCentered.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import {
  motion,
  useAnimation,
  useReducedMotion,
  useInView,
  type Variants,
} from "framer-motion";
import heropaint from "@/../public/assets/images/hero-paint.webp";
import { PALETTE, BRAND } from "@/app/ui/palette";

const slides = [
  { src: heropaint.src, alt: "Hero background", pos: "100% 0%" },
];

const ONLY_FADE = false;
const AUTOPLAY_MS = 5000;

export default function HeroBannerMixedCentered() {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // colores del sistema
  const primary = PALETTE[0];
  const textColor = BRAND.text;

  const heroRef = useRef<HTMLElement | null>(null);
  const inView = useInView(heroRef, { once: true, margin: "-10% 0px" });

  // 👇 autoplay sencillo: cada AUTOPLAY_MS cambia al siguiente
  useEffect(() => {
    if (prefersReducedMotion) return;
    // si quieres que solo se mueva cuando está en pantalla, descomenta esta línea:
    // if (!inView) return;
    const timer = setTimeout(() => {
      setI((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [i, prefersReducedMotion, inView]);

  const eyebrowCtrls = useAnimation();
  const headlineCtrls = useAnimation();
  const brandCtrls = useAnimation();
  const subtitleCtrls = useAnimation();
  const featuresCtrls = useAnimation();
  const buttonsCtrls = useAnimation();

  useEffect(() => {
    if (!inView) return;
    (async () => {
      await eyebrowCtrls.start("show");
      await headlineCtrls.start("show");
      await Promise.all([
        brandCtrls.start("show"),
        subtitleCtrls.start("show"),
        featuresCtrls.start("show"),
      ]);
      await buttonsCtrls.start("show");
    })();
  }, [
    inView,
    eyebrowCtrls,
    headlineCtrls,
    brandCtrls,
    subtitleCtrls,
    featuresCtrls,
    buttonsCtrls,
  ]);

  const fromBottomOrFade = (yHidden: number, dur = 0.32): Variants =>
    prefersReducedMotion || ONLY_FADE
      ? {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: dur } },
        }
      : {
          hidden: { opacity: 0, y: yHidden },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: dur, ease: "easeOut" },
          },
        };

  const eyebrowV = useMemo(() => fromBottomOrFade(10, 0.24), [prefersReducedMotion]);
  const subtitleV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonsWrapV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonV: Variants = useMemo(
    () =>
      prefersReducedMotion || ONLY_FADE
        ? {
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.28 } },
          }
        : {
            hidden: { opacity: 0, y: 32, scale: 0.96 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.32, ease: "easeOut" },
            },
          },
    [prefersReducedMotion]
  );

  const subtitleText = (t("hero.subtitle") as string) || "";

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-[720px] md:min-h-screen w-full overflow-hidden bg-black"
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
    >
      {/* background */}
      <div className="absolute inset-0">
        {slides.map((s, idx) => {
          const isActive = idx === i;
          return (
            <motion.div
              key={s.src}
              className="absolute inset-0 bg-black"
              aria-hidden={!isActive}
              initial={{ opacity: idx === 0 ? 1 : 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ opacity: { duration: 0.5, ease: "easeOut" } }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
                style={{
                  objectPosition: "right top",
                }}
                quality={75}
              />
            </motion.div>
          );
        })}

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(154,218,216,0.12) 0%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 h-full">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-5xl px-6 md:px-10 text-center">
            <motion.h1
              className="text-[11px] md:text-lg tracking-[0.28em] uppercase"
              style={{ color: primary.base }}
              initial="hidden"
              animate={eyebrowCtrls}
              variants={eyebrowV}
            >
              {t("hero.pretitle")}
            </motion.h1>

            <motion.h2
              initial="hidden"
              animate={headlineCtrls}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.02, delayChildren: 0.06 },
                },
              }}
              className="mt-3 font-bold leading-[0.95] whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: "#FFFFFF" }}
            >
              <motion.span>Your Health Adult Care</motion.span>
            </motion.h2>

            {subtitleText ? (
              <motion.p
                initial="hidden"
                animate={subtitleCtrls}
                variants={subtitleV}
                className="mt-3 mx-auto max-w-4xl text-sm md:text-xl tracking-wide border-b pb-5"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  borderColor: primary.back,
                }}
              >
                {subtitleText}
              </motion.p>
            ) : null}

            <motion.div
              initial="hidden"
              animate={buttonsCtrls}
              variants={buttonsWrapV}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.a
                href="/#contact"
                variants={buttonV}
                className="inline-flex items-center justify-center px-5 py-3 rounded-sm font-semibold text-sm md:text-base shadow-md"
                style={{
                  backgroundColor: primary.base,
                  color: textColor,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                  border: `1px solid ${primary.back}`,
                }}
              >
                {t("hero.contact") ?? "Book an appointment"}
              </motion.a>

              <motion.a
                href="/#services"
                variants={buttonV}
                className="inline-flex items-center justify-center px-5 py-3 rounded-sm font-medium text-sm md:text-base backdrop-blur-md bg-white/15"
                style={{
                  color: "#FFFFFF",
                  border: `1px solid ${primary.back}`,
                }}
              >
                {t("hero.portal") ?? "Patient Portal"}
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* dots */}
      {/* <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2 px-6">
        <div className="flex items-center justify-center gap-2 px-3 py-2">
          {slides.map((_, idx) => {
            const active = idx === i;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className="group relative h-2.5 w-2.5 rounded-full outline-none"
                aria-label={`Ir al slide ${idx + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <span
                  className="absolute inset-0 rounded-full transition"
                  style={{
                    backgroundColor: active ? "#FFFFFF" : primary.back,
                  }}
                />
                {active ? (
                  <motion.span
                    layoutId="hero-dot"
                    className="absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{ background: "#FFFFFF" }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div> */}
    </section>
  );
}
