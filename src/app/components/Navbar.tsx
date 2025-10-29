'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/* 🎨 Paleta pictórica */
const PALETTE = {
  amber: "#B67B39",  // ámbar cálido
  moss: "#7C8C4D",   // verde musgo
  wine: "#812D20",   // vino terroso
  ochre: "#D8C27A",  // ocre claro
  olive: "#4F5635",  // oliva profundo
  cream: "#FAF4E6",  // crema suave
  dark: "#2B2725",   // marrón oscuro
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
    window.addEventListener('load', applyScrollState);
    window.addEventListener('pageshow', applyScrollState);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsScrolled(window.scrollY > 50);
    }
  }, [pathname]);

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
            ? 'text-[#2B2725]' // marrón oscuro
            : 'text-[#4F5635] hover:text-[#2B2725]') // oliva → marrón
        : (isActive
            ? 'text-[#FAF4E6]' // crema sobre fondo oscuro
            : 'text-[#FAF4E6] hover:text-[#D8C27A]') // crema → ocre
    ].join(' ');

  return (
    <>
      <header
        data-solid={solidNav ? 'true' : 'false'}
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24',
          'py-4 transition-all duration-500',
          solidNav ? 'shadow-lg backdrop-blur-md' : 'shadow-none backdrop-blur-0'
        ].join(' ')}
        style={{
          backgroundColor: solidNav ? `${PALETTE.cream}` : 'transparent',
          transition: 'background-color 400ms ease, box-shadow 400ms ease',
        }}
      >
        <nav className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
          
          </Link>

          {/* Desktop Navigation */}
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
              className="transition-colors duration-300"
              style={{
                color: solidNav ? PALETTE.dark : PALETTE.cream,
              }}
            >
              <LanguageToggle />
            </div>

            <Link
              href="/contact"
              className="transition-transform rounded-sm duration-300 font-normal text-sm py-2 px-10 tracking-wide hover:scale-105 shadow-lg"
              style={{
                backgroundColor: solidNav ? PALETTE.olive : PALETTE.cream,
                color: solidNav ? PALETTE.cream : PALETTE.dark,
              }}
            >
              {t('nav.explore')}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 ml-auto xl:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 transition-transform duration-200 hover:scale-110"
              style={{
                color: solidNav ? PALETTE.dark : PALETTE.cream,
              }}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
