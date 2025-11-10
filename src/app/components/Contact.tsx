"use client";

import React from "react";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Printer,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

/* 🎨 Paleta tomada de la sección de servicios */
const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" },
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" },
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" },
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" },
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" },
  { base: "#E48C7A", back: "#D67463", text: "#001219" },
  { base: "#E57B76", back: "#D66A65", text: "#001219" },
  { base: "#DC767B", back: "#C85D61", text: "#001219" },
];

/* 🎯 Colores de marca que ya usabas en ServicesRail */
const BRAND = {
  bg: "#FFFFFF",
  heading: "#001219",
  muted: "#005F73",
  accent: "#0A9396",
  cta: "#BB3E03",
  ctaBorder: "#CA6702",
  borderSoft: "rgba(0, 18, 25, 0.08)",
};

/* ---------- Motion utils ---------- */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useInOutViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit
): boolean {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    let io: IntersectionObserver | null = null;
    let raf = 0;

    const visibleNow = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
    };

    const check = () => {
      raf = 0;
      setInView(visibleNow());
    };

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) =>
          ents.forEach((e) =>
            setInView(e.isIntersecting || e.intersectionRatio > 0)
          ),
        options ?? { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    raf = window.requestAnimationFrame(check);

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (io) io.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, options?.threshold, options?.rootMargin]);

  return inView;
}

