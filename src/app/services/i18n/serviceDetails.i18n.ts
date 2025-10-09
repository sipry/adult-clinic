// ===== Tipos =====
export type Locale = 'es' | 'en';

export type ServiceId =
  | 'well-visit'
  | 'sick-visit'
  | 'immunizations'
  | 'vision-screening'
  | 'audiology-screening'
  | 'asthma'
  | 'adhd'
  | 'sports-physical'
  | 'follow-up';

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

// ===== Tipos del panel (para claves bien tipadas) =====
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

// ===== Diccionario exclusivo del panel =====
// 👇 Anotación explícita del tipo (NO `satisfies`) para evitar uniones estrechas
const DICT: Record<Locale, { panel: Panel; services: Record<ServiceId, ServiceDetailI18n> }> = {
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
      'well-visit': {
        title: 'Visita de Niño Sano',
        summary:
          'Evaluación integral periódica para crecimiento, desarrollo y prevención, con actualización de vacunas y consejería familiar.',
        duration: '20–30 min',
        ageRange: '0–18 años',
        includes: [
          'Medición de peso, talla e IMC',
          'Revisión de hitos del desarrollo',
          'Esquema de vacunación',
          'Tamizajes según edad (visión, audición, anemia, etc.)',
          'Consejería en nutrición, sueño y seguridad',
        ],
        preparation: [
          'Traer récord de vacunas y medicamentos actuales',
          'Lista de dudas o cambios observados',
          'Para lactantes: pañal y biberón si aplica',
        ],
        whatToExpect: [
          'Historia clínica y social',
          'Examen físico completo',
          'Recomendaciones personalizadas y plan preventivo',
        ],
        followUp: ['Próxima visita según edad', 'Referencias si se detecta alguna necesidad'],
        faqs: [
          {
            q: '¿Cada cuánto debo traer a mi hijo/a?',
            a: 'Según edad: más seguido en el primer año y luego anual, salvo indicación diferente.',
          },
        ],
      },
      'sick-visit': {
        title: 'Visita por Enfermedad',
        summary:
          'Atención aguda para síntomas como fiebre, tos, dolor de oído, vómitos o lesiones leves.',
        duration: '15–25 min',
        ageRange: '0–18 años',
        includes: [
          'Evaluación dirigida por síntomas',
          'Examen físico focalizado',
          'Pruebas rápidas si es necesario (estreptococo, influenza, COVID)',
          'Plan de manejo y señales de alarma',
        ],
        preparation: [
          'Registrar temperatura y medicamentos ya administrados',
          'Anotar inicio y evolución de los síntomas',
        ],
        whatToExpect: [
          'Historia breve y examen orientado',
          'Explicación de diagnóstico probable',
          'Indicaciones y cuándo regresar o ir a urgencias',
        ],
        followUp: [
          'Control si los síntomas persisten o empeoran',
          'Llamada si hay nuevas alarmas (dificultad respiratoria, deshidratación, letargo)',
        ],
      },
      immunizations: {
        title: 'Vacunas / Inmunizaciones',
        summary:
          'Aplicación segura de vacunas según el calendario recomendado, con orientación sobre efectos esperados.',
        duration: '10–20 min',
        ageRange: '0–18 años (y refuerzos)',
        includes: [
          'Revisión del historial de vacunas',
          'Aplicación de dosis requeridas',
          'Tarjeta/registro actualizado',
        ],
        preparation: [
          'Traer récord de vacunas',
          'Avisar si hubo reacciones previas',
          'Hidratación previa y ropa cómoda',
        ],
        whatToExpect: [
          'Verificación de elegibilidad',
          'Aplicación rápida por personal entrenado',
          'Observación breve y cuidados en casa',
        ],
        followUp: ['Próxima dosis / refuerzo según calendario'],
        faqs: [
          {
            q: '¿Es normal la fiebre después de vacunar?',
            a: 'Sí, puede aparecer fiebre baja y dolor local por 24–48 h; manejo sintomático.',
          },
        ],
      },
      'vision-screening': {
        title: 'Tamizaje de Visión',
        summary:
          'Detección temprana de problemas visuales (miopía, ambliopía, astigmatismo) con pruebas apropiadas para la edad.',
        duration: '10–15 min',
        ageRange: 'Según edad y cooperación',
        includes: ['Pruebas de agudeza', 'Instrumentos automáticos si corresponde'],
        preparation: ['Evitar fatiga previa', 'Si usa gafas, traerlas'],
        whatToExpect: ['Pruebas breves y lúdicas', 'Referencia a oftalmología si es necesario'],
      },
      'audiology-screening': {
        title: 'Tamizaje de Audición',
        summary:
          'Revisión rápida de respuesta auditiva para detectar pérdidas leves o moderadas y problemas de conducción.',
        duration: '10–15 min',
        includes: ['Otoemisiones/tonos puros según edad', 'Otoscopia'],
        preparation: ['Si hay cera, avisar; podríamos removerla'],
        whatToExpect: ['Prueba breve con sonidos suaves', 'Resultados inmediatos'],
        followUp: ['Referencia a audiología si el tamizaje no es satisfactorio'],
      },
      asthma: {
        title: 'Asma: Plan de Manejo',
        summary:
          'Evaluación y control del asma con educación sobre inhaladores/espaciadores, plan escrito y control de desencadenantes.',
        duration: '20–30 min',
        recommendedFor: ['Sibilancias recurrentes', 'Diagnóstico de asma', 'Tos nocturna'],
        includes: ['Historia dirigida y examen', 'Técnica de inhalación/espaciador', 'Plan de acción por zonas'],
        preparation: ['Traer inhaladores/espaciador', 'Registro de síntomas y uso de rescate'],
        whatToExpect: ['Ajuste de medicación según control', 'Educación y metas compartidas'],
        followUp: ['Revisión en 1–3 meses o antes si hay exacerbación'],
        faqs: [
          {
            q: '¿El controlador es permanente?',
            a: 'Se reevalúa; buscamos la mínima dosis efectiva con buen control.',
          },
        ],
      },
      adhd: {
        title: 'TDAH: Evaluación y Seguimiento',
        summary: 'Abordaje multimodal del TDAH con escalas, apoyo escolar y ajuste terapéutico.',
        duration: '30–40 min (inicial) / 15–20 min (control)',
        recommendedFor: [
          'Dificultades de atención',
          'Hiperactividad/impulsividad',
          'Rendimiento escolar',
        ],
        includes: ['Escalas validadas', 'Plan escolar y conductual', 'Opciones terapéuticas'],
        preparation: ['Reportes de escuela', 'Escalas de cuidadores y docentes', 'Historial médico previo'],
        whatToExpect: ['Evaluación integral', 'Plan individualizado', 'Monitoreo de respuesta y efectos'],
        followUp: ['Controles periódicos para ajuste fino'],
        faqs: [{ q: '¿Siempre se indican medicamentos?', a: 'No siempre; depende de severidad y contexto.' }],
      },
      'sports-physical': {
        title: 'Examen Físico Deportivo',
        summary:
          'Aptitud para actividad deportiva con énfasis en corazón, respiración, articulaciones y antecedentes familiares.',
        duration: '20–30 min',
        includes: ['Historia deportiva y familiar', 'Examen cardiovascular y músculo-esquelético', 'Formulario de aptitud'],
        preparation: ['Ropa cómoda', 'Formularios de escuela/club', 'Antecedentes de lesiones'],
        whatToExpect: ['Examen dirigido', 'Prevención de lesiones'],
        followUp: ['Control si hay hallazgos o lesiones previas'],
      },
      'follow-up': {
        title: 'Visita de Seguimiento',
        summary:
          'Revisión del progreso tras una consulta previa: respuesta a tratamiento, resultados de estudios, ajustes necesarios.',
        duration: '10–20 min',
        includes: ['Revisión de síntomas', 'Lectura de estudios', 'Ajuste de plan'],
        preparation: ['Traer resultados/laboratorios', 'Anotar adherencia / eventos adversos'],
        whatToExpect: ['Actualización del plan', 'Próximos pasos claros'],
      },
    },
  },

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
      'well-visit': {
        title: 'Well-Child Visit',
        summary:
          'Comprehensive periodic evaluation for growth, development, and prevention, with vaccine updates and family guidance.',
        duration: '20–30 min',
        ageRange: '0–18 years',
        includes: [
          'Weight, height, and BMI',
          'Developmental milestones review',
          'Vaccination schedule',
          'Age-appropriate screenings (vision, hearing, anemia, etc.)',
          'Counseling on nutrition, sleep, and safety',
        ],
        preparation: [
          'Bring vaccine record and current medications',
          'List of questions or changes noticed',
          'For infants: diaper and bottle if needed',
        ],
        whatToExpect: [
          'Medical and social history',
          'Complete physical exam',
          'Personalized recommendations and preventive plan',
        ],
        followUp: ['Next visit according to age', 'Referrals if needed'],
        faqs: [
          {
            q: 'How often should I bring my child?',
            a: 'More often in the first year, then annually unless otherwise indicated.',
          },
        ],
      },
      'sick-visit': {
        title: 'Sick Visit',
        summary: 'Acute care for symptoms like fever, cough, ear pain, vomiting, or minor injuries.',
        duration: '15–25 min',
        ageRange: '0–18 years',
        includes: [
          'Symptom-directed evaluation',
          'Focused physical exam',
          'Rapid tests if needed (strep, flu, COVID)',
          'Care plan and warning signs',
        ],
        preparation: [
          'Record temperature and medications already given',
          'Note onset and progression of symptoms',
        ],
        whatToExpect: [
          'Brief history and focused exam',
          'Explanation of likely diagnosis',
          'Instructions and when to return or go to the ER',
        ],
        followUp: [
          'Follow-up if symptoms persist or worsen',
          'Call if new warning signs appear (breathing difficulty, dehydration, lethargy)',
        ],
      },
      immunizations: {
        title: 'Immunizations',
        summary:
          'Safe vaccine administration according to the recommended schedule, with guidance on expected effects.',
        duration: '10–20 min',
        ageRange: '0–18 years (and boosters)',
        includes: ['Vaccine history review', 'Required doses given', 'Updated card/record'],
        preparation: ['Bring vaccine record', 'Report prior reactions', 'Hydrate and wear comfortable clothing'],
        whatToExpect: [
          'Eligibility check',
          'Quick administration by trained staff',
          'Brief observation and home care instructions',
        ],
        followUp: ['Next dose/booster per schedule'],
        faqs: [
          {
            q: 'Is fever after vaccination normal?',
            a: 'Low-grade fever and local soreness for 24–48 h can occur; use symptomatic care.',
          },
        ],
      },
      'vision-screening': {
        title: 'Vision Screening',
        summary:
          'Early detection of visual problems (myopia, amblyopia, astigmatism) with age-appropriate tests.',
        duration: '10–15 min',
        ageRange: 'Depends on age and cooperation',
        includes: ['Visual acuity tests', 'Automated devices if applicable'],
        preparation: ['Avoid fatigue beforehand', 'Bring glasses if used'],
        whatToExpect: ['Brief, playful tests', 'Ophthalmology referral if needed'],
      },
      'audiology-screening': {
        title: 'Audiology Screening',
        summary: 'Quick hearing check to detect mild to moderate loss and conduction issues.',
        duration: '10–15 min',
        includes: ['Otoacoustic emissions / pure tones (by age)', 'Otoscopy'],
        preparation: ['Tell us if there is earwax; we may remove it'],
        whatToExpect: ['Short test with soft sounds', 'Immediate results'],
        followUp: ['Audiology referral if the screening is not satisfactory'],
      },
      asthma: {
        title: 'Asthma: Care Plan',
        summary:
          'Evaluation and control of asthma with education on inhalers/spacers, written plan, and trigger control.',
        duration: '20–30 min',
        recommendedFor: ['Recurrent wheezing', 'Asthma diagnosis', 'Night cough'],
        includes: ['Focused history and exam', 'Inhaler/spacer technique', 'Zone-based action plan'],
        preparation: ['Bring inhalers/spacer', 'Symptom and rescue-use log'],
        whatToExpect: ['Medication adjustment per control', 'Education and shared goals'],
        followUp: ['Review in 1–3 months or sooner for exacerbation'],
        faqs: [
          {
            q: 'Is controller use permanent?',
            a: 'It’s reassessed; we seek the minimum effective dose for good control.',
          },
        ],
      },
      adhd: {
        title: 'ADHD: Evaluation & Follow-up',
        summary: 'Multimodal approach to ADHD with scales, school support, and therapy adjustment.',
        duration: '30–40 min (initial) / 15–20 min (follow-up)',
        recommendedFor: ['Attention difficulties', 'Hyperactivity/impulsivity', 'School performance'],
        includes: ['Validated scales', 'School & behavioral plan', 'Therapy options discussion'],
        preparation: ['School reports', 'Caregiver/teacher scales', 'Previous medical history'],
        whatToExpect: ['Comprehensive evaluation', 'Individualized plan', 'Response & side-effect monitoring'],
        followUp: ['Periodic visits for fine-tuning'],
        faqs: [{ q: 'Are medications always indicated?', a: 'Not always; it depends on severity and context.' }],
      },
      'sports-physical': {
        title: 'Sports Physical',
        summary:
          'Fitness for sports with focus on heart, breathing, joints, and family history.',
        duration: '20–30 min',
        includes: ['Sports & family history', 'Cardiovascular and musculoskeletal exam', 'Clearance form'],
        preparation: ['Comfortable clothing', 'School/club forms', 'Injury history'],
        whatToExpect: ['Focused physical exam', 'Injury prevention tips'],
        followUp: ['Follow-up if there are findings or prior injuries'],
      },
      'follow-up': {
        title: 'Follow-up Visit',
        summary:
          'Progress review after a prior appointment: treatment response, test results, needed adjustments.',
        duration: '10–20 min',
        includes: ['Symptom review', 'Lab/imaging review', 'Plan adjustment'],
        preparation: ['Bring results/labs', 'Note adherence / side effects'],
        whatToExpect: ['Plan update', 'Clear next steps'],
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

// Detección opcional por URL (SSR-safe)
export function detectLocaleFromPath(pathname?: string): Locale {
  const path =
    pathname ??
    (typeof window !== 'undefined' && typeof window.location?.pathname === 'string'
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

export function svcStr(locale: Locale, id: ServiceId, k: keyof ServiceDetailI18n): string | undefined {
  const v = DICT[locale].services[id]?.[k] ?? DICT.es.services[id]?.[k];
  return typeof v === 'string' ? v : undefined;
}

export function svcArr(locale: Locale, id: ServiceId, k: keyof ServiceDetailI18n): string[] {
  const v = DICT[locale].services[id]?.[k];
  const fb = DICT.es.services[id]?.[k];
  return Array.isArray(v) ? (v as string[]) : Array.isArray(fb) ? (fb as string[]) : [];
}

export function svcFaqs(locale: Locale, id: ServiceId): ServiceFAQ[] {
  return (DICT[locale].services[id]?.faqs ?? DICT.es.services[id]?.faqs ?? []) as ServiceFAQ[];
}

export function format(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k: string) => (k in vars ? vars[k] : `{${k}}`));
}
