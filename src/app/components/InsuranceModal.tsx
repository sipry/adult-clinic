"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Copy, Check, ChevronDown } from "lucide-react";

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

type Props = {
  open: boolean;
  onClose: () => void;
  phoneHref?: string;
  phoneNumber?: string;
  contactHref?: string;
  doctors?: string[];
  doctorPlans?: Record<string, string[]>;
};

const DEFAULT_DOCTORS = ["Dra. Martha Acosta", "Dr. Eduardo F. Bolumen"];

const DEFAULT_DOCTOR_PLANS: Record<string, string[]> = {
  "Dra. Martha I. Acosta": [
    "AETNA HEALTHCARE",
    "BETTER HEALTHCARE",
    "BLUE CROSS & BLUE SHIELD",
    "CIGNA HEALTHCARE",
    "CMS - SUNSHINE",
    "FIRST HEALTHCARE",
    "HEALTH FIRST",
    "HUMANA HEALTHCARE",
    "OSCAR HEALTHCARE",
    "SIMPLY HEALTHCARE",
    "SUNSHINE HEALTHCARE",
    "UNITED HEALTHCARE",
  ],
  "Dr. Eduardo F. Bolumen": [
    "CMS - SUNSHINE",
    "HUMANA HEALTHCARE",
    "OSCAR HEALTHCARE",
    "SIMPLY HEALTHCARE",
    "SUNSHINE HEALTHCARE",
    "UNITED HEALTHCARE",
  ],
};

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function extractFromTelHref(href?: string) {
  if (!href) return undefined;
  const m = href.match(/^tel:(.+)$/i);
  return m ? m[1].trim() : undefined;
}

