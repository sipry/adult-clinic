'use client'
import React, { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type NavbarScheme = 'auto' | 'white' | 'dark';

interface NavbarProps {
  /** Opcional: forzar esquema de color. En /services se fuerza blanco automáticamente. */
  scheme?: NavbarScheme;
}

const Navbar: React.FC<NavbarProps> = ({ scheme = 'auto' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { t } = useTranslation();
  const pathname = usePathname();

  const onServicesPage = !!pathname && pathname.startsWith('/services');
  const forceWhite =
    scheme === 'white' || (scheme === 'auto' && onServicesPage); // <- cambia aquí
  const solidNav = forceWhite || isScrolled;


  useEffect(() => {
    const applyScrollState = () => setIsScrolled(window.scrollY > 50);
    applyScrollState(); // asegura estado correcto en el primer render (si ya está scrolleado)

    window.addEventListener('scroll', applyScrollState, { passive: true });
    window.addEventListener('load', applyScrollState);
    // Cuando el navegador restaura desde el BFCache (back/forward), 'pageshow' sí dispara
    window.addEventListener('pageshow', applyScrollState);

    // Scrollspy con IntersectionObserver
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((sec) => observer.observe(sec));

    // Cerrar drawer si se pasa a desktop (>= 1280px)
    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', applyScrollState);
      window.removeEventListener('load', applyScrollState);
      window.removeEventListener('pageshow', applyScrollState);
      window.removeEventListener('resize', onResize);
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // Re-evalúa el estado al cambiar de ruta (incluye hash/anchors del App Router)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsScrolled(window.scrollY > 50);
    }
  }, [pathname]);

  // Bloquea el scroll del body cuando el drawer está abierto (iOS friendly)
  useEffect(() => {
    const { body, documentElement } = document;
    if (isMobileMenuOpen) {
      const prevBody = body.style.overflow;
      const prevHtml = documentElement.style.overflow;
      body.style.overflow = 'hidden';
      documentElement.style.overflow = 'hidden';
      return () => {
        body.style.overflow = prevBody;
        documentElement.style.overflow = prevHtml;
      };
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: '/#', id: 'home', label: t('nav.home') },
    { href: '/#about', id: 'about', label: t('nav.about') },
    { href: '/#services', id: 'services', label: t('nav.services') },
    { href: '/#insurance', id: 'insurance', label: t('nav.insurance') },
    { href: '/#providers', id: 'providers', label: t('nav.providers') },
    { href: '/#gallery', id: 'gallery', label: t('nav.gallery') },
    { href: '/#contact', id: 'contact', label: t('nav.contact') },
  ];

  const linkClasses = (isActive: boolean) =>
    [
      'relative group transition-colors duration-300 hover:scale-105 font-normal text-sm tracking-widest',
      solidNav
        ? (isActive ? 'text-gray-800' : 'text-gray-700 hover:text-gray-800')
        : (isActive ? 'text-white' : 'text-white')
    ].join(' ');

  return (
    <>
      <header
        data-solid={solidNav ? 'true' : 'false'}
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24',
          'py-4',
          // Sombra y blur controlados por clases para compatibilidad
          solidNav ? 'shadow-lg backdrop-blur-md' : 'shadow-none backdrop-blur-0'
        ].join(' ')}
        // Fade suave del fondo + acompañar con transición de blur/sombra
        style={{
          backgroundColor: solidNav ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0)',
          transition: 'background-color 400ms ease, box-shadow 400ms ease, backdrop-filter 400ms ease'
        }}
      >
        <nav className="flex items-center justify-between w-full">

          {/* Desktop Navigation (right, xl+) */}
          <div className="hidden xl:flex items-center space-x-6 ml-auto m-2">
            {navLinks.map(({ href, id, label }) => {
              const isActive = activeSection === id;
              return (
                <a key={href} href={href} className={linkClasses(isActive)}>
                  {label}
                  <span
                    className={[
                      'absolute left-0 -bottom-1 h-[1px] bg-current transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    ].join(' ')}
                  />
                </a>
              );
            })}

            <div
              className={`transition-colors duration-300 ${solidNav ? 'text-gray-700' : 'text-white'
                }`}
            >
              <LanguageToggle />
            </div>

            <Link
              href="/contact"
              className={`transition-transform transition-colors rounded-sm duration-300 font-normal text-sm py-2 px-10 tracking-wide hover:scale-105 ${solidNav
                ? 'bg-sky-900 text-white shadow-lg'
                : 'bg-white text-black shadow-lg'
                }`}
            >
              {t('nav.explore')}
            </Link>
          </div>

          {/* Mobile/Tablet Controls (right, <xl) */}
          <div className="flex items-center gap-2 ml-auto xl:hidden">
            <div className={`${isMobileMenuOpen ? 'hidden' : 'hidden md:flex'} items-center space-x-4`}>
              <div
                className={`transition-colors duration-300 ${solidNav ? 'text-gray-700' : 'text-white'
                  }`}
              >
                <LanguageToggle />
              </div>
              <Link
                href="/contact"
                className={`font-normal py-2 px-8 hover:scale-105 text-sm ${solidNav
                  ? 'bg-sky-900 rounded-sm text-white shadow-lg'
                  : 'bg-white text-black rounded-sm'
                  }`}
              >
                {t('nav.explore')}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className={`transition-transform duration-200 hover:scale-110 p-2 ${solidNav ? 'text-gray-800' : 'text-white'
                } `}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 xl:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Drawer (<xl) */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          h-dvh`}  /* altura real de la ventana, mejor que vh en móvil */
      >
        <div className="flex flex-col h-full">
          {/* Header - no se encoge */}
          <div className="shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-md tracking-wide font-semibold text-gray-800">Your Health Adult Care</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body scrollable */}
          <nav
            className="flex-1 min-h-0 px-6 py-8 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="space-y-6">
              {navLinks.map(({ href, id, label }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={[
                      'block text-md font-medium transition-colors py-2 tracking-wide',
                      isActive
                        ? 'text-sky-700'
                        : 'text-gray-700 hover:text-sky-900',
                    ].join(' ')}
                  >
                    {label}
                  </a>
                );
              })}
            </div>

            {/* Drawer language & theme */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('nav.language')}</span>
                <LanguageToggle />
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="shrink-0 p-6 border-t border-gray-200 flex justify-center">
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="inline-flex items-center bg-lime-900 hover:bg-lime-800 text-white rounded-sm font-semibold py-3 px-4 transition-colors tracking-wide"
            >
              {t('nav.explore')}
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
