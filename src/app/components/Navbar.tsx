'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/* 🎨 Paleta pictórica */
const PALETTE = {
  amber: "#B67B39",
  moss: "#7C8C4D",
  wine: "#812D20",
  ochre: "#D8C27A",
  olive: "#4F5635",
  cream: "#FAF4E6",
  dark: "#2B2725",
};

type NavbarScheme = 'auto' | 'white' | 'dark';

interface NavbarProps {
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
    scheme === 'white' || (scheme === 'auto' && onServicesPage);
  const solidNav = forceWhite || isScrolled;

  useEffect(() => {
    const applyScrollState = () => setIsScrolled(window.scrollY > 50);
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });

    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', applyScrollState);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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
      'relative group transition-colors duration-300 hover:scale-105 font-medium text-sm tracking-widest',
      solidNav
        ? (isActive
          ? 'text-[#2B2725]'
          : 'text-[#4F5635] hover:text-[#2B2725]')
        : (isActive
          ? 'text-[#FAF4E6]'
          : 'text-[#FAF4E6] hover:text-[#D8C27A]')
    ].join(' ');

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24',
          'py-4 transition-all duration-500 flex items-center justify-between',
          solidNav ? 'shadow-lg backdrop-blur-md' : 'shadow-none'
        ].join(' ')}
        style={{
          backgroundColor: solidNav ? `${PALETTE.cream}` : 'transparent',
          transition: 'background-color 400ms ease, box-shadow 400ms ease',
        }}
      >


        {/* 🌐 Main navigation group */}
        <div className="flex items-center ml-auto">
          {/* 🧩 Stage 1 — links visible only on large screens */}
          <div className="hidden xl:flex items-center space-x-6 mr-4">

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
          </div>

          {/* 🧩 Stage 2 — toggle & button remain visible on md+, hidden on sm */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle scrolled={isScrolled} />
            <Link
              href="/contact"
              className="transition-transform rounded-sm duration-300 font-normal text-sm py-2 px-6 tracking-wide hover:scale-105 shadow-md"
              style={{
                backgroundColor: solidNav ? PALETTE.olive : PALETTE.cream,
                color: solidNav ? PALETTE.cream : PALETTE.dark,
              }}
            >
              {t('nav.explore')}
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="p-2 ml-3 flex xl:hidden transition-transform duration-200 hover:scale-110"
            style={{ color: solidNav ? PALETTE.dark : PALETTE.cream }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>


        </div>
      </header>

      {/* 🌓 Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[55] transition-opacity duration-300 xl:hidden"
          onClick={closeMobileMenu}
        />
      )}
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 w-80 max-w-[90vw] shadow-2xl z-[60]
    transform transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
    h-dvh xl:hidden`}
        style={{ backgroundColor: PALETTE.cream }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
            <span
              className="text-md tracking-wide font-semibold"
              style={{ color: PALETTE.dark }}
            >
              Your Health Adult Care
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 transition-colors"
              style={{ color: PALETTE.dark }}
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <nav className="flex-1 min-h-0 px-6 py-8 overflow-y-auto">
            <div className="space-y-6">
              {navLinks.map(({ href, id, label }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`block text-md font-medium py-2 tracking-wide transition-colors ${isActive
                      ? 'text-[#7C8C4D]'
                      : 'text-[#2B2725] hover:text-[#812D20]'
                      }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="shrink-0 p-6 border-t border-gray-300 flex justify-center">
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="inline-flex items-center font-semibold py-3 px-4 rounded-sm transition-colors"
              style={{
                backgroundColor: PALETTE.olive,
                color: PALETTE.cream,
              }}
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