export default function InsuranceModal({
  open,
  onClose,
  phoneHref,
  phoneNumber,
  contactHref = "/#contact",
  doctors,
  doctorPlans,
}: Props) {
  const plansByDoctor: Record<string, string[]> =
    doctorPlans && Object.keys(doctorPlans).length
      ? doctorPlans
      : DEFAULT_DOCTOR_PLANS;

  const allDoctors = useMemo(() => {
    const base =
      doctors?.length
        ? doctors
        : Object.keys(plansByDoctor).length
        ? Object.keys(plansByDoctor)
        : DEFAULT_DOCTORS;
    return base.slice().sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [doctors, plansByDoctor]);

  const unionAllPlans = useMemo(() => {
    const sets = new Set<string>();
    Object.values(plansByDoctor).forEach((arr) =>
      arr?.forEach((p) => sets.add(p))
    );
    const merged = Array.from(sets);
    merged.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    return merged;
  }, [plansByDoctor]);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [q, setQ] = useState("");
  const baseList = useMemo(() => {
    const doctorList = selectedDoctor ? plansByDoctor[selectedDoctor] : undefined;
    const source = selectedDoctor ? doctorList ?? [] : unionAllPlans;
    const deduped = Array.from(new Set(source));
    deduped.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    return deduped;
  }, [selectedDoctor, plansByDoctor, unionAllPlans]);

  const filtered = useMemo(() => {
    const n = norm(q.trim());
    return n ? baseList.filter((p) => norm(p).includes(n)) : baseList;
  }, [q, baseList]);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (open) html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  const displayNumber =
    phoneNumber || extractFromTelHref(phoneHref) || "(407) 574 - 4848";

  const [copied, setCopied] = useState(false);
  const handleCopyPhone = async () => {
    if (!displayNumber) return;
    try {
      await navigator.clipboard.writeText(displayNumber);
    } catch {
      const tmp = document.createElement("textarea");
      tmp.value = displayNumber;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        style={{ backgroundColor: `${PALETTE.dark}99` }}
        role="dialog"
        aria-modal="true"
        aria-label="Lista completa de seguros aceptados"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          style={{ backgroundColor: PALETTE.cream }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: `${PALETTE.dark}33` }}
          >
            <h3
              className="text-lg xl:text-xl font-extrabold"
              style={{ color: PALETTE.dark }}
            >
              Aseguradoras aceptadas
            </h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-sm transition-colors"
              style={{ color: PALETTE.dark }}
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div
            className="px-6 py-5 overflow-y-auto modal-scroll"
            style={{ maxHeight: "calc(90vh - 260px)" }}
          >
            <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              {/* Doctor */}
              <div className="lg:col-span-1">
                <label
                  htmlFor="doctor"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: PALETTE.dark }}
                >
                  Doctor
                </label>
                <div className="relative">
                  <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="h-11 w-full pl-3 pr-16 rounded-md border text-sm shadow-sm appearance-none focus:ring-0"
                    style={{
                      backgroundColor: PALETTE.cream,
                      borderColor: `${PALETTE.dark}33`,
                      color: PALETTE.dark,
                    }}
                  >
                    <option value="">Todos los doctores</option>
                    {allDoctors.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5"
                    style={{ color: `${PALETTE.dark}80` }}
                  />
                </div>
              </div>

              {/* Search */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="search"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: PALETTE.dark }}
                >
                  Buscar plan o aseguradora
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5" style={{ color: `${PALETTE.dark}80` }} />
                  </div>
                  <input
                    id="search"
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ej. Cigna, Aetna..."
                    className="h-11 w-full pl-10 pr-3 rounded-md border text-sm shadow-sm focus:ring-0"
                    style={{
                      backgroundColor: PALETTE.cream,
                      borderColor: `${PALETTE.dark}33`,
                      color: PALETTE.dark,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="mb-4 text-xs sm:text-sm"
              style={{ color: `${PALETTE.dark}aa` }}
            >
              La cobertura puede variar por plan y red. Si no ves tu seguro,
              contáctanos para verificar.
            </div>

            {/* Lista */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filtered.map((provider, i) => (
                  <div
                    key={`${provider}-${i}`}
                    className="flex items-center gap-3 p-2 rounded-md"
                    style={{
                      backgroundColor: `${PALETTE.olive}10`,
                      color: PALETTE.dark,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PALETTE.moss }}
                    />
                    <span className="text-sm font-medium">{provider}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p style={{ color: `${PALETTE.dark}99` }}>No se encontraron planes</p>
                <p
                  className="text-sm"
                  style={{ color: `${PALETTE.dark}66` }}
                >
                  Verifica la selección de doctor o contacta para confirmar cobertura.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-5 border-t space-y-4"
            style={{
              backgroundColor: `${PALETTE.cream}`,
              borderColor: `${PALETTE.dark}33`,
            }}
          >
            <button
              onClick={handleCopyPhone}
              className="mx-auto flex items-center gap-2 text-sm font-medium"
              style={{ color: PALETTE.dark }}
            >
              <span className="tabular-nums tracking-wide">
                {displayNumber}
              </span>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={contactHref}
                onClick={onClose}
                className="text-sm font-semibold py-2.5 px-6 rounded-sm inline-flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: PALETTE.olive,
                  color: PALETTE.cream,
                }}
              >
                Contáctanos
              </a>
              <button
                onClick={onClose}
                className="text-sm font-semibold py-2.5 px-6 rounded-sm border transition-all"
                style={{
                  backgroundColor: PALETTE.cream,
                  color: PALETTE.dark,
                  borderColor: `${PALETTE.dark}33`,
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <style>{`
        .modal-scroll { scrollbar-width: thin; scrollbar-color: ${PALETTE.moss} ${PALETTE.cream}; }
        .modal-scroll::-webkit-scrollbar { width: 10px; }
        .modal-scroll::-webkit-scrollbar-track { background: ${PALETTE.cream}; }
        .modal-scroll::-webkit-scrollbar-thumb {
          background-color: ${PALETTE.moss};
          border-radius: 8px;
          border: 2px solid ${PALETTE.cream};
        }
        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background-color: ${PALETTE.olive};
        }
      `}</style>
    </>
  );
}
