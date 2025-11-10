// serviceDetails.i18n.ts
"use client";

export type Locale = "es" | "en";

// SOLO los servicios que quieres
export type ServiceId =
  | "preventive-medicine"
  | "adult-immunizations"
  | "minor-illness"
  | "minor-injury"
  | "chronic-disease";

export type ServiceFAQ = { q: string; a: string };

export type ServiceDetailI18n = {
  title?: string;
  summary?: string;
  duration?: string;
  ageRange?: string;
  includes?: string[];
  preparation?: string[];
  whatToExpect?: string[];
  followUp?: string[];
  risks?: string[];
  recommendedFor?: string[];
  faqs?: ServiceFAQ[];
  insuranceNote?: string;
};

type PanelSections = {
  includes: string;
  preparation: string;
  expect: string;
  followUp: string;
  risks: string;
  faqs: string;
};

type PanelCTA = {
  label: string;
  aria: string;
};

type Panel = {
  fallbackTitle: string;
  openAsLink: string;
  close: string;
  noDescription: string;
  sections: PanelSections;
  cta: PanelCTA;
};

type PanelOwnKey = Exclude<keyof Panel, "sections" | "cta">;
type SectionsKey = keyof PanelSections;
type CTAKey = keyof PanelCTA;

export type PanelKey =
  | PanelOwnKey
  | `sections.${SectionsKey}`
  | `cta.${CTAKey}`;

// ======================
// DICCIONARIO
// ======================
const DICT: Record<
  Locale,
  {
    panel: Panel;
    services: Record<ServiceId, ServiceDetailI18n>;
  }