/* ---------- Reveal ---------- */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}> = ({
  children,
  className,
  delay = 0,
  duration = 600,
  y = 16,
  x = 0,
  scale = 1,
  once = true,
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInOutViewport(ref, { threshold, rootMargin });
    const [shown, setShown] = React.useState(false);
    const reduce = usePrefersReducedMotion();

    React.useEffect(() => {
      if (inView) setShown(true);
      else if (!once) setShown(false);
    }, [inView, once]);

    const style: React.CSSProperties = React.useMemo(() => {
      if (reduce) return {};
      if (!shown) {
        return {
          opacity: 0,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          willChange: "opacity, transform",
        };
      }
      return {};
    }, [reduce, shown, x, y, scale, duration, delay]);

    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  };

/* ---------- Tipos ---------- */
type FormState = {
  patientName: string;
  email: string;
  phone: string;
  reason: string;
  appointmentType: "nueva" | "seguimiento";
  doctor: string;
  message: string;
  agree: boolean;
  company?: string;
};

const MAX_CHARS = 800;
const DOCTORS: string[] = ["Dr. Jaime Acosta", "Dr. Juan Ortiz Diaz"];

/* ---------- Web3Forms ---------- */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// ⚠️ Usa tu Access Key real en .env.local -> NEXT_PUBLIC_WEB3FORMS_KEY
const WEB3FORMS_KEY = "5339a63d-c8fc-445e-81df-7a853d7d570c";

const ContactSplitWithForm: React.FC = () => {
  const { t } = useTranslation();

  const ADDRESS = "201 Hilda St Suite # 10, Kissimmee, FL 34741";
  const EMAIL = "info@yourhealthadult.com";
  const PHONE_DISPLAY = "(407) 554-5707";
  const PHONE_TEL = "+407554-5707";
  const FAX_DISPLAY = "(321) 900-4411";
  const FAX_TEL = "+321900-4411";

  const mapQuery = React.useMemo(() => encodeURIComponent(ADDRESS), [ADDRESS]);
  const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const FACEBOOK_URL = "https://www.facebook.com/";
  const INSTAGRAM_URL = "https://www.instagram.com/";

  const sectionRef = React.useRef<HTMLElement>(null);
  useInOutViewport(sectionRef, { threshold: 0.2 }); // mantenemos el hook por si lo usas para otra cosa

  /* ---------- Estado del formulario ---------- */
  const [form, setForm] = React.useState<FormState>({
    patientName: "",
    email: "",
    phone: "",
    reason: "",
    appointmentType: "nueva",
    doctor: "",
    message: "",
    agree: true,
    company: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [chars, setChars] = React.useState(0);

  const onChange = React.useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { name } = e.target;
      let value: string | boolean;
      if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
        value = e.target.checked;
      } else {
        value = e.target.value;
      }
      setForm((f) => ({ ...f, [name]: value as never }));
      if (name === "message" && typeof value === "string")
        setChars(value.length);
    },
    []
  );

  const validate = React.useCallback((): string | null => {
    if (!form.patientName.trim()) return t("contact.form.errors.patientName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return t("contact.form.errors.email");
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10)
      return t("contact.form.errors.phoneRequired");
    if (!form.reason) return t("contact.form.errors.reason");
    if (form.company) return t("contact.form.errors.bot");
    if (!WEB3FORMS_KEY) return "Missing Web3Forms Access Key";
    return null;
  }, [form, t]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSuccess(null);
      setError(null);
      const v = validate();
      if (v) {
        setError(v);
        return;
      }

      try {
        setSubmitting(true);
        const fd = new FormData();
        fd.append("access_key", WEB3FORMS_KEY);
        fd.append("subject", "Website contact — Your Health Adult Care");
        fd.append("replyto", form.email);
        fd.append("from_name", form.patientName);

        // Campos del cuerpo
        fd.append("patientName", form.patientName);
        fd.append("email", form.email);
        fd.append("phone", form.phone);
        fd.append("reason", form.reason);
        fd.append("appointmentType", form.appointmentType);
        fd.append("doctor", form.doctor);
        fd.append("message", form.message);

        // Honeypot
        fd.append("botcheck", form.company ?? "");

        const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.message || "sendError");

        setSuccess(t("contact.form.success"));
        setForm({
          patientName: "",
          email: "",
          phone: "",
          reason: "",
          appointmentType: "nueva",
          doctor: "",
          message: "",
          agree: true,
          company: "",
        });
        setChars(0);
      } catch (err: unknown) {
        console.error(err);
        const msg =
          err instanceof Error ? err.message : t("contact.form.errors.send");
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, t, validate]
  );

  const resetSuccess = React.useCallback(() => {
    setSuccess(null);
    setError(null);
  }, []);

  // Tomamos un par de colores del array pastel
  const softSurface = `${PALETTE[1].base}dd`; // fondo form
  const softBorder = `${PALETTE[1].back}66`; // borde form
  const asideSurface = `${PALETTE[0].base}22`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative pb-20 pt-16 sm:pt-20 scroll-mt-10 overflow-x-clip overflow-hidden"
      style={{ backgroundColor: BRAND.bg }}
    >
      {/* Header */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Reveal y={8} delay={0}>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: BRAND.accent }}
            >
              {t("contact.pretitle")}
            </p>
          </Reveal>
          <Reveal y={8}>
            <h2
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
              style={{ color: BRAND.heading }}
            >
              {t("contact.title")}
            </h2>
          </Reveal>
          <Reveal y={10} delay={80}>
            <p
              className="mt-2 text-sm max-w-2xl mx-auto"
              style={{ color: `${BRAND.muted}` }}
            >
              {t("contact.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Split grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form or Success Panel */}
            <Reveal y={12} className="lg:col-span-2">
              <div
                className="rounded-2xl shadow-md p-6 md:p-8 backdrop-blur-sm border"
                style={{
                  backgroundColor: softSurface,
                  borderColor: softBorder,
                }}
              >
                {/* Éxito */}
                {success ? (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center max-w-md">
                      <div
                        className="mx-auto h-16 w-16 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${PALETTE[0].base}44` }}
                      >
                        <CheckCircle2
                          className="h-9 w-9"
                          style={{ color: BRAND.accent }}
                          aria-hidden="true"
                        />
                      </div>
                      <h3
                        className="mt-4 text-2xl font-semibold"
                        style={{ color: BRAND.heading }}
                      >
                        {t("contact.form.done.title")}
                      </h3>
                      <p
                        className="mt-2 text-sm"
                        style={{ color: `${BRAND.heading}cc` }}
                      >
                        {t("contact.form.done.subtitle")}
                      </p>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          type="button"
                          onClick={resetSuccess}
                          className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-md hover:scale-[1.01] transition"
                          style={{
                            backgroundColor: BRAND.accent,
                            color: "#FFFFFF",
                          }}
                        >
                          <Send className="h-4 w-4" aria-hidden="true" />
                          {t("contact.form.done.actions.new")}
                        </button>
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-white/70"
                          style={{
                            color: BRAND.heading,
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          {t("contact.form.done.actions.call")}
                        </a>
                      </div>

                      <div
                        className="mt-6 text-xs"
                        style={{ color: `${BRAND.heading}99` }}
                      >
                        <Mail className="inline h-3.5 w-3.5 mr-1" />
                        {EMAIL}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: BRAND.heading }}
                    >
                      {t("contact.form.title")}
                    </h3>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: `${BRAND.heading}cc` }}
                    >
                      {t("contact.form.subtitle")}
                    </p>

                    {/* Error */}
                    {error && (
                      <div
                        className="mt-4 flex items-start gap-2 rounded-md border p-3 text-sm"
                        style={{
                          borderColor: "rgba(187, 62, 3, 0.25)",
                          backgroundColor: "rgba(187, 62, 3, 0.08)",
                          color: "#BB3E03",
                        }}
                        role="alert"
                      >
                        <AlertCircle
                          className="h-5 w-5 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* FORM */}
                    <form
                      onSubmit={onSubmit}
                      noValidate
                      className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="company"
                        value={form.company ?? ""}
                        onChange={onChange}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />

                      {/* Nombre del paciente */}
                      <div className="col-span-1">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.patientName.label")}
                        </label>
                        <input
                          id="patientName"
                          name="patientName"
                          type="text"
                          value={form.patientName}
                          onChange={onChange}
                          required
                          autoComplete="name"
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                          placeholder={t(
                            "contact.form.fields.patientName.placeholder"
                          )}
                        />
                      </div>

                      {/* Email */}
                      <div className="col-span-1">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.email.label")}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={onChange}
                          required
                          autoComplete="email"
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                          placeholder={t(
                            "contact.form.fields.email.placeholder"
                          )}
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="col-span-1">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.phone.label")}
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={onChange}
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                          placeholder={t(
                            "contact.form.fields.phone.placeholder"
                          )}
                        />
                      </div>

                      {/* Motivo */}
                      <div className="col-span-1">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.reason.label")}
                        </label>
                        <select
                          id="reason"
                          name="reason"
                          value={form.reason}
                          onChange={onChange}
                          required
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                        >
                          <option value="" disabled>
                            {t("contact.form.fields.reason.options.select")}
                          </option>
                          <option value="well visit">
                            {t("contact.form.fields.reason.options.wellvisit")}
                          </option>
                          <option value="sick visit">
                            {t("contact.form.fields.reason.options.sickvisit")}
                          </option>
                          <option value="vaccine">
                            {t("contact.form.fields.reason.options.vaccine")}
                          </option>
                          <option value="other">
                            {t("contact.form.fields.reason.options.other")}
                          </option>
                        </select>
                      </div>

                      {/* Tipo de cita */}
                      <fieldset className="col-span-1 self-end">
                        <legend
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.appointmentType.label")}
                        </legend>
                        <div
                          className="mt-2 flex flex-wrap gap-4"
                          role="radiogroup"
                          aria-label={t(
                            "contact.form.fields.appointmentType.aria"
                          )}
                        >
                          <label
                            className="inline-flex items-center gap-2 text-sm"
                            style={{ color: BRAND.heading }}
                          >
                            <input
                              type="radio"
                              name="appointmentType"
                              value="nueva"
                              checked={form.appointmentType === "nueva"}
                              onChange={onChange}
                              className="h-4 w-4 border rounded"
                              style={{ accentColor: BRAND.accent }}
                            />
                            {t(
                              "contact.form.fields.appointmentType.options.new"
                            )}
                          </label>
                          <label
                            className="inline-flex items-center gap-2 text-sm"
                            style={{ color: BRAND.heading }}
                          >
                            <input
                              type="radio"
                              name="appointmentType"
                              value="seguimiento"
                              checked={form.appointmentType === "seguimiento"}
                              onChange={onChange}
                              className="h-4 w-4 border rounded"
                              style={{ accentColor: BRAND.accent }}
                            />
                            {t(
                              "contact.form.fields.appointmentType.options.followup"
                            )}
                          </label>
                        </div>
                      </fieldset>

                      {/* Doctor preferido */}
                      <div className="col-span-1 md:col-span-2">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.doctor.label")}{" "}
                          <span style={{ color: `${BRAND.heading}66` }}>
                            ({t("contact.form.fields.doctor.optional")})
                          </span>
                        </label>
                        <select
                          id="doctor"
                          name="doctor"
                          value={form.doctor}
                          onChange={onChange}
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                          aria-describedby="doctor-help"
                        >
                          <option value="">
                            {t("contact.form.fields.doctor.placeholder")}
                          </option>
                          {DOCTORS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <p
                          id="doctor-help"
                          className="mt-1 text-xs"
                          style={{ color: `${BRAND.heading}80` }}
                        >
                          {t("contact.form.fields.doctor.help")}
                        </p>
                      </div>

                      {/* Mensaje */}
                      <div className="md:col-span-2">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: BRAND.heading }}
                        >
                          {t("contact.form.fields.message.label")}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={onChange}
                          rows={6}
                          maxLength={MAX_CHARS}
                          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A9396]"
                          style={{
                            borderColor: `${BRAND.heading}11`,
                            backgroundColor: "#FFFFFF",
                            color: BRAND.heading,
                          }}
                          placeholder={t(
                            "contact.form.fields.message.placeholder"
                          )}
                        />
                        <div
                          className="mt-1 text-[11px] text-right"
                          style={{ color: `${BRAND.heading}66` }}
                        >
                          {chars}/{MAX_CHARS}
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: BRAND.accent,
                            color: "#FFFFFF",
                            border: `1px solid ${BRAND.ctaBorder}44`,
                          }}
                          aria-busy={submitting}
                          aria-label={
                            submitting
                              ? t("contact.form.buttons.sending")
                              : t("contact.form.buttons.submit")
                          }
                        >
                          <Send className="h-4 w-4" aria-hidden="true" />
                          {submitting
                            ? t("contact.form.buttons.sending")
                            : t("contact.form.buttons.submit")}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </Reveal>

            {/* Right: Info card (sticky) */}
            <Reveal y={12}>
              <aside
                className="lg:sticky lg:top-24 h-full rounded-2xl p-6 shadow-sm border"
                style={{
                  backgroundColor: asideSurface,
                  borderColor: `${BRAND.heading}11`,
                }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: BRAND.heading }}
                >
                  {t("contact.info.title")}
                </h3>

                <div
                  className="mt-4 space-y-4 text-sm"
                  style={{ color: BRAND.heading }}
                >
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 hover:opacity-80"
                    title={t("contact.address.openMap")}
                    aria-label={t("contact.address.openMap")}
                  >
                    <MapPin
                      className="h-4 w-4 shrink-0 mt-0.5"
                      style={{ color: BRAND.accent }}
                      aria-hidden="true"
                    />
                    <span>
                      201 Hilda St Suite # 10
                      <br />
                      Kissimmee, FL 34741
                    </span>
                  </a>

                  <div className="flex items-start gap-2">
                    <Mail
                      className="h-4 w-4 mt-0.5"
                      style={{ color: BRAND.accent }}
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${EMAIL}`}
                      className="hover:opacity-80 break-all"
                    >
                      {EMAIL}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone
                      className="h-4 w-4"
                      style={{ color: BRAND.accent }}
                      aria-hidden="true"
                    />
                    <a href={`tel:${PHONE_TEL}`} className="hover:opacity-80">
                      {PHONE_DISPLAY}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Printer
                      className="h-4 w-4"
                      style={{ color: BRAND.accent }}
                      aria-hidden="true"
                    />
                    <a href={`tel:${FAX_TEL}`} className="hover:opacity-80">
                      {t("contact.info.fax")}: {FAX_DISPLAY}
                    </a>
                  </div>

                  <div
                    className="pt-2 border-t"
                    style={{ borderColor: `${BRAND.heading}11` }}
                  />

                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: `${BRAND.heading}66` }}
                    >
                      {t("contact.hours.label")}
                    </p>
                    <ul className="mt-2 text-sm space-y-1">
                      <li className="flex gap-2">
                        <Clock
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: BRAND.accent }}
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-medium">
                            {t("contact.hours.weekdays")}
                          </span>
                          &nbsp;8:00am – 5:00pm
                        </span>
                      </li>
                      <li>
                        <span className="font-medium">
                          {t("contact.hours.weekend")}
                        </span>
                        &nbsp;{t("contact.hours.closed")}
                      </li>
                    </ul>
                  </div>

                  <div
                    className="pt-3 border-t flex justify-center gap-3"
                    style={{ borderColor: `${BRAND.heading}11` }}
                  >
                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold shadow-md transition hover:scale-[1.01]"
                      style={{
                        backgroundColor: '#1877F2',
                        color: "#FFFFFF",
                      }}
                      aria-label={t("contact.social.facebookAria")}
                      title="Facebook"
                    >
                      <Facebook className="h-4 w-4" aria-hidden="true" />
                      Facebook
                    </a>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold shadow-md transition hover:scale-[1.01]"
                      style={{
                        background:
                          "linear-gradient(45deg, #405DE6 0%, #833AB4 35%, #E1306C 65%, #FCB045 100%)",
                        color: "#FFFFFF",
                      }}
                      aria-label={t("contact.social.instagramAria")}
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" aria-hidden="true" />
                      Instagram
                    </a>

                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSplitWithForm;
