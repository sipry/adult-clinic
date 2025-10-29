"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Copy, Check } from "lucide-react";

export type InsuranceDoctorModalProps = {
  open: boolean;
  onClose: () => void;

  /** ID estable del provider, p.ej. "dr-eduardo-bolumen" */
  providerId: string;

  /** (Opcional) Nombre solo para mostrar en el header */
  providerName?: string;

  /** (Opcional) Teléfono en formato tel: p.ej. "tel:+14075744848" */
  phoneHref?: string;

  /** (Opcional) Número a mostrar si no usas phoneHref */
  phoneNumber?: string;

  /** (Opcional) CTA de contacto */
  contactHref?: string;

  /** (Opcional) Override para inyectar mapping por ID desde afuera */
  plansById?: Record<string, string[]>;
};

/* ================= Helpers ================= */

const slug = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")     // no alfanum -> guiones
    .replace(/^-+|-+$/g, "");        // trim

/** Quita iniciales tipo "-f-" en un slug:
 *  "dr-eduardo-f-bolumen" -> "dr-eduardo-bolumen"
 */
const stripInitials = (s: string) => s.replace(/-[a-z]-/g, "-").replace(/-{2,}/g, "-");

/* =============== DATA por defecto (ajusta tus IDs reales) =============== */

const INSURANCE_BY_ID_DEFAULT: Record<string, string[]> = {
  "Dr. Jaime A. Acosta": [
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
  "Dr. Juan Ortiz Guevara": [
    "CMS - SUNSHINE",
    "HUMANA HEALTHCARE",
    "OSCAR HEALTHCARE",
    "SIMPLY HEALTHCARE",
    "SUNSHINE HEALTHCARE",
    "UNITED HEALTHCARE",
  ],
};

/* ===================== Componente ===================== */

const InsuranceDoctorModal: React.FC<InsuranceDoctorModalProps> = ({
  open,
  onClose,
  providerId,
  providerName,
  phoneHref,
  phoneNumber,
  contactHref = "/#contact",
  plansById,
}) => {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Foco inicial + tecla Escape
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

  // Bloquear scroll del documento
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (open) html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  const displayNumber =
    phoneNumber ||
    (phoneHref && /^tel:(.+)$/i.exec(phoneHref)?.[1]?.trim()) ||
    "(407) 574 - 4848";

  // Resolver planes: exacto → startsWith en ambos sentidos → includes en ambos sentidos
  const plans = useMemo(() => {
    const src = plansById ?? INSURANCE_BY_ID_DEFAULT;

    // Índice por slug (sin iniciales)
    const slugIndex = new Map<string, string[]>(); // slugKey -> planes
    for (const [key, arr] of Object.entries(src)) {
      const kSlug = stripInitials(slug(key));
      slugIndex.set(kSlug, arr);
    }

    // Candidatos desde props
    const candidates = new Set<string>();
    if (providerId) {
      candidates.add(providerId);
      candidates.add(slug(providerId));
      candidates.add(stripInitials(slug(providerId)));
    }
    if (providerName) {
      candidates.add(slug(providerName));
      candidates.add(stripInitials(slug(providerName)));
    }

    // 1) exact slug
    for (const c of candidates) {
      const cSlug = stripInitials(slug(c));
      if (slugIndex.has(cSlug)) {
        const arr = slugIndex.get(cSlug)!;
        const dedup = Array.from(new Set(arr));
        dedup.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
        return dedup;
      }
    }

    const idSlug = stripInitials(slug(providerId || ""));
    const nameSlug = stripInitials(slug(providerName || ""));
    const keys = Array.from(slugIndex.keys());

    // 2) strong match (startsWith) en ambos sentidos
    const strong =
      keys.find(
        (k) =>
          (idSlug && (k.startsWith(idSlug) || idSlug.startsWith(k))) ||
          (nameSlug && (k.startsWith(nameSlug) || nameSlug.startsWith(k)))
      ) ?? null;

    if (strong) {
      const arr = slugIndex.get(strong)!;
      const dedup = Array.from(new Set(arr));
      dedup.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
      return dedup;
    }

    // 3) contains en ambos sentidos
    const maybe =
      keys.find(
        (k) =>
          (idSlug && (k.includes(idSlug) || idSlug.includes(k))) ||
          (nameSlug && (k.includes(nameSlug) || nameSlug.includes(k)))
      ) ?? null;

    if (maybe) {
      const arr = slugIndex.get(maybe)!;
      const dedup = Array.from(new Set(arr));
      dedup.sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
      return dedup;
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn("[InsuranceDoctorModal] No plans found for", {
        providerId,
        providerName,
        triedCandidates: Array.from(candidates),
        availableKeys: keys,
        idSlug,
        nameSlug,
      });
    }
    return [];
  }, [providerId, providerName, plansById]);

  // Filtrado por texto (ignora tildes)
  const filtered = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const n = norm(q);
    return n ? plans.filter((p) => norm(p).includes(n)) : plans;
  }, [q, plans]);

  // Copiar teléfono
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
        aria-label={`Insurance accepted${providerName ? " by " + providerName : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg xl:text-xl font-extrabold text-slate-900">
              Insurance accepted{" "}
              {providerName ? (
                <>
                  by <span className="text-lime-900">{providerName}</span>
                </>
              ) : null}
            </h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div
            className="px-6 py-5 overflow-y-auto modal-scroll"
            style={{ maxHeight: "calc(90vh - 220px)" }}
          >
            {/* Search */}
            <div className="mb-4">
              <label
                htmlFor="search-insurance"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Search plan or insurer
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="search-insurance"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g., Cigna, Aetna..."
                  className="h-11 w-full pl-10 pr-3 rounded-md border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 shadow-sm
                             focus:ring-0 focus:border-lime-600"
                />
              </div>
            </div>

            <div className="mb-4 text-slate-600 text-xs sm:text-sm">
              Coverage may vary by plan and network. If you don’t see your plan, please contact us to verify.
            </div>

            {/* List */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filtered.map((provider, i) => (
                  <div
                    key={`${provider}-${i}`}
                    className="flex items-center gap-3 p-2 rounded-md bg-slate-50"
                  >
                    <span className="w-2 h-2 rounded-full bg-lime-700" />
                    <span className="text-sm font-medium text-slate-800">
                      {provider}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500 mb-1">No plans found</p>
                <p className="text-sm text-slate-400">
                  Try another keyword or contact us to confirm coverage.
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
                Request an Apointment
              </a>
              <button
                onClick={onClose}
                className="bg-white text-sm hover:bg-slate-50 text-slate-900 font-semibold py-2.5 px-6 rounded-sm border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar styles */}
      <style>{`
        .modal-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
        .modal-scroll::-webkit-scrollbar { width: 10px; }
        .modal-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .modal-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 8px; border: 2px solid #f1f5f9; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </>
  );
};

export default InsuranceDoctorModal;