> = {
  /* ===================== ESPAÑOL ===================== */
  es: {
    panel: {
      fallbackTitle: "Detalles del servicio",
      openAsLink: "Abrir como enlace",
      close: "Cerrar panel de detalles",
      noDescription: "Sin descripción.",
      sections: {
        includes: "Incluye",
        preparation: "Preparación",
        expect: "Qué esperar",
        followUp: "Seguimiento",
        risks: "Riesgos / advertencias",
        faqs: "Preguntas frecuentes",
      },
      cta: {
        label: "Agendar cita",
        aria: "Agendar cita para {title}",
      },
    },
    services: {
      /* 1. Preventive Medicine */
      "preventive-medicine": {
        title: "Medicina preventiva",
        summary:
          "Evaluaciones y tratamientos que ayudan a evitar enfermedades innecesarias y a detectar condiciones de riesgo cuando aún son fáciles de tratar.",
        duration: "20–30 min",
        includes: [
          "Revisión de historia clínica y medicamentos",
          "Signos vitales (peso, presión arterial)",
          "Solicitud de laboratorios según edad y factores de riesgo",
          "Revisión y actualización de vacunas si corresponde",
          "Orientación en estilo de vida (alimentación, actividad)",
        ],
        preparation: [
          "Traer lista de medicamentos y suplementos",
          "Traer récord de vacunas si lo tiene",
          "Si le indicaron laboratorios en ayunas, no comer antes",
          "Llegar por lo menos 10 minutos antes",
        ],
        whatToExpect: [
          "Breve revisión de antecedentes y factores de riesgo",
          "Examen físico básico",
          "Explicación de los próximos pasos o exámenes",
        ],
        followUp: [
          "Control anual o antes si el médico lo indica",
          "Dar seguimiento a los laboratorios solicitados",
        ],
      },

      /* 2. Adult Immunizations */
      "adult-immunizations": {
        title: "Inmunizaciones para adultos",
        summary:
          "Aplicación de vacunas recomendadas por los CDC para proteger contra influenza, neumococo, VPH, hepatitis, culebrilla (shingles), RSV y más.",
        duration: "10–15 min",
        includes: [
          "Revisión del estado de vacunación",
          "Confirmación de vacuna indicada por edad o riesgo",
          "Aplicación de la vacuna",
          "Registro de la dosis aplicada",
        ],
        preparation: [
          "Traer tarjeta o historial de vacunas si lo tiene",
          "Avisar si tiene alergias a medicamentos",
          "Usar ropa que permita descubrir el brazo",
        ],
        whatToExpect: [
          "Valoración muy breve",
          "Aplicación rápida de la vacuna",
          "Indicaciones de cuidados en casa y efectos esperados",
        ],
        followUp: [
          "Asistir a los refuerzos según calendario",
          "Consultar si presenta fiebre alta o reacción poco común",
        ],
        risks: [
          "Enrojecimiento o dolor leve en el sitio de inyección",
          "Malestar general leve o fiebre baja",
        ],
      },

      /* 3. Minor Illness Diagnosis and Treatment */
      "minor-illness": {
        title: "Diagnóstico y tratamiento de enfermedades leves",
        summary:
          "Evaluación y manejo de resfriados, gripe, sinusitis u otras enfermedades agudas frecuentes que no requieren hospitalización.",
        duration: "15–25 min",
        includes: [
          "Historia dirigida a los síntomas",
          "Examen físico focalizado",
          "Pruebas rápidas si se necesitan (gripe, COVID, estreptococo)",
          "Plan de tratamiento y señales de alarma",
        ],
        preparation: [
          "Anotar desde cuándo comenzaron los síntomas",
          "Traer lista de medicamentos ya tomados",
          "Registrar si ha tenido fiebre",
          "Traer tarjeta del seguro si aplica",
        ],
        whatToExpect: [
          "Evaluación rápida y directa",
          "Explicación del diagnóstico más probable",
          "Recomendaciones de medicamentos o cuidados en casa",
          "Indicaciones de cuándo regresar o ir a urgencias",
        ],
        followUp: [
          "Volver si no mejora en 48–72 horas",
          "Volver antes si aparece fiebre alta o dificultad respiratoria",
        ],
      },

      /* 4. Minor Injury Diagnosis and Treatment */
      "minor-injury": {
        title: "Diagnóstico y tratamiento de lesiones leves",
        summary:
          "Atención inicial de esguinces leves, golpes, cortaduras pequeñas o quemaduras superficiales que pueden manejarse en el consultorio.",
        duration: "15–25 min",
        includes: [
          "Evaluación de la zona afectada",
          "Limpieza o cura básica de la lesión",
          "Manejo del dolor e inflamación si hace falta",
          "Recomendaciones de reposo o inmovilización ligera",
        ],
        preparation: [
          "Explicar cómo ocurrió la lesión",
          "Traer lista de medicamentos (si toma anticoagulantes, mencionarlo)",
          "Usar ropa que permita revisar la zona",
        ],
        whatToExpect: [
          "Revisión del movimiento y dolor",
          "Limpieza, vendaje o protección de la zona",
          "Instrucciones de cuidados en casa",
          "Señales de alarma (enrojecimiento, fiebre, más dolor)",
        ],
        followUp: [
          "Revisar de nuevo si no hay mejoría en 2–3 días",
          "Acudir antes si la zona se pone roja, caliente o muy dolorosa",
        ],
      },

      /* 5. Chronic Disease Management */
      "chronic-disease": {
        title: "Manejo de enfermedades crónicas",
        summary:
          "Monitoreo y tratamiento continuos de condiciones como enfermedad cardiovascular, obesidad, diabetes, EPOC, asma y artritis.",
        duration: "20–30 min",
        includes: [
          "Control de signos vitales (presión, peso)",
          "Revisión de síntomas y adherencia al tratamiento",
          "Ajuste de medicamentos si es necesario",
          "Solicitud de laboratorios de control",
          "Educación en dieta, actividad física y autocuidado",
        ],
        preparation: [
          "Traer lista de medicamentos actuales",
          "Si es diabético: traer los registros de glucosa",
          "Traer laboratorios recientes si los tiene",
          "Anotar cifras de presión en casa si las toma",
        ],
        whatToExpect: [
          "Revisión del nivel de control de la enfermedad",
          "Explicación de metas (glucosa, presión, peso)",
          "Ajuste del plan de tratamiento",
        ],
        followUp: [
          "Controles cada 1–3 meses según la condición",
          "Consulta inmediata si hay empeoramiento de síntomas",
        ],
        faqs: [
          {
            q: "¿Puedo suspender la medicina si me siento bien?",
            a: "No lo hagas sin hablarlo con el médico; muchas enfermedades crónicas no dan síntomas aunque estén descontroladas.",
          },
        ],
      },
    },
  },

  /* ===================== ENGLISH ===================== */
  en: {
    panel: {
      fallbackTitle: "Service details",
      openAsLink: "Open as link",
      close: "Close details panel",
      noDescription: "No description.",
      sections: {
        includes: "Includes",
        preparation: "Preparation",
        expect: "What to expect",
        followUp: "Follow-up",
        risks: "Risks / warnings",
        faqs: "Frequently asked questions",
      },
      cta: {
        label: "Book appointment",
        aria: "Book appointment for {title}",
      },
    },
    services: {
      /* 1. Preventive Medicine */
      "preventive-medicine": {
        title: "Preventive Medicine",
        summary:
          "Medical screenings and counseling to help you avoid unnecessary illness and detect high-risk conditions while they are still easy to treat.",
        duration: "20–30 min",
        includes: [
          "Medical history and current medications review",
          "Vitals (weight, BMI, blood pressure)",
          "Age/risk-based lab or screening orders",
          "Vaccine review and update if needed",
          "Lifestyle and preventive counseling",
        ],
        preparation: [
          "Bring a list of medications and supplements",
          "Bring your vaccine record if available",
          "If fasting labs were ordered, come fasting",
          "Arrive 10 minutes early",
        ],
        whatToExpect: [
          "Brief review of risks and family history",
          "Basic physical exam",
          "Explanation of labs or next steps",
        ],
        followUp: [
          "Yearly wellness visit or as advised",
          "Follow up to review ordered labs",
        ],
      },

      /* 2. Adult Immunizations */
      "adult-immunizations": {
        title: "Adult Immunizations",
        summary:
          "CDC-recommended vaccines for adults, including protection against Influenza (Flu), Pneumococcal infections, HPV, Hepatitis, Shingles, RSV and more.",
        duration: "10–15 min",
        includes: [
          "Vaccine status review",
          "Confirmation of indicated vaccine",
          "Vaccine administration",
          "Documentation of the dose",
        ],
        preparation: [
          "Bring your vaccine card if you have it",
          "Tell us about any allergies or past reactions",
          "Wear clothing that allows arm access",
        ],
        whatToExpect: [
          "Very short assessment",
          "Quick vaccine shot",
          "At-home care and expected mild reactions",
        ],
        followUp: [
          "Come back for boosters according to schedule",
          "Call if you have unusual or severe reaction",
        ],
        risks: [
          "Mild redness or soreness at the injection site",
          "Low-grade fever or malaise",
        ],
      },

      /* 3. Minor Illness Diagnosis and Treatment */
      "minor-illness": {
        title: "Minor Illness Diagnosis and Treatment",
        summary:
          "Visit for commonly diagnosed acute illnesses such as colds or flu that do not require hospitalization.",
        duration: "15–25 min",
        includes: [
          "Symptom-focused medical history",
          "Targeted physical exam",
          "Rapid tests if needed (flu, strep, COVID)",
          "Treatment plan and warning signs",
        ],
        preparation: [
          "Note when symptoms started",
          "Bring list of medicines you already took",
          "Track fever if present",
          "Bring your insurance card if applicable",
        ],
        whatToExpect: [
          "Quick and focused evaluation",
          "Clear diagnosis or most likely cause",
          "Medications or home-care instructions",
          "When to return or go to the ER",
        ],
        followUp: [
          "Return if not improving within 48–72 hours",
          "Return sooner if symptoms worsen or fever is high",
        ],
      },

      /* 4. Minor Injury Diagnosis and Treatment */
      "minor-injury": {
        title: "Minor Injury Diagnosis and Treatment",
        summary:
          "Assessment and treatment of non-life-threatening injuries that can be managed at a primary care office.",
        duration: "15–25 min",
        includes: [
          "Assessment of the injured area",
          "Basic wound/skin care or cleaning",
          "Pain/inflammation management recommendations",
          "Advice on rest or light immobilization",
        ],
        preparation: [
          "Explain how the injury happened",
          "Bring medication list (tell us if on blood thinners)",
          "Wear clothing that allows access to the injured area",
        ],
        whatToExpect: [
          "Range-of-motion and pain check",
          "Cleaning, bandage or support",
          "Home-care instructions and red flags",
        ],
        followUp: [
          "Return if no improvement in 2–3 days",
          "Return earlier if swelling, redness or pain increases",
        ],
      },

      /* 5. Chronic Disease Management */
      "chronic-disease": {
        title: "Chronic Disease Management",
        summary:
          "Regular monitoring and treatment of long-term conditions such as cardiovascular disease, obesity, diabetes, COPD, asthma and arthritis.",
        duration: "20–30 min",
        includes: [
          "Vitals and symptom review",
          "Medication review and adjustments",
          "Control labs ordered when needed",
          "Education on diet, activity and self-management",
        ],
        preparation: [
          "Bring a list of current medications",
          "If diabetic: bring your glucose logs",
          "Bring recent labs if you have them",
          "Note home blood-pressure readings if you take them",
        ],
        whatToExpect: [
          "Review of current disease control",
          "Discussion of goals (BP, glucose, weight)",
          "Adjustment of treatment plan",
        ],
        followUp: [
          "Visits every 1–3 months depending on the condition",
          "Contact us sooner if symptoms worsen",
        ],
        faqs: [
          {
            q: "Can I stop my medicines if I feel better?",
            a: "Not without talking to your provider. Many chronic diseases stay silent even when they are uncontrolled.",
          },
        ],
      },
    },
  },
};

