// app/services/serviceDetailsData.ts

export type ServiceId =
  | "well-visit"
  | "sick-visit"
  | "immunizations"
  | "vision-screening"
  | "audiology-screening"
  | "asthma"
  | "adhd"
  | "sports-physical"
  | "follow-up";

export type ServiceFAQ = { q: string; a: string };

export type ServiceDetail = {
  id: ServiceId;
  title: string;            // Título visible
  summary: string;          // Descripción corta
  duration?: string;        // Duración típica (ej. "20–30 min")
  ageRange?: string;        // Rango de edad (ej. "0–18 años")
  includes?: string[];      // Qué incluye la visita
  preparation?: string[];   // Qué traer / cómo prepararse
  whatToExpect?: string[];  // Flujo de la visita
  followUp?: string[];      // Seguimiento recomendado
  risks?: string[];         // Riesgos o advertencias
  recommendedFor?: string[];// Indicaciones
  faqs?: ServiceFAQ[];      // Preguntas frecuentes
  insuranceNote?: string;   // Nota de seguros
  cptCodes?: string[];      // (Opcional) Códigos CPT si los manejas
};

/** Aliases para mapear claves distintas al mismo servicio */
export const SERVICE_ALIASES: Record<string, ServiceId> = {
  // Generales
  well: "well-visit",
  "well-visit": "well-visit",

  sick: "sick-visit",
  "sick-visit": "sick-visit",
  urgent: "sick-visit",

  immunizations: "immunizations",
  covid: "immunizations",

  vision: "vision-screening",
  "vision-screening": "vision-screening",

  audiology: "audiology-screening",
  "audiology-screening": "audiology-screening",

  asthma: "asthma",
  "asthma-care-plan": "asthma",

  adhd: "adhd",
  "adhd-care-plan": "adhd",

  physical: "sports-physical",
  "sports-physical": "sports-physical",

  followup: "follow-up",
  "follow-up": "follow-up",
};

export function resolveServiceId(raw: string | undefined | null): ServiceId | null {
  if (!raw) return null;
  const key = raw.toLowerCase();
  const id = SERVICE_ALIASES[key] as ServiceId | undefined;
  return id ?? null;
}

