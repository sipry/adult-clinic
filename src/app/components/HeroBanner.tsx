// components/HeroBannerMixedCentered.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/app/contexts/TranslationContext';
import {
  motion,
  useAnimation,
  useReducedMotion,
  useInView,
  type Variants,
} from 'framer-motion';
import heropaint from '@/../public/assets/images/hero-paint.jpg';

const PALETTE = {
  amber: "#B67B39",  // ámbar cálido
  moss: "#7C8C4D",   // verde musgo
  wine: "#812D20",   // vino terroso
  ochre: "#D8C27A",  // ocre claro
  olive: "#4F5635",  // oliva profundo
  cream: "#FAF4E6",  // crema suave
  dark: "#2B2725",   // marrón oscuro
};

const slides = [
  { src: heropaint.src, alt: 'Globo 3', pos: '50% 1%' },
];

const HEADLINE_TOP = 'Your Health Adult Care';
const ONLY_FADE = false;
const AUTOPLAY_MS = 6000;

export default function HeroBannerMixedCentered() {
  const { t } = useTranslation();
  const EYEBROW = t('hero.pretitle');
  const [i, setI] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // ----- autoplay control (pausable / resettable) -----
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    stopAutoplay();
    timerRef.current = setInterval(
      () => setI((p) => (p + 1) % slides.length),
      AUTOPLAY_MS
    );
  };
  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // viewport
  const heroRef = useRef<HTMLElement | null>(null);
  const inView = useInView(heroRef, { once: true, margin: '-10% 0px' });

  // animation sequence
  const eyebrowCtrls = useAnimation();
  const headlineCtrls = useAnimation();
  const brandCtrls = useAnimation();
  const subtitleCtrls = useAnimation();
  const featuresCtrls = useAnimation();
  const buttonsCtrls = useAnimation();

  useEffect(() => {
    if (!inView) return;
    (async () => {
      await eyebrowCtrls.start('show');
      await headlineCtrls.start('show');
      await Promise.all([
        brandCtrls.start('show'),
        subtitleCtrls.start('show'),
        featuresCtrls.start('show'),
      ]);
      await buttonsCtrls.start('show');
    })();
  }, [inView, eyebrowCtrls, headlineCtrls, brandCtrls, subtitleCtrls, featuresCtrls, buttonsCtrls]);

  // variants
  const fromBottomOrFade = (yHidden: number, dur = 0.32): Variants =>
    prefersReducedMotion || ONLY_FADE
      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: dur } } }
      : { hidden: { opacity: 0, y: yHidden }, show: { opacity: 1, y: 0, transition: { duration: dur, ease: 'easeOut' } } };

  const eyebrowV = useMemo(() => fromBottomOrFade(10, 0.24), [prefersReducedMotion]);
  const subtitleV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonsWrapV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonV: Variants = useMemo(
    () =>
      prefersReducedMotion || ONLY_FADE
        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.28 } } }
        : { hidden: { opacity: 0, y: 32, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: 'easeOut' } } },
    [prefersReducedMotion]
  );

  const topWords = useMemo(() => HEADLINE_TOP.split(' '), []);
  const subtitleText = (t('hero.subtitle') as string) || '';

  // keyboard nav for dots (← →)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setI((p) => (p + 1) % slides.length);
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        setI((p) => (p - 1 + slides.length) % slides.length);
        startAutoplay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-[720px] md:min-h-screen w-full overflow-hidden bg-black"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
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
              transition={{ opacity: { duration: 0.5, ease: 'easeOut' } }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.pos }}
                quality={80}
              />
            </motion.div>
          );
        })}

        {/* overlay gradient (opacidad intermedia) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.45)_35%,rgba(0,0,0,0.5)_55%,rgba(0,0,0,0.55)_100%)]" />
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 h-full">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-5xl px-6 md:px-10 text-center">
            {/* pretitle */}
            <motion.div
              className="text-[11px] md:text-lg tracking-[0.28em] text-white/80 uppercase"
              initial="hidden"
              animate={eyebrowCtrls}
              variants={eyebrowV}
            >
              {EYEBROW}
            </motion.div>

            {/* title */}
            <motion.h2
              initial="hidden"
              animate={ /* reuse headlineCtrls for stagger */ headlineCtrls}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.06 } },
              }}
              className="mt-3 font-bold text-white leading-[0.95]
                         whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {/* {topWords.map((w, idx) => ( */}
              <motion.span
              // key={idx}
              // variants={prefersReducedMotion || ONLY_FADE
              //   ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.36 } } }
              //   : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } } }}
              // className="inline-block mr-3"
              >
                Your Health Adult Care
              </motion.span>
              {/* ))} */}
            </motion.h2>

            {/* subtitle */}
            {subtitleText ? (
              <motion.p
                initial="hidden"
                animate={subtitleCtrls}
                variants={subtitleV}
                className="mt-3 mx-auto max-w-4xl text-sm md:text-xl text-white/80 tracking-wide border-b border-white/30 pb-5"
              >
                {subtitleText}
              </motion.p>
            ) : null}

            {/* CTAs */}
            <motion.div initial="hidden" animate={buttonsCtrls} variants={buttonsWrapV} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="/#contact"
                variants={buttonV}
                whileHover={prefersReducedMotion || ONLY_FADE ? undefined : { scale: 1.04, transition: { duration: 0.12, ease: 'easeOut' } }}
                whileTap={prefersReducedMotion || ONLY_FADE ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center px-5 py-3 rounded-sm font-semibold text-sm md:text-base text-black shadow-[--shadow]"
                style={{ backgroundColor: PALETTE.cream }}
                aria-label={t('hero.contact') ?? 'Book an appointment'}
              >
                {t('hero.contact') ?? 'Book an appointment'}
              </motion.a>


              <motion.a
                href="/#services"
                variants={buttonV}
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center justify-center px-5 py-3 rounded-sm font-medium text-sm md:text-base border border-white/50 bg-transparent"
                style={{ color: PALETTE.cream }}
              >
                {t('hero.portal') ?? 'Patient Portal'}
              </motion.a>

            </motion.div>
          </div>
        </div>
      </div>

      {/* dots pagination */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2 px-6">
        <div className="flex items-center justify-center gap-2 px-3 py-2">
          {slides.map((_, idx) => {
            const active = idx === i;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setI(idx);
                  startAutoplay();
                }}
                className="group relative h-2.5 w-2.5 rounded-full outline-none"
                aria-label={`Ir al slide ${idx + 1}`}
                aria-current={active ? 'true' : undefined}
              >
                {/* base dot */}
                <span className="absolute inset-0 rounded-full bg-white/40 group-hover:bg-white/60 transition" />
                {/* active indicator */}
                <motion.span
                  layoutId="hero-dot"
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: active ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{ background: 'white' }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
