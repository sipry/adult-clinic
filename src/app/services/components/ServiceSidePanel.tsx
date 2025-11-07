// components/ServiceDetailsPanel.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";

// i18n exclusivo del panel
import {
  type Locale,
  panelT,
  svcStr,
  svcArr,
  svcFaqs,
  format,
} from "../i18n/serviceDetails.i18n";

// data de servicios
import {
  SERVICE_DETAILS,
  resolveServiceId,
  type ServiceDetail,
} from "../serviceDetail";

/* 🎨 Paleta pastel */
const PALETTE = {
  headerBg: "#C8E7DA", // verde pastel
  headerIcon: "#001219",
  chip: "#E6F2EC", // chip pastel
  chipBorder: "#A8D1C2",
  bg: "#FFFFFF",
  panel: "#FDFBF5",
  text: "#001219",
  border: "rgba(0,18,25,0.08)",
  cta: "#9ADAD8",
  ctaText: "#001219",
};

/* ==================== Tipos ==================== */
export type ServiceDetailsBasic = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** ← esto es lo que pusiste en las tarjetas */
  badge?: string;
};

type ServiceDetailsPanelProps = {
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
    html.style.overflowY = "hidden";
    body.style.overflowY = "hidden";
  }
}
function unlockScroll() {
  const html = document.documentElement;
  const body = document.body;
  __scrollLocks = Math.max(0, __scrollLocks - 1);
  if (__scrollLocks === 0) {
    html.style.overflowY = "";
    body.style.overflowY = "";
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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3
        className="text-[12px] font-semibold tracking-[0.08em] uppercase mb-2"
        style={{ color: `${PALETTE.text}CC` }}
      >
        {title}
      </h3>
      <div className="leading-relaxed text-[14px]" style={{ color: PALETTE.text }}>
        {children}
      </div>
    </section>
  );
}

