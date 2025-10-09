'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

// i18n exclusivo del panel (SIN context)
import {
  type Locale,
  panelT,
  svcStr,
  svcArr,
  svcFaqs,
  format,
} from '../i18n/serviceDetails.i18n';

// Tu data/IDs de servicios
import {
  SERVICE_DETAILS,
  resolveServiceId,
  type ServiceDetail
} from '../serviceDetail';

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
  /** Idioma viene del TranslationContext del sitio */
  locale: Locale; // <-- obligatorio aquí para “hacerlo así”
};

/* ==================== Scroll lock (global) ==================== */
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
function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/* ==================== Panel ==================== */
export default function ServiceDetailsPanel({ open, onClose, service, locale }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const startTrapRef = useRef<HTMLSpanElement>(null);
  const endTrapRef = useRef<HTMLSpanElement>(null);
  const titleId = 'svc-panel-title';

  useLockBody(open);

  // Enfocar botón de cerrar al abrir
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc para cerrar
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap básico
  const onTrapFocus = (which: 'start' | 'end') => {
    if (!open) return;
    if (which === 'start') {
      endTrapRef.current?.previousElementSibling instanceof HTMLElement
        ? (endTrapRef.current.previousElementSibling as HTMLElement).focus()
        : closeBtnRef.current?.focus();
    } else {
      closeBtnRef.current?.focus();
    }
  };

  // Resolver ID a partir del alias
  const data: ServiceDetail | null = useMemo(() => {
    const id = resolveServiceId(service?.id);
    return id ? SERVICE_DETAILS[id] : null;
  }, [service?.id]);

  const sid = data?.id ?? resolveServiceId(service?.id) ?? null;
  const Icon = service?.icon;

  // Deep link al panel actual (útil para compartir)
  const shareHref =
    typeof window !== 'undefined' && service?.id
      ? `${window.location.origin}/services?detail=${encodeURIComponent(
        service.id
      )}`
      : undefined;

  // ======== Textos desde i18n exclusivo ========
  const title =
    (sid && (svcStr(locale, sid, 'title') ?? undefined)) ||
    service?.title ||
    panelT(locale, 'fallbackTitle');

  const ageRange = sid ? svcStr(locale, sid, 'ageRange') : undefined;
  const duration = sid ? svcStr(locale, sid, 'duration') : undefined;

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
          open ? 'block' : 'hidden'
        ].join(' ')}
      >
        {/* Overlay */}
        <div
          className="pointer-events-auto fixed inset-0 bg-black/40 opacity-100 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel deslizante */}
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto fixed right-0 top-0 h-full w-full max-w-[620px] bg-white shadow-2xl outline-none"
          style={{
            transform: open ? 'translateX(0%)' : 'translateX(100%)',
            transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sentinelas para focus trap */}
          <span
            tabIndex={0}
            ref={startTrapRef}
            onFocus={() => onTrapFocus('start')}
          />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div className="flex items-center gap-3">
              {Icon ? (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
              ) : null}
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="truncate text-lg font-bold text-slate-900"
                >
                  {title}
                </h2>
                {(ageRange || duration) && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {ageRange ?? ''}
                    {ageRange && duration ? ' • ' : ''}
                    {/* {duration ?? ''} */}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label={panelT(locale, 'close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="h-[calc(100%-56px)] overflow-y-auto p-5 panel-scroll">
            {/* Resumen */}
            <p className="text-slate-700 leading-relaxed">{summary}</p>

            {/* Chips recomendados + tags custom */}
            {(recommendedFor.length || service?.tags?.length) ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {recommendedFor.map((tag) => (
                  <span
                    key={`rf-${tag}`}
                    className="rounded-sm border border-lime-300 bg-lime-50 px-2 py-1 text-[11px] font-medium text-lime-800"
                  >
                    {tag}
                  </span>
                ))}
                {(service?.tags || []).map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Incluye */}
            {!!includes.length && (
              <Section title={panelT(locale, 'sections.includes')}>
                <ul className="list-disc pl-5 text-slate-700 leading-relaxed">
                  {includes.map((it) => (
                    <li key={it} className="mb-1.5">
                      {it}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Preparación */}
            {!!preparation.length && (
              <Section title={panelT(locale, 'sections.preparation')}>
                <ul className="list-disc pl-5 text-slate-700 leading-relaxed">
                  {preparation.map((it) => (
                    <li key={it} className="mb-1.5">
                      {it}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Qué esperar */}
            {!!whatToExpect.length && (
              <Section title={panelT(locale, 'sections.expect')}>
                <ol className="list-decimal pl-5 text-slate-700 leading-relaxed">
                  {whatToExpect.map((it) => (
                    <li key={it} className="mb-1.5">
                      {it}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* Seguimiento */}
            {!!followUp.length && (
              <Section title={panelT(locale, 'sections.followUp')}>
                <ul className="list-disc pl-5 text-slate-700 leading-relaxed">
                  {followUp.map((it) => (
                    <li key={it} className="mb-1.5">
                      {it}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Riesgos / Advertencias */}
            {!!risks.length && (
              <Section title={panelT(locale, 'sections.risks')}>
                <ul className="list-disc pl-5 text-slate-700 leading-relaxed">
                  {risks.map((it) => (
                    <li key={it} className="mb-1.5">
                      {it}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* FAQs */}
            {!!faqs.length && (
              <Section title={panelT(locale, 'sections.faqs')}>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <details
                      key={`${f.q}-${i}`}
                      className="rounded-md border border-slate-200 bg-white/70 p-3"
                    >
                      <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* CTA */}
            <div className="mt-8 mb-10 flex justify-center px-4">
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex w-full max-w-xl h-14 items-center justify-center rounded-lg bg-lime-900 px-6 text-base font-semibold text-white shadow-lg hover:bg-lime-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600 transition"
                aria-label={format(panelT(locale, 'cta.aria'), { title })}
              >
                {panelT(locale, 'cta.label')}
              </a>
            </div>
          </div>

          {/* Sentinela fin para focus trap */}
          <span
            tabIndex={0}
            ref={endTrapRef}
            onFocus={() => onTrapFocus('end')}
          />
        </section>
      </div>

      {/* Scrollbar clara */}
      <style jsx global>{`
        .panel-scroll {
          color-scheme: light;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .panel-scroll::-webkit-scrollbar { width: 10px; }
        .panel-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .panel-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 8px;
          border: 2px solid #f1f5f9;
        }
        .panel-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </>
  );
}
