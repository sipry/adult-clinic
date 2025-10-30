'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import {
  type Locale,
  panelT,
  svcStr,
  svcArr,
  svcFaqs,
  format,
} from '../i18n/serviceDetails.i18n';
import {
  SERVICE_DETAILS,
  resolveServiceId,
  type ServiceDetail,
} from '../serviceDetail';

/* 🎨 Paleta */
const PALETTE = {
  base: '#B67B39', // ámbar cálido
  background: '#FAF4E6', // crema
  dark: '#2B2725', // marrón oscuro
  accent: '#E9E2B3', // amarillo oliva suave (chips)
};

/* ==================== Tipos ==================== */
export type ServiceDetailsBasic = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  service?: ServiceDetailsBasic | null;
  locale: Locale;
};

/* ==================== Scroll lock ==================== */
let __scrollLocks = 0;
function lockScroll() {
  const html = document.documentElement;
  const body = document.body;
  __scrollLocks++;
  if (__scrollLocks === 1) {
    html.style.overflowY = 'hidden';
    body.style.overflowY = 'hidden';
  }
}
function unlockScroll() {
  const html = document.documentElement;
  const body = document.body;
  __scrollLocks = Math.max(0, __scrollLocks - 1);
  if (__scrollLocks === 0) {
    html.style.overflowY = '';
    body.style.overflowY = '';
  }
}
function useLockBody(lock: boolean) {
  useEffect(() => {
    if (lock) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [lock]);
}

/* ==================== Subcomponentes ==================== */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3
        className="text-[13px] font-semibold uppercase tracking-wide"
        style={{ color: PALETTE.base }}
      >
        {title}
      </h3>
      <div className="mt-1">{children}</div>
    </section>
  );
}

/* ==================== Panel ==================== */
export default function ServiceDetailsPanel({ open, onClose, service, locale }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = 'svc-panel-title';

  useLockBody(open);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const data: ServiceDetail | null = useMemo(() => {
    const id = resolveServiceId(service?.id);
    return id ? SERVICE_DETAILS[id] : null;
  }, [service?.id]);

  const sid = data?.id ?? resolveServiceId(service?.id) ?? null;
  const Icon = service?.icon;

  const title =
    (sid && (svcStr(locale, sid, 'title') ?? undefined)) ||
    service?.title ||
    panelT(locale, 'fallbackTitle');

  const summary =
    (sid && (svcStr(locale, sid, 'summary') ?? undefined)) ||
    service?.longDescription ||
    service?.description ||
    panelT(locale, 'noDescription');

  const recommendedFor = sid ? svcArr(locale, sid, 'recommendedFor') : [];
  const includes = sid ? svcArr(locale, sid, 'includes') : [];
  const preparation = sid ? svcArr(locale, sid, 'preparation') : [];
  const whatToExpect = sid ? svcArr(locale, sid, 'whatToExpect') : [];
  const followUp = sid ? svcArr(locale, sid, 'followUp') : [];
  const risks = sid ? svcArr(locale, sid, 'risks') : [];
  const faqs = sid ? svcFaqs(locale, sid) : [];

  return (
    <>
      <div
        aria-hidden={!open}
        className={[
          'fixed inset-0 z-[100] pointer-events-none',
          open ? 'block' : 'hidden',
        ].join(' ')}
      >
        {/* Overlay */}
        <div
          className="pointer-events-auto fixed inset-0 bg-black/40 opacity-100 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel */}
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto fixed right-0 top-0 h-full w-full max-w-[620px] shadow-2xl outline-none"
          style={{
            backgroundColor: PALETTE.background,
            transform: open ? 'translateX(0%)' : 'translateX(100%)',
            transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EAD9B3] p-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{ backgroundColor: '#F6E9D0' }}
                >
                  <Icon className="h-5 w-5" style={{ color: PALETTE.base }} />
                </div>
              )}
              <h2
                id={titleId}
                className="text-lg font-bold"
                style={{ color: PALETTE.dark }}
              >
                {title}
              </h2>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#EFE5D2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B67B39]"
              aria-label={panelT(locale, 'close')}
            >
              <X className="h-5 w-5" style={{ color: PALETTE.dark }} />
            </button>
          </div>

          {/* Contenido */}
          <div
            className="h-[calc(100%-56px)] overflow-y-auto p-6 panel-scroll"
            style={{ color: PALETTE.dark }}
          >
            <p className="text-[15px] leading-relaxed mb-4">{summary}</p>

            {/* Chips */}
            {(recommendedFor.length || service?.tags?.length) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recommendedFor.map((tag) => (
                  <span
                    key={`rf-${tag}`}
                    className="rounded-sm px-3 py-1 text-[12px] font-medium"
                    style={{
                      backgroundColor: PALETTE.accent,
                      color: PALETTE.dark,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {!!includes.length && (
              <Section title={panelT(locale, 'sections.includes')}>
                <ul className="list-disc pl-5 leading-relaxed">
                  {includes.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!preparation.length && (
              <Section title={panelT(locale, 'sections.preparation')}>
                <ul className="list-disc pl-5 leading-relaxed">
                  {preparation.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!whatToExpect.length && (
              <Section title={panelT(locale, 'sections.expect')}>
                <ol className="list-decimal pl-5 leading-relaxed">
                  {whatToExpect.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </Section>
            )}

            {!!followUp.length && (
              <Section title={panelT(locale, 'sections.followUp')}>
                <ul className="list-disc pl-5 leading-relaxed">
                  {followUp.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!risks.length && (
              <Section title={panelT(locale, 'sections.risks')}>
                <ul className="list-disc pl-5 leading-relaxed">
                  {risks.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!faqs.length && (
              <Section title={panelT(locale, 'sections.faqs')}>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <details
                      key={`${f.q}-${i}`}
                      className="rounded-md border border-[#EAD9B3] bg-[#FFFDF8] p-3"
                    >
                      <summary className="cursor-pointer text-sm font-semibold">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* CTA */}
            <div className="mt-8 mb-4 flex justify-center px-4">
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex w-full max-w-xl h-12 items-center justify-center rounded-lg text-base font-semibold shadow-sm transition"
                style={{
                  backgroundColor: PALETTE.base,
                  color: PALETTE.background,
                }}
              >
                {panelT(locale, 'cta.label')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