/* ==================== Panel ==================== */
const ServiceDetailsPanel: React.FC<ServiceDetailsPanelProps> = ({
  open,
  onClose,
  service,
  locale,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = "svc-panel-title";

  useLockBody(open);

  // focus en el botón de cerrar
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC para cerrar
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // resolvemos el service completo
  const data: ServiceDetail | null = useMemo(() => {
    const id = resolveServiceId(service?.id);
    return id ? SERVICE_DETAILS[id] : null;
  }, [service?.id]);

  const sid = data?.id ?? resolveServiceId(service?.id) ?? null;
  const Icon = service?.icon;

  // textos desde i18n o desde la tarjeta
  const title =
    (sid && (svcStr(locale, sid, "title") ?? undefined)) ||
    service?.title ||
    panelT(locale, "fallbackTitle");

  const summary =
    (sid && (svcStr(locale, sid, "summary") ?? undefined)) ||
    service?.longDescription ||
    service?.description ||
    panelT(locale, "noDescription");

  const recommendedFor = sid ? svcArr(locale, sid, "recommendedFor") : [];
  const includes = sid ? svcArr(locale, sid, "includes") : [];
  const preparation = sid ? svcArr(locale, sid, "preparation") : [];
  const whatToExpect = sid ? svcArr(locale, sid, "whatToExpect") : [];
  const followUp = sid ? svcArr(locale, sid, "followUp") : [];
  const risks = sid ? svcArr(locale, sid, "risks") : [];
  const faqs = sid ? svcFaqs(locale, sid) : [];

  // badge que venía desde la tarjeta
  const cardBadge = service?.badge ? [service.badge] : [];

  return (
    <>
      <div
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-[120] pointer-events-none",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        {/* overlay */}
        <div
          className="pointer-events-auto fixed inset-0 bg-[#001219]/35"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* panel */}
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto fixed right-0 top-0 h-full w-full max-w-[620px] shadow-2xl"
          style={{
            backgroundColor: PALETTE.panel,
            transform: open ? "translateX(0%)" : "translateX(100%)",
            transition: "transform 300ms cubic-bezier(.2,.8,.2,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <header
  className="flex items-center justify-between gap-3 px-5 py-4 border-b"
  style={{ backgroundColor: PALETTE.headerBg, borderColor: "#00000011" }}
>
  <div className="flex items-center gap-3 min-w-0">
    {/* 👇 siempre intentamos mostrar el icono */}
    <div
      className="grid h-10 w-10 place-items-center rounded-full border"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: `${PALETTE.headerIcon}11`,
      }}
    >
      {Icon ? (
        <Icon className="h-5 w-5" style={{ color: PALETTE.headerIcon }} />
      ) : null}
    </div>

    <div className="min-w-0">
      <h2
        id={titleId}
        className="text-base md:text-lg font-bold truncate"
        style={{ color: PALETTE.headerIcon }}
      >
        {title}
      </h2>
    </div>
  </div>

  <button
    ref={closeBtnRef}
    onClick={onClose}
    className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    aria-label={panelT(locale, "close")}
  >
    <X className="h-5 w-5" style={{ color: PALETTE.headerIcon }} />
  </button>
</header>


          {/* contenido scrollable */}
          <div
            className="h-[calc(100%-62px)] overflow-y-auto px-5 pb-20 pt-5 panel-scroll"
            style={{ color: PALETTE.text }}
          >
            {/* descripción */}
            <p className="text-[15px] leading-relaxed mb-4">{summary}</p>

            {/* badges: primero el de la tarjeta y luego los del servicio */}
            {(cardBadge.length > 0 || recommendedFor.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {cardBadge.map((b) => (
                  <span
                    key={`card-${b}`}
                    className="inline-flex items-center rounded-md px-3 py-1 text-[13px] font-medium"
                    style={{
                      backgroundColor: "#F5FDFB",
                      border: `1px solid ${PALETTE.chipBorder}`,
                      color: PALETTE.text,
                    }}
                  >
                    {b}
                  </span>
                ))}
                {recommendedFor.map((tag) => (
                  <span
                    key={`rf-${tag}`}
                    className="inline-flex items-center rounded-md px-3 py-1 text-[13px] font-medium"
                    style={{
                      backgroundColor: "#F5FDFB",
                      border: `1px solid ${PALETTE.chipBorder}`,
                      color: PALETTE.text,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {!!includes.length && (
              <Section title={panelT(locale, "sections.includes")}>
                <ul className="list-disc pl-5 space-y-1.5">
                  {includes.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!preparation.length && (
              <Section title={panelT(locale, "sections.preparation")}>
                <ul className="list-disc pl-5 space-y-1.5">
                  {preparation.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!whatToExpect.length && (
              <Section title={panelT(locale, "sections.expect")}>
                <ol className="list-decimal pl-5 space-y-1.5">
                  {whatToExpect.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </Section>
            )}

            {!!followUp.length && (
              <Section title={panelT(locale, "sections.followUp")}>
                <ul className="list-disc pl-5 space-y-1.5">
                  {followUp.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!risks.length && (
              <Section title={panelT(locale, "sections.risks")}>
                <ul className="list-disc pl-5 space-y-1.5">
                  {risks.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!faqs.length && (
              <Section title={panelT(locale, "sections.faqs")}>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <details
                      key={`${f.q}-${i}`}
                      className="rounded-md border bg-white/80 p-3"
                      style={{ borderColor: `${PALETTE.border}` }}
                    >
                      <summary className="cursor-pointer text-sm font-semibold">
                        {f.q}
                      </summary>
                      <p className="mt-1 text-sm leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* CTA */}
            <div className="mt-8 mb-4 flex justify-center px-1">
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex w-full max-w-md h-11 items-center justify-center rounded-md text-sm font-semibold shadow-sm transition hover:scale-[1.01]"
                style={{
                  backgroundColor: PALETTE.cta,
                  color: PALETTE.ctaText,
                }}
                aria-label={format(panelT(locale, "cta.aria"), { title })}
              >
                {panelT(locale, "cta.label")}
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* scroll pastel */}
      <style jsx global>{`
        .panel-scroll {
          scrollbar-width: thin;
          scrollbar-color: #a8d1c2 #ffffff;
        }
        .panel-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .panel-scroll::-webkit-scrollbar-track {
          background: #ffffff;
        }
        .panel-scroll::-webkit-scrollbar-thumb {
          background-color: #a8d1c2;
          border-radius: 9999px;
          border: 2px solid #ffffff;
        }
      `}</style>
    </>
  );
};

export default ServiceDetailsPanel;
