"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Copy, Check } from "lucide-react";
import { PALETTE, BRAND } from "@/app/ui/palette";

export type InsuranceDoctorModalProps = {
  open: boolean;
  onClose: () => void;
  providerId: string;
  providerName?: string;
  phoneHref?: string;
  phoneNumber?: string;
  contactHref?: string;
  plansById?: Record<string, string[]>;
};

/* ================= Helpers ================= */

const slug = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripInitials = (s: string) =>
  s.replace(/-[a-z]-/g, "-").replace(/-{2,}/g, "-");

const INSURANCE_BY_ID_DEFAULT: Record<string, string[]> = {
  "Dr. Jaime A. Acosta": [
    "OSCAR",
    "CIGNA",
    "SUNSHINE HEALTH",
    "HUMANA MEDICAID",
    "AETNA",
    "UNITED HEALTH CARE",
    "HEALTH FIRST",
  ],
  "Dr. Juan Ortiz": [
    "OSCAR",
    "CIGNA",
    "SUNSHINE HEALTH",
    "HUMANA MEDICAID",
    "AETNA",
    "UNITED HEALTH CARE",
    "HEALTH FIRST",
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

  // focus y escape
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

  // bloquear scroll fondo
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

  // construir lista de planes del doctor
  const plans = useMemo(() => {
    const src = plansById ?? INSURANCE_BY_ID_DEFAULT;
    const slugIndex = new Map<string, string[]>();
    for (const [key, arr] of Object.entries(src)) {
      slugIndex.set(stripInitials(slug(key)), arr);
    }

    const candidates = new Set<string>();
    if (providerId) candidates.add(stripInitials(slug(providerId)));
    if (providerName) candidates.add(stripInitials(slug(providerName)));

    for (const c of candidates) {
      if (slugIndex.has(c)) {
        const arr = Array.from(new Set(slugIndex.get(c)!));
        return arr.sort((a, b) => a.localeCompare(b, "es"));
      }
    }

    return [];
  }, [providerId, providerName, plansById]);

  // filtro por query
  const filtered = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const n = norm(q);
    return n ? plans.filter((p) => norm(p).includes(n)) : plans;
  }, [q, plans]);

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
        style={{ backgroundColor: `${BRAND.text}99` }} // overlay igual que el otro
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          style={{ backgroundColor: BRAND.bg }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: `${BRAND.text}11` }}
          >
            <h3
              className="text-lg xl:text-xl font-extrabold"
              style={{ color: BRAND.text }}
            >
              Aseguradoras aceptadas{" "}
              {providerName && (
                <>
                  por{" "}
                  <span style={{ color: BRAND.accent }}>{providerName}</span>
                </>
              )}
            </h3>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-sm transition-colors"
              style={{ color: BRAND.text }}
              aria-label="Cerrar modal"
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
                className="block text-sm font-semibold mb-1"
                style={{ color: BRAND.text }}
              >
                Buscar plan o aseguradora
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search
                    className="h-5 w-5"
                    style={{ color: `${BRAND.text}80` }}
                  />
                </div>
                <input
                  id="search-insurance"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ej. Cigna, Aetna..."
                  className="h-11 w-full pl-10 pr-3 rounded-md border text-sm shadow-sm focus:ring-0"
                  style={{
                    backgroundColor: BRAND.bg,
                    borderColor: `${BRAND.text}11`,
                    color: BRAND.text,
                  }}
                />
              </div>
            </div>

            <div
              className="mb-4 text-xs sm:text-sm"
              style={{ color: `${BRAND.text}99` }}
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
                      backgroundColor: `${PALETTE[0].base}18`,
                      color: BRAND.text,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PALETTE[0].back }}
                    />
                    <span className="text-sm font-medium">{provider}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p style={{ color: `${BRAND.text}99` }}>
                  No se encontraron planes
                </p>
                <p className="text-sm" style={{ color: `${BRAND.text}66` }}>
                  Prueba otra búsqueda o contáctanos para confirmar cobertura.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-5 space-y-4 border-t"
            style={{
              backgroundColor: BRAND.bg,
              borderColor: `${BRAND.text}11`,
            }}
          >
            <button
              onClick={handleCopyPhone}
              className="mx-auto flex items-center gap-2 text-sm font-medium"
              style={{ color: BRAND.text }}
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
                className="text-sm font-semibold py-2.5 px-6 rounded-sm inline-flex items-center justify-center gap-2 transition-all hover:translate-y-[1px]"
                style={{
                  backgroundColor: PALETTE[0].base,
                  color: BRAND.text,
                  border: `1px solid ${PALETTE[0].back}`,
                }}
              >
                Solicitar cita
              </a>
              <button
                onClick={onClose}
                className="text-sm font-semibold py-2.5 px-6 rounded-sm border transition-all hover:translate-y-[1px]"
                style={{
                    backgroundColor: BRAND.bg,
                    color: BRAND.text,
                    borderColor: `${BRAND.text}11`,
                  }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar con mismo tema */}
      <style>{`
        .modal-scroll { scrollbar-width: thin; scrollbar-color: ${PALETTE[1].back} ${BRAND.bg}; }
        .modal-scroll::-webkit-scrollbar { width: 10px; }
        .modal-scroll::-webkit-scrollbar-track { background: ${BRAND.bg}; }
        .modal-scroll::-webkit-scrollbar-thumb {
          background-color: ${PALETTE[1].back};
          border-radius: 8px;
          border: 2px solid ${BRAND.bg};
        }
        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background-color: ${PALETTE[1].back};
        }
      `}</style>
    </>
  );
};

export default InsuranceDoctorModal;
