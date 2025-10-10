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


import globos from '@/../public/assets/images/globosCut.png';
import flowerField from '@/../public/assets/images/flower-field.jpg';
import river from '@/../public/assets/images/river.jpg';
import woman from '@/../public/assets/images/woman.jpg';
import globo1 from '@/../public/assets/images/globo-test-1.jpeg';
import globo2 from '@/../public/assets/images/globo-test-2.jpeg';
import globo3 from '@/../public/assets/images/globo-test-3.jpeg';


const slides = [
  { src: globos.src, alt: 'Globes', pos: '50% 90%' },
  { src: flowerField.src, alt: 'Flower Field', pos: '50% 90%' },
  { src: river.src, alt: 'River', pos: '50% 90%' },
  { src: woman.src, alt: 'Woman', pos: '50% 90%' },
  // { src: globo1.src, alt: 'Globo 1', pos: '50% 90%' },
  // { src: globo2.src, alt: 'Globo 2', pos: '50% 90%' },
  // { src: globo3.src, alt: 'Globo 3', pos: '50% 90%' },
];

const EYEBROW = 'PEDIATRIC & FAMILY CARE';
const HEADLINE_TOP = 'Your Health Adult Care';

const ONLY_FADE = false;

export default function HeroBannerMixedCentered() {
  const { t } = useTranslation();
  const [i, setI] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // rotate slides
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

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

  const headlineV: Variants = useMemo(() => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.06 } },
  }), []);
  const headlineWordV = useMemo(() => fromBottomOrFade(24, 0.36), [prefersReducedMotion]);

  const subtitleV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonsWrapV = useMemo(() => fromBottomOrFade(20, 0.28), [prefersReducedMotion]);
  const buttonV: Variants = useMemo(
    () =>
      prefersReducedMotion || ONLY_FADE
        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.28 } } }
        : { hidden: { opacity: 0, y: 32, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: 'easeOut' } } },
    [prefersReducedMotion]
  );

  const brandContainerV: Variants = useMemo(
    () => ({ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.05 } } }),
    []
  );
  const brandLetterV: Variants = useMemo(
    () =>
      prefersReducedMotion || ONLY_FADE
        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.28 } } }
        : { hidden: { y: 22, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.36, ease: 'easeOut' } } },
    [prefersReducedMotion]
  );

  const topWords = useMemo(() => HEADLINE_TOP.split(' '), []);
  const subtitleText = (t('hero.subtitle') as string) || '';

  return (
    <section id="home" ref={heroRef} className="relative h-[720px] md:min-h-screen w-full overflow-hidden bg-black">
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
              <Image src={s.src} alt={s.alt} fill priority={idx === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.pos }} quality={80} />
            </motion.div>
          );
        })}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.6)_35%,rgba(0,0,0,0.65)_55%,rgba(0,0,0,0.7)_100%)]" />
          {/* <div className=" absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.3)_35%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.4)_100%)]" /> */}

        </div>
      </div>

      {/* content */}
      <div className="relative z-10 h-full">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-5xl px-6 md:px-10 text-center">
            {/* pretitle */}
            <motion.div
              className="text-[11px] md:text-base tracking-[0.28em] text-white/70 uppercase"
              initial="hidden"
              animate={eyebrowCtrls}
              variants={eyebrowV}
            >
              {EYEBROW}
            </motion.div>

            {/* title */}
            <motion.h2
              initial="hidden"
              animate={headlineCtrls}
              variants={headlineV}
              className="mt-3 font-bold text-white leading-[0.95]
                         whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {topWords.map((w, idx) => (
                <motion.span key={idx} variants={headlineWordV} className="inline-block mr-3">
                  {w}
                </motion.span>
              ))}
            </motion.h2>
            <motion.h3
              className="mt-4 font-serif font-semibold tracking-wide text-white/90
                         whitespace-nowrap text-[clamp(16px,5.2vw,28px)]"
              initial="hidden"
              animate={brandCtrls}
              variants={brandContainerV}
            >
            </motion.h3>

            {/* subtitle */}
            {subtitleText ? (
              <motion.p initial="hidden" animate={subtitleCtrls} variants={subtitleV} className="mt-3 mx-auto max-w-3xl text-sm md:text-lg text-white/80 tracking-wide border-b border-white/30 pb-5">
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
                className="inline-flex items-center justify-center px-5 py-3 font-semibold text-sm md:text-base bg-white text-black shadow-[--shadow]"
                aria-label={t('hero.contact') ?? 'Book an appointment'}
              >
                {t('hero.contact') ?? 'Book an appointment'}
              </motion.a>

              <motion.a
                href="/#portal"
                variants={buttonV}
                whileHover={prefersReducedMotion || ONLY_FADE ? undefined : { scale: 1.04, transition: { duration: 0.12, ease: 'easeOut' } }}
                whileTap={prefersReducedMotion || ONLY_FADE ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center px-5 py-3  font-medium text-sm md:text-base border border-white/50 text-white/95 bg-white/5 backdrop-blur hover:bg-white/10"
                aria-label={t('hero.portal') ?? 'Patient Portal'}
              >
                {t('hero.portal') ?? 'Patient Portal'}
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
