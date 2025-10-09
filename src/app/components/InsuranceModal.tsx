"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Copy, Check, ChevronDown } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  phoneHref?: string;
  phoneNumber?: string;
  contactHref?: string;                     // por defecto "/#contact"
  doctors?: string[];                       // opcional; si no, se infiere de doctorPlans
  doctorPlans?: Record<string, string[]>;   // doctor -> planes (fuente única)
};

// ==== DOCTORES Y PLANES (puedes reemplazar por los reales) ====
const DEFAULT_DOCTORS = ["Dra. Martha Acosta", "Dr. Eduardo F. Bolumen"];

const DEFAULT_DOCTOR_PLANS: Record<string, string[]> = {
  "Dra. Martha I. Acosta": [
    "AETNA HEALTHCARE",
    "BETTER HEALTHCARE",
    "BLUE CROSS & BLUE SHIELD",
    "CIGNA HEALTHCARE",
    "CMS - SUNSHINE",
    "FIRTS HEALTHCARE",
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

// Regex compatible (sin \p{}):
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
  // Planes por doctor (si no pasas prop, usa los defaults de arriba)
  const plansByDoctor: Record<string, string[]> =
    doctorPlans && Object.keys(doctorPlans).length ? doctorPlans : DEFAULT_DOCTOR_PLANS;

  // Lista de doctores: prop → keys de doctorPlans → defaults
  const allDoctors = useMemo(() => {
    const base = doctors?.length
      ? doctors
      : (plansByDoctor && Object.keys(plansByDoctor).length
          ? Object.keys(plansByDoctor)
          : DEFAULT_DOCTORS);
    return base.slice().sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [doctors, plansByDoctor]);

  // Unión de todos los planes (sin duplicados)
  const unionAllPlans = useMemo(() => {
    const sets = new Set<string>();
    Object.values(plansByDoctor).forEach((arr) => arr?.forEach((p) => sets.add(p)));
    const merged = Array.from(sets);
    merged.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    return merged;
  }, [plansByDoctor]);

  // estado UI
  const [selectedDoctor, setSelectedDoctor] = useState<string>(""); // "" = Todos los doctores
  const [q, setQ] = useState("");

  // Lista base:
  // - Doctor seleccionado → sus planes
  // - Todos → unión total
  const baseList = useMemo(() => {
    const doctorList = selectedDoctor ? plansByDoctor[selectedDoctor] : undefined;
    const source = selectedDoctor ? (doctorList ?? []) : unionAllPlans;
    const deduped = Array.from(new Set(source));
    deduped.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    return deduped;
  }, [selectedDoctor, plansByDoctor, unionAllPlans]);

  // filtrar por texto
  const filtered = useMemo(() => {
    const n = norm(q.trim());
    return n ? baseList.filter((p) => norm(p).includes(n)) : baseList;
  }, [q, baseList]);

  // foco + Escape
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

  // bloquear scroll del documento
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (open) html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  // teléfono a mostrar
  const displayNumber = phoneNumber || extractFromTelHref(phoneHref) || "(407) 574 - 4848";

  // copiar teléfono
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
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-label="Lista completa de seguros aceptados"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg xl:text-xl font-extrabold text-slate-900">Aseguradoras aceptadas</h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto modal-scroll" style={{ maxHeight: "calc(90vh - 260px)" }}>
            {/* Doctor + Search */}
            <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              {/* Doctor */}
              <div className="lg:col-span-1">
                <label htmlFor="doctor" className="block text-sm font-semibold text-slate-800 mb-1">
                  Doctor
                </label>
                <div className="relative">
                  <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="h-11 w-full pl-3 pr-16 rounded-md border border-slate-300 bg-white text-slate-900 text-sm shadow-sm
                               appearance-none focus:ring-0 focus:border-lime-600"
                  >
                    <option value="">Todos los doctores</option>
                    {allDoctors.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {/* Chevron grande y con espacio a la derecha */}
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-semibold text-slate-800 mb-1">
                  Buscar plan o aseguradora
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ej. Cigna, Aetna..."
                    className="h-11 w-full pl-10 pr-3 rounded-md border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 shadow-sm
                               focus:ring-0 focus:border-lime-600"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 text-slate-600 text-xs sm:text-sm">
              La cobertura puede variar por plan y red. Si no ves tu seguro, contáctanos para verificar.
            </div>

            {/* Lista */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filtered.map((provider, i) => (
                  <div key={`${provider}-${i}`} className="flex items-center gap-3 p-2 rounded-md bg-slate-50">
                    <span className="w-2 h-2 rounded-full bg-lime-700" />
                    <span className="text-sm font-medium text-slate-800">{provider}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500 mb-1">No se encontraron planes</p>
                <p className="text-sm text-slate-400">
                  Verifica la selección de doctor o contacta para confirmar cobertura.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 space-y-4">
            <button
              onClick={handleCopyPhone}
              className="mx-auto flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
            >
              <span className="tabular-nums tracking-wide">{displayNumber}</span>
              {copied ? <Check className="h-4 w-4 text-gray-400" /> : <Copy className="h-4 w-4" />}
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={contactHref}
                onClick={onClose}
                className="bg-lime-900 hover:bg-lime-800 text-white text-sm font-semibold py-2.5 px-6 rounded-sm inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
              >
                <span>Contáctanos</span>
              </a>
              <button
                onClick={onClose}
                className="bg-white text-sm hover:bg-slate-50 text-slate-900 font-semibold py-2.5 px-6 rounded-sm border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos globales para scrollbar clara */}
      <style>{`
        .modal-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
        .modal-scroll::-webkit-scrollbar { width: 10px; }
        .modal-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .modal-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1; border-radius: 8px; border: 2px solid #f1f5f9;
        }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </>
  );
}