export const SERVICE_DETAILS: Record<ServiceId, ServiceDetail> = {
  "well-visit": {
    id: "well-visit",
    title: "Visita de Niño Sano",
    summary:
      "Evaluación integral periódica para crecimiento, desarrollo y prevención, con actualización de vacunas y consejería familiar.",
    duration: "20–30 min",
    ageRange: "0–18 años",
    includes: [
      "Medición de peso, talla e IMC",
      "Revisión de hitos del desarrollo",
      "Esquema de vacunación",
      "Tamizajes según edad (visión, audición, anemia, etc.)",
      "Consejería en nutrición, sueño y seguridad",
    ],
    preparation: [
      "Traer récord de vacunas y medicamentos actuales",
      "Lista de dudas o cambios observados",
      "Para lactantes: pañal y biberón si aplica",
    ],
    whatToExpect: [
      "Historia clínica y social",
      "Examen físico completo",
      "Recomendaciones personalizadas y plan preventivo",
    ],
    followUp: ["Próxima visita según edad", "Referencias si se detecta alguna necesidad"],
    faqs: [
      {
        q: "¿Cada cuánto debo traer a mi hijo/a?",
        a: "Según edad: más seguido en el primer año y luego anual, salvo indicación diferente.",
      },
    ],
  },

  "sick-visit": {
    id: "sick-visit",
    title: "Visita por Enfermedad",
    summary:
      "Atención aguda para síntomas como fiebre, tos, dolor de oído, vómitos o lesiones leves.",
    duration: "15–25 min",
    ageRange: "0–18 años",
    includes: [
      "Evaluación dirigida por síntomas",
      "Examen físico focalizado",
      "Pruebas rápidas si es necesario (estreptococo, influenza, COVID)",
      "Plan de manejo y señales de alarma",
    ],
    preparation: [
      "Registrar temperatura y medicamentos ya administrados",
      "Anotar inicio y evolución de los síntomas",
    ],
    whatToExpect: [
      "Historia breve y examen orientado",
      "Explicación de diagnóstico probable",
      "Indicaciones y cuándo regresar o ir a urgencias",
    ],
    followUp: [
      "Control si los síntomas persisten o empeoran",
      "Llamada si hay nuevas alarmas (dificultad para respirar, deshidratación, letargo)",
    ],
    faqs: [
      {
        q: "¿Necesita antibióticos?",
        a: "Depende de la causa. Muchas infecciones virales no los requieren; seguimos guías basadas en evidencia.",
      },
    ],
  },

  immunizations: {
    id: "immunizations",
    title: "Vacunas / Inmunizaciones",
    summary:
      "Aplicación segura de vacunas según el calendario recomendado, con orientación sobre efectos esperados.",
    duration: "10–20 min",
    ageRange: "0–18 años (y refuerzos)",
    includes: [
      "Revisión del historial de vacunas",
      "Aplicación de dosis requeridas",
      "Tarjeta/registro actualizado",
    ],
    preparation: [
      "Traer récord de vacunas",
      "Avisar si hubo reacciones previas",
      "Hidratación previa y ropa cómoda",
    ],
    whatToExpect: [
      "Verificación de elegibilidad",
      "Aplicación rápida por personal entrenado",
      "Observación breve y cuidados en casa",
    ],
    followUp: ["Próxima dosis/ refuerzo según calendario"],
    faqs: [
      {
        q: "¿Es normal la fiebre después de vacunar?",
        a: "Sí, puede aparecer fiebre baja y dolor local por 24–48 h; usamos manejo sintomático.",
      },
    ],
    insuranceNote:
      "Contamos con múltiples aseguradoras y programas de vacunas; consulta cobertura específica.",
  },

  "vision-screening": {
    id: "vision-screening",
    title: "Tamizaje de Visión",
    summary:
      "Detección temprana de problemas visuales (miopía, ambliopía, astigmatismo) con pruebas apropiadas para la edad.",
    duration: "10–15 min",
    ageRange: "Según edad y cooperación",
    includes: ["Pruebas de agudeza", "Instrumentos automáticos si corresponde"],
    preparation: ["Evitar fatiga previa", "Si usa gafas, traerlas"],
    whatToExpect: ["Pruebas breves y lúdicas", "Referencia a oftalmología si es necesario"],
  },

  "audiology-screening": {
    id: "audiology-screening",
    title: "Tamizaje de Audición",
    summary:
      "Revisión rápida de respuesta auditiva para detectar pérdidas leves o moderadas y problemas de conducción.",
    duration: "10–15 min",
    includes: ["Otoemisiones/tonos puros según edad", "Otoscopia"],
    preparation: ["Si hay cera, avisar; podríamos removerla"],
    whatToExpect: ["Prueba breve con sonidos suaves", "Resultados inmediatos"],
    followUp: ["Referencia a audiología si el tamizaje no es satisfactorio"],
  },

  asthma: {
    id: "asthma",
    title: "Asma: Plan de Manejo",
    summary:
      "Evaluación y control del asma con educación sobre inhaladores/espaciadores, plan escrito y control de desencadenantes.",
    duration: "20–30 min",
    recommendedFor: ["Sibilancias recurrentes", "Diagnóstico de asma", "Tos nocturna"],
    includes: [
      "Historia dirigida y examen",
      "Técnica de inhalación/espaciador",
      "Plan de acción por zonas",
    ],
    preparation: ["Traer inhaladores/espaciador", "Registro de síntomas y uso de rescate"],
    whatToExpect: ["Ajuste de medicación según control", "Educación y metas compartidas"],
    followUp: ["Revisión en 1–3 meses o antes si hay exacerbación"],
    faqs: [
      {
        q: "¿El uso de controlador es permanente?",
        a: "Se reevalúa periódicamente; buscamos la mínima dosis efectiva para buen control.",
      },
    ],
  },

  adhd: {
    id: "adhd",
    title: "TDAH: Evaluación y Seguimiento",
    summary:
      "Abordaje multimodal del Trastorno por Déficit de Atención/Hiperactividad con escalas, apoyo escolar y ajuste terapéutico.",
    duration: "30–40 min (inicial) / 15–20 min (control)",
    recommendedFor: ["Dificultades de atención", "Hiperactividad/impulsividad", "Rendimiento escolar"],
    includes: ["Escalas validadas", "Plan escolar y conductual", "Discusión de opciones terapéuticas"],
    preparation: [
      "Reportes de escuela",
      "Escalas completadas por cuidadores y docentes",
      "Historial médico previo",
    ],
    whatToExpect: [
      "Evaluación clínica integral",
      "Plan individualizado",
      "Monitoreo de respuesta y efectos",
    ],
    followUp: ["Controles periódicos para ajuste fino"],
    faqs: [
      {
        q: "¿Siempre se indican medicamentos?",
        a: "No siempre; depende de severidad y contexto. Combinamos medidas conductuales y, si es necesario, farmacológicas.",
      },
    ],
  },

  "sports-physical": {
    id: "sports-physical",
    title: "Examen Físico Deportivo",
    summary:
      "Aptitud para actividad deportiva con énfasis en corazón, respiración, articulaciones y antecedentes familiares.",
    duration: "20–30 min",
    includes: [
      "Historia deportiva y familiar",
      "Examen cardiovascular y músculo-esquelético",
      "Formulario de aptitud",
    ],
    preparation: ["Ropa cómoda", "Formularios de la escuela/club", "Antecedentes de lesiones"],
    whatToExpect: ["Examen físico dirigido", "Recomendaciones de prevención de lesiones"],
    followUp: ["Control si hay hallazgos o lesiones previas"],
  },

  "follow-up": {
    id: "follow-up",
    title: "Visita de Seguimiento",
    summary:
      "Revisión del progreso tras una consulta previa: respuesta a tratamiento, resultados de estudios, ajustes necesarios.",
    duration: "10–20 min",
    includes: ["Revisión de síntomas", "Lectura de estudios", "Ajuste de plan"],
    preparation: ["Traer resultados/laboratorios", "Adherencia a tratamiento / eventos adversos"],
    whatToExpect: ["Actualización del plan", "Próximos pasos claros"],
  },
};