// ===== helpers de locale opcionales =====
let CURRENT_LOCALE: Locale = "es";

export function setServicePanelLocale(locale: Locale): void {
  CURRENT_LOCALE = locale;
}

export function getServicePanelLocale(): Locale {
  return CURRENT_LOCALE;
}

export function detectLocaleFromPath(pathname?: string): Locale {
  const path =
    pathname ??
    (typeof window !== "undefined" &&
    typeof window.location?.pathname === "string"
      ? window.location.pathname
      : "");
  const p = path.split("/").filter(Boolean);
  return p[0]?.toLowerCase() === "en" ? "en" : "es";
}

// ===== helpers públicos =====
export function panelT(locale: Locale, key: PanelKey): string {
  const panel = DICT[locale]?.panel ?? DICT.es.panel;
  if (key.startsWith("sections.")) {
    const k = key.slice("sections.".length) as SectionsKey;
    return panel.sections?.[k] ?? DICT.es.panel.sections[k] ?? key;
  }
  if (key.startsWith("cta.")) {
    const k = key.slice("cta.".length) as CTAKey;
    return panel.cta?.[k] ?? DICT.es.panel.cta[k] ?? key;
  }
  const ownKey = key as PanelOwnKey;
  return panel[ownKey] ?? DICT.es.panel[ownKey] ?? key;
}

export function svcStr(
  locale: Locale,
  id: ServiceId,
  k: keyof ServiceDetailI18n
): string | undefined {
  const v = DICT[locale].services[id]?.[k] ?? DICT.es.services[id]?.[k];
  return typeof v === "string" ? v : undefined;
}

export function svcArr(
  locale: Locale,
  id: ServiceId,
  k: keyof ServiceDetailI18n
): string[] {
  const v = DICT[locale].services[id]?.[k];
  const fb = DICT.es.services[id]?.[k];
  return Array.isArray(v)
    ? (v as string[])
    : Array.isArray(fb)
    ? (fb as string[])
    : [];
}

export function svcFaqs(locale: Locale, id: ServiceId): ServiceFAQ[] {
  return (
    (DICT[locale].services[id]?.faqs ??
      DICT.es.services[id]?.faqs ??
      []) as ServiceFAQ[]
  );
}

export function format(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_m, k: string) =>
    k in vars ? vars[k] : `{${k}}`
  );
}
