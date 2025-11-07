// serviceDetails.i18n.ts
'use client';

export type Locale = 'es' | 'en';

// 👇 estos son los mismos ids que usas en las tarjetas de ServicesGrid
export type ServiceId =
  | 'preventive-medicine'
  | 'adult-immunizations'
  | 'minor-illness'
  | 'minor-injury'
  | 'chronic-disease'
  | 'asthma-care'
  | 'vision-screening';

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
  aria: string; // {title}
};

type Panel = {
  fallbackTitle: string;
  openAsLink: string;
  close: string;
  noDescription: string;
  sections: PanelSections;
  cta: PanelCTA;
};

type PanelOwnKey = Exclude<keyof Panel, 'sections' | 'cta'>;
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
  es: {
    panel: {
      fallbackTitle: 'Detalles del servicio',
      openAsLink: 'Abrir como enlace',
      close: 'Cerrar panel de detalles',
      noDescription: 'Sin descripción.',
      sections: {
        includes: 'Incluye',
        preparation: 'Preparación',
        expect: 'Qué esperar',
        followUp: 'Seguimiento',
        risks: 'Riesgos / Advertencias',
        faqs: 'Preguntas frecuentes',
      },
      cta: {
        label: 'Agendar cita',
        aria: 'Agendar cita para {title}',
      },
    },
    services: {
      'preventive-medicine': {
        title: 'Medicina preventiva para adultos',
        summary:
          'Controles periódicos, laboratorios básicos y educación en estilos de vida para detectar factores de riesgo a tiempo.',
        duration: '20–30 min',
        ageRange: 'Adultos',
        includes: [
          'Historia clínica y medicación actual',
          'Signos vitales (peso, IMC, presión)',
          'Solicitudes de laboratorio según edad y riesgo',
          'Actualización de vacunas si corresponde',
          'Plan personalizado de cuidado',
        ],
        preparation: [
          'Traer lista de medicamentos y suplementos',
          'Traer récord de vacunas si lo tiene',
          'Llegar 10 min antes',
        ],
        whatToExpect: [
          'Revisión de antecedentes y factores de riesgo',
          'Examen físico básico',
          'Explicación de resultados o próximos pasos',
        ],
        followUp: ['Control anual o según indicación médica'],
        recommendedFor: [
          'Pacientes que no se revisan hace 1 año o más',
          'Pacientes con antecedentes familiares',
        ],
        faqs: [
          {
            q: '¿Cada cuánto debo hacerme este control?',
            a: 'En general 1 vez al año, pero puede variar según tu edad o condiciones crónicas.',
          },
        ],
      },
      'adult-immunizations': {
        title: 'Inmunizaciones en adultos',
        summary:
          'Aplicación de vacunas recomendadas por edad o condición (influenza, neumococo, hepatitis) con orientación sobre efectos esperados.',
        duration: '10–15 min',
        ageRange: 'Adultos y adultos mayores',
        includes: [
          'Revisión del estado de vacunación',
          'Aplicación de la vacuna indicada',
          'Registro de la dosis aplicada',
        ],
        preparation: ['Traer historial de vacunas si está disponible'],
        whatToExpect: [
          'Evaluación breve',
          'Aplicación rápida',
          'Recomendaciones de cuidados en casa',
        ],
        followUp: ['Próximas dosis o refuerzos según calendario'],
        risks: ['Enrojecimiento o dolor leve en el sitio de inyección', 'Fiebre baja ocasional'],
        faqs: [
          {
            q: '¿Puedo vacunarme si estoy tomando medicamentos?',
            a: 'La mayoría de las veces sí, pero coméntalo antes con el médico para elegir la vacuna adecuada.',
          },
        ],
      },
      'minor-illness': {
        title: 'Atención de enfermedades comunes',
        summary:
          'Evaluación y manejo de cuadros agudos como resfriado, gripe, infecciones leves, alergias o dolor de garganta.',
        duration: '15–25 min',
        ageRange: 'Adultos',
        includes: [
          'Historia dirigida a los síntomas',
          'Examen físico focalizado',
          'Pruebas rápidas si se necesitan',
          'Plan de tratamiento y señales de alarma',
        ],
        preparation: [
          'Registrar fiebre y medicamentos ya tomados',
          'Anotar tiempo de evolución de los síntomas',
        ],
        whatToExpect: [
          'Revisión rápida y directa',
          'Recomendaciones de medicamentos o cuidados',
          'Cuándo regresar o ir a urgencias',
        ],
        followUp: ['Control si los síntomas no mejoran en 48–72 h'],
      },
      'minor-injury': {
        title: 'Lesiones leves',
        summary:
          'Valoración y tratamiento inicial de lesiones no graves como esguinces leves, golpes, pequeñas quemaduras o cortaduras superficiales.',
        duration: '15–25 min',
        ageRange: 'Adultos',
        includes: ['Examen de la zona afectada', 'Limpieza o cura básica', 'Recomendaciones de reposo'],
        preparation: ['Describir cómo ocurrió la lesión', 'Traer lista de medicamentos, si toma anticoagulantes mencionar'],
        whatToExpect: [
          'Revisión del movimiento y dolor',
          'Manejo del dolor si aplica',
          'Indicaciones para casa y signos de alarma',
        ],
        followUp: ['Revisión si hay empeoramiento o no hay mejoría en pocos días'],
      },
      'chronic-disease': {
        title: 'Manejo de enfermedades crónicas',
        summary:
          'Seguimiento estructurado de condiciones como hipertensión, diabetes, colesterol alto u obesidad.',
        duration: '20–30 min',
        ageRange: 'Adultos',
        includes: [
          'Revisión de presión, peso y síntomas',
          'Ajuste de medicamentos si hace falta',
          'Solicitud de laboratorios de control',
          'Educación sobre dieta y actividad física',
        ],
        preparation: [
          'Traer lista de medicamentos',
          'Si es diabético: traer registros de glucosa',
          'Traer laboratorios recientes',
        ],
        whatToExpect: [
          'Evaluación del control actual',
          'Metas claras de tratamiento',
          'Plan de seguimiento',
        ],
        followUp: ['Controles cada 1–3 meses según la condición'],
        faqs: [
          {
            q: '¿Puedo dejar el tratamiento si me siento bien?',
            a: 'No sin hablarlo antes con el médico; muchas enfermedades crónicas no dan síntomas.',
          },
        ],
      },
      'asthma-care': {
        title: 'Cuidado y control del asma en adultos',
        summary:
          'Evaluación del grado de control del asma, técnica de inhaladores y ajustes de tratamiento.',
        duration: '20–25 min',
        recommendedFor: ['Asma diagnosticada', 'Tos nocturna', 'Silbidos frecuentes'],
        includes: [
          'Historia dirigida y examen respiratorio',
          'Revisión de la técnica del inhalador',
          'Plan de acción (qué hacer si empeora)',
        ],
        preparation: ['Traer inhaladores actuales', 'Anotar frecuencia de síntomas'],
        whatToExpect: [
          'Revisión de desencadenantes',
          'Ajuste de dosis o medicación',
          'Educación sobre uso correcto',
        ],
        followUp: ['Control en 1–3 meses o antes si hay crisis'],
      },
      'vision-screening': {
        title: 'Tamizaje visual / salud ocular',
        summary:
          'Chequeo básico de visión para detectar problemas de agudeza visual u otros hallazgos que requieran oftalmología.',
        duration: '10–15 min',
        includes: ['Prueba de agudeza visual', 'Revisión básica de ojos'],
        preparation: ['Traer lentes si usa', 'Evitar llegar muy cansado'],
        whatToExpect: ['Pruebas breves', 'Referencias si se detecta algo'],
        followUp: ['Control anual o con oftalmología si se encuentra alteración'],
      },
    },
  },

  // ================= ENGLISH =================
  en: {
    panel: {
      fallbackTitle: 'Service details',
      openAsLink: 'Open as link',
      close: 'Close details panel',
      noDescription: 'No description.',
      sections: {
        includes: 'Includes',
        preparation: 'Preparation',
        expect: 'What to expect',
        followUp: 'Follow-up',
        risks: 'Risks / Warnings',
        faqs: 'Frequently asked questions',
      },
      cta: {
        label: 'Book appointment',
        aria: 'Book appointment for {title}',
      },
    },
    services: {
      'preventive-medicine': {
        title: 'Preventive Medicine (Adults)',
        summary:
          'Annual wellness visits, basic labs, and lifestyle counseling to detect risk factors early.',
        duration: '20–30 min',
        ageRange: 'Adults',
        includes: [
          'Medical history and current meds',
          'Vitals (weight, BMI, blood pressure)',
          'Age/risk-based lab orders',
          'Vaccine update if needed',
          'Personalized care plan',
        ],
        preparation: [
          'Bring list of medications/supplements',
          'Bring vaccine record if available',
          'Arrive 10 minutes early',
        ],
        whatToExpect: [
          'Risk review and brief exam',
          'Discussion of lab needs',
          'Next steps / follow-up plan',
        ],
        followUp: ['Yearly follow-up or as indicated'],
        recommendedFor: ['Adults with no recent check-up', 'Patients with family history'],
      },
      'adult-immunizations': {
        title: 'Adult Immunizations',
        summary:
          'CDC-recommended vaccines for adults, including influenza, pneumococcal, hepatitis and others.',
        duration: '10–15 min',
        ageRange: 'Adults / older adults',
        includes: ['Vaccine record review', 'Vaccine administration', 'Updated documentation'],
        preparation: ['Bring vaccine card if you have it'],
        whatToExpect: ['Short visit', 'Injection and brief observation', 'At-home care instructions'],
        followUp: ['Next booster according to schedule'],
        risks: ['Mild soreness or redness', 'Low-grade fever'],
      },
      'minor-illness': {
        title: 'Minor Illness Visit',
        summary:
          'Evaluation and treatment for acute conditions like colds, flu, sinusitis, sore throat, or mild infections.',
        duration: '15–25 min',
        includes: [
          'Symptom-focused visit',
          'Physical exam',
          'Rapid tests when needed',
          'Treatment plan + red flags',
        ],
        preparation: ['Note fever and meds already taken', 'Note symptom onset'],
        whatToExpect: [
          'Quick, focused visit',
          'Medication or home-care instructions',
          'Return/ER indicators',
        ],
        followUp: ['Return if not improving in 48–72 hours'],
      },
      'minor-injury': {
        title: 'Minor Injury Care',
        summary:
          'Initial management for non-emergency injuries such as minor sprains, cuts, burns, or contusions.',
        duration: '15–25 min',
        includes: ['Assessment of injury', 'Basic wound/area care', 'Pain/inflammation guidance'],
        preparation: [
          'Explain how the injury happened',
          'Mention if you take blood thinners',
        ],
        whatToExpect: [
          'Range of motion / pain check',
          'Home care and warning signs',
        ],
        followUp: ['Return if swelling, redness, or pain worsens'],
      },
      'chronic-disease': {
        title: 'Chronic Disease Management',
        summary:
          'Ongoing care for hypertension, diabetes, high cholesterol, obesity, and similar long-term conditions.',
        duration: '20–30 min',
        includes: [
          'Vitals and symptom review',
          'Medication adjustment',
          'Lab orders for monitoring',
          'Diet and exercise counseling',
        ],
        preparation: [
          'Bring list of current meds',
          'Bring glucose logs if diabetic',
          'Bring recent labs if available',
        ],
        whatToExpect: [
          'Review of current control',
          'Clear goals',
          'Follow-up plan',
        ],
        followUp: ['Every 1–3 months depending on condition'],
        faqs: [
          {
            q: 'Can I stop meds if I feel well?',
            a: 'Not without talking to your provider; many chronic diseases are silent.',
          },
        ],
      },
      'asthma-care': {
        title: 'Adult Asthma Care',
        summary:
          'Assessment of asthma control, inhaler technique, and step-up or step-down therapy.',
        duration: '20–25 min',
        recommendedFor: ['Known asthma', 'Night cough', 'Frequent wheezing'],
        includes: [
          'Respiratory exam',
          'Inhaler/spacer technique',
          'Action plan (what to do if worse)',
        ],
        preparation: ['Bring your inhalers', 'Note symptom frequency'],
        whatToExpect: [
          'Trigger and control review',
          'Medication adjustment',
          'Education',
        ],
        followUp: ['1–3 month follow-up or sooner for exacerbations'],
      },
      'vision-screening': {
        title: 'Vision Screening / Eye Health',
        summary:
          'Basic vision check to detect issues that may need optometry/ophthalmology referral.',
        duration: '10–15 min',
        includes: ['Visual acuity test', 'Basic eye look'],
        preparation: ['Bring your glasses', 'Avoid coming too tired'],
        whatToExpect: ['Quick tests', 'Referral if needed'],
        followUp: ['Yearly check or as advised'],
      },
    },
  },
};

// ===== Estado de idioma en módulo (opcional) =====
let CURRENT_LOCALE: Locale = 'es';
export function setServicePanelLocale(locale: Locale): void {
  CURRENT_LOCALE = locale;
}
export function getServicePanelLocale(): Locale {
  return CURRENT_LOCALE;
}

export function detectLocaleFromPath(pathname?: string): Locale {
  const path =
    pathname ??
    (typeof window !== 'undefined' &&
    typeof window.location?.pathname === 'string'
      ? window.location.pathname
      : '');
  const p = path.split('/').filter(Boolean);
  return p[0]?.toLowerCase() === 'en' ? 'en' : 'es';
}

// ===== Helpers públicos =====
export function panelT(locale: Locale, key: PanelKey): string {
  const panel = DICT[locale]?.panel ?? DICT.es.panel;
  if (key.startsWith('sections.')) {
    const k = key.slice('sections.'.length) as SectionsKey;
    return panel.sections?.[k] ?? DICT.es.panel.sections[k] ?? key;
  }
  if (key.startsWith('cta.')) {
    const k = key.slice('cta.'.length) as CTAKey;
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
  return typeof v === 'string' ? v : undefined;
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
