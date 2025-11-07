"use client";

import React, { useEffect, useRef } from "react";
import { X, Stethoscope, Syringe, Shield, Activity, HeartPulse, Eye, Brain } from "lucide-react";

// i18n exclusivo del panel
import {
  type Locale,
  type ServiceId,
  panelT,
  svcStr,
  svcArr,
  svcFaqs,
  format,
} from "../i18n/serviceDetails.i18n";

/* 🎨 Pasteles */
const PASTEL = {
  bg: "#FFFDF8",
  border: "rgba(154, 218, 216, 0.45)",
  chipBg: "rgba(154, 218, 216, 0.22)",
  chipBorder: "rgba(154, 218, 216, 0.5)",
  text: "#001219",
  iconBg: "rgba(154, 218, 216, 0.35)",
  iconBorder: "rgba(154, 218, 216, 0.7)",
  cta: "#0A9396",
};

// 👉 tipo común para los íconos del panel
type ServiceIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// 👉 el panel sabe resolver el icono por id
const PANEL_ICONS: Record<ServiceId, ServiceIcon> = {
  "preventive-medicine": Stethoscope,
  "adult-immunizations": Syringe,
  "minor-illness": Shield,
  "minor-injury": Activity,
  "chronic-disease": HeartPulse,
  "asthma-care": Brain,
  "vision-screening": Eye,
};

/* ==================== Tipos ==================== */
export type ServiceDetailsBasic = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  icon?: ServiceIcon;
  badge?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  service?: ServiceDetailsBasic | null;
  locale: Locale;
};

/* ==================== Scroll lock (global) ==================== */
let __scrollLocks = 0;

function lockScroll() {
  const html = document.documentElement;
  const body = document.body;
  __scrollLocks += 1;
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
    if (lock) {
      lockScroll();
    } else {
      unlockScroll();
    }
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
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: PASTEL.text, opacity: 0.6 }}
      >
        {title}
      </h3>
      <div
        className="mt-2 text-sm leading-relaxed"
        style={{ color: PASTEL.text }}
      >
        {children}
      </div>
    </section>
  );
}

/* ==================== Panel ==================== */
export default function ServiceDetailsPanel({
  open,
  onClose,
  service,
  locale,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const startTrapRef = useRef<HTMLSpanElement>(null);
  const endTrapRef = useRef<HTMLSpanElement>(null);
  const titleId = "svc-panel-title";

  useLockBody(open);

  // enfocar botón al abrir
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // esc para cerrar
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // focus trap
  const onTrapFocus = (which: "start" | "end") => {
    if (!open) return;
    if (which === "start") {
      const prev = endTrapRef.current?.previousElementSibling;
      if (prev instanceof HTMLElement) {
        prev.focus();
      } else {
        closeBtnRef.current?.focus();
      }
    } else {
      closeBtnRef.current?.focus();
    }
  };

  // 👇 si no hay servicio, evitamos calcular todo
  const sid: ServiceId | null = service?.id ? (service.id as ServiceId) : null;

  // ===== textos del i18n usando el id que viene de la tarjeta
  const title =
    (sid && (svcStr(locale, sid, "title") ?? undefined)) ||
    service?.title ||
    panelT(locale, "fallbackTitle");

  const ageRange = sid ? svcStr(locale, sid, "ageRange") : undefined;
  const duration = sid ? svcStr(locale, sid, "duration") : undefined;

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

  // icono: 1) lo mandó la tarjeta 2) lo buscamos por id
  const Icon: ServiceIcon | undefined =
    service?.icon || (sid ? PANEL_ICONS[sid] : undefined);

  return (
    <>
      <div
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-[100] pointer-events-none",
          open ? "block" : "hidden",
        ].join(" ")}
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
            backgroundColor: PASTEL.bg,
            transform: open ? "translateX(0%)" : "translateX(100%)",
            transition: "transform 320ms cubic-bezier(.2,.8,.2,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* sentinela inicio */}
          <span
            tabIndex={0}
            ref={startTrapRef}
            onFocus={() => onTrapFocus("start")}
          />

          {/* header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: PASTEL.border }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {Icon ? (
                <div
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{
                    backgroundColor: PASTEL.iconBg,
                    border: `1px solid ${PASTEL.iconBorder}`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: PASTEL.text }} />
                </div>
              ) : null}
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="truncate text-lg font-bold"
                  style={{ color: PASTEL.text }}
                >
                  {title}
                </h2>

                {/* badge que viene de la tarjeta */}
                {service?.badge ? (
                  <span
                    className="inline-flex mt-1 rounded-full px-2 py-[2px] text-[11px] font-medium"
                    style={{
                      backgroundColor: PASTEL.chipBg,
                      border: `1px solid ${PASTEL.chipBorder}`,
                      color: PASTEL.text,
                    }}
                  >
                    {service.badge}
                  </span>
                ) : null}

                {(ageRange || duration) && (
                  <p
                    className="mt-1 text-xs"
                    style={{ color: `${PASTEL.text}99` }}
                  >
                    {ageRange ?? ""}
                    {ageRange && duration ? " • " : ""}
                    {duration ?? ""}
                  </p>
                )}
              </div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADAD8]"
              aria-label={panelT(locale, "close")}
              type="button"
            >
              <X className="h-5 w-5" style={{ color: PASTEL.text }} />
            </button>
          </div>

          {/* contenido */}
          <div className="h-[calc(100%-56px)] overflow-y-auto p-5 panel-scroll">
            <p
              className="leading-relaxed text-sm"
              style={{ color: PASTEL.text }}
            >
              {summary}
            </p>

            {(recommendedFor.length || service?.tags?.length) ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {recommendedFor.map((tag) => (
                  <span
                    key={`rf-${tag}`}
                    className="rounded-full px-3 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: PASTEL.chipBg,
                      border: `1px solid ${PASTEL.chipBorder}`,
                      color: PASTEL.text,
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {(service?.tags || []).map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="rounded-full px-3 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(0,0,0,0.03)",
                      color: PASTEL.text,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {!!includes.length && (
              <Section title={panelT(locale, "sections.includes")}>
                <ul className="list-disc pl-5 space-y-1">
                  {includes.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!preparation.length && (
              <Section title={panelT(locale, "sections.preparation")}>
                <ul className="list-disc pl-5 space-y-1">
                  {preparation.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!whatToExpect.length && (
              <Section title={panelT(locale, "sections.expect")}>
                <ol className="list-decimal pl-5 space-y-1">
                  {whatToExpect.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </Section>
            )}

            {!!followUp.length && (
              <Section title={panelT(locale, "sections.followUp")}>
                <ul className="list-disc pl-5 space-y-1">
                  {followUp.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Section>
            )}

            {!!risks.length && (
              <Section title={panelT(locale, "sections.risks")}>
                <ul className="list-disc pl-5 space-y-1">
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
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${f.q}-${i}`}
                      className="rounded-md border border-[#F0E3CE] bg-white/60 p-3"
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
            <div className="mt-8 mb-6 flex justify-center px-2">
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex w-full max-w-md items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm"
                style={{ backgroundColor: PASTEL.cta, color: "#FFFFFF" }}
                aria-label={format(panelT(locale, "cta.aria"), { title })}
              >
                {panelT(locale, "cta.label")}
              </a>
            </div>
          </div>

          {/* sentinela final */}
          <span
            tabIndex={0}
            ref={endTrapRef}
            onFocus={() => onTrapFocus("end")}
          />
        </section>
      </div>

      {/* scrollbar pastel */}
      <style jsx global>{`
        .panel-scroll {
          color-scheme: light;
          scrollbar-width: thin;
          scrollbar-color: rgba(154, 218, 216, 0.6) transparent;
        }
        .panel-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .panel-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(154, 218, 216, 0.6);
          border-radius: 8px;
          border: 2px solid transparent;
        }
      `}</style>
    </>
  );
}
