'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/* ===================== Tipos ===================== */

export type Language = 'es' | 'en';

export interface ServiceTranslation {
  key: string;
  title: string;
  description: string;
  longDescription?: string;
  tags?: string[];
}

type TranslationValue =
  | string
  | string[]
  | ServiceTranslation[]
  | Record<string, string>;

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Devuelve siempre string; si la clave no es string, usa la clave como fallback */
  t: (key: string) => string;
  /** Devuelve string con interpolación {var} (si no hay string, devuelve la clave) */
  tFormat: (key: string, params: Record<string, string | number>) => string;
  /** Devuelve siempre un array; tipa el resultado con genérico */
  tArray: <T = unknown>(key: string) => T[];
}

/* ===================== Datos ===================== */

const translations: Record<Language, Record<string, TranslationValue>> = {
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.about': 'Sobre nosotros',
    'nav.services': 'Servicios',
    'nav.insurance': 'Seguros',
    'nav.providers': 'Proveedores',
    'nav.clinic': 'Clínica',
    'nav.contact': 'Contactanos',
    'nav.explore': 'Programar Cita',
    'nav.gallery': 'Galería',
    'nav.language': 'Lenguaje',
    'nav.process': 'Proceso',

    // Hero Banner
    'hero.pretitle': 'CUIDADO FAMILIAR',
    'hero.subtitle': 'Servicios pediátricos cercanos y confiables para cuidar lo más valioso: tu familia.',
    'hero.contact': 'Programar una cita',
    'hero.portal': 'Explorar servicios',

    // About Us
    'about.pretitle': 'Sobre nosotros',
    'about.title': 'Tu pediatra de confianza',
    'about.subtitle': 'Prevención, claridad y ciencia en cada consulta.',
    'about.bullet1': 'Calendario de vacunas al día',
    'about.bullet2': 'Chequeos de crecimiento y desarrollo',
    'about.bullet3': 'Lactancia y nutrición infantil',
    'about.cta1': 'Más sobre nosotros',
    'about.cta2': 'Ver todos los Servicios',
    'about.insurance': 'Con la confianza de',
    'about.text1': 'En nuestra clínica bilingüe, estamos dedicados a brindar atención médica de alta calidad a los más pequeños. Nuestra visión está enfocada en el bienestar integral de cada niño, asegurando que crezcan sanos y felices.',
    'about.text2': 'Los pediatras son médicos de atención primaria (PCP) para niños, bebés y adolescentes. Están capacitados para atender las necesidades únicas de los niños a lo largo de todas sus etapas de desarrollo, mientras crecen y maduran.',
    'about.text3': 'Nuestro compromiso es claro: resolver tus dudas con un lenguaje sencillo, actuar con evidencia y estar disponibles cuando más nos necesites.',
    'about.stats.experience': 'Años de Experiencia',
    'about.stats.families': 'Familias Felices',
    'about.title.detail': 'Your Health Adult Care: Atención pediátrica bilingüe',
    'about.cta1.detail': 'Conoce Nuestro Equipo',
    'about.cta2.detail': 'Programar Cita',
    'about.mission.text1': 'En Your Health Adult Care promovemos la salud de niños y adolescentes (0–18) con atención accesible y de alta calidad. Queremos superar expectativas y ser la clínica pediátrica bilingüe preferida en Osceola.',
    'about.mission.text2': 'Osceola es diverso y cada vez más hispano; en Kissimmee, 60% habla español en casa. Por eso nuestro equipo es bilingüe y ofrece un trato cercano y respetuoso.',
    'about.mission.title': 'Nuestra Mision',
    'about.details.title2': 'Queremos cuidar a tus seres queridos',
    'about.vacunas': 'Vacunas',
    'about.vacunas.detail': 'Calendarios al día y orientación clara.',
    'about.enfermedades': 'Enfermedades comunes',
    'about.enfermedades.detail': 'Asma, alergias, infecciones.',
    'about.newborn': 'Recién nacidos',
    'about.newborn.detail': 'Apoyo a lactancia y desarrollo.',
    'about.peso': 'Peso saludable',
    'about.peso.detail': 'Hábitos y seguimiento personalizado.',
    'about.mission': 'Nuestra Misión',
    'mission.text1': 'La misión de Your Health Adult Care es promover la salud y el bienestar de la población pediátrica local, brindando atención accesible y de alta calidad a niños, desde recién nacidos hasta adolescentes (18 años). Your Health Adult Care aspira a brindar servicios que superen las expectativas de nuestros pacientes, resultando en niños sanos y padres felices, lo que la convierte en la clínica pediátrica bilingüe preferida en el condado de Osceola.',
    'mission.text2': 'Las estadísticas muestran que Osceola es uno de los condados de más rápido crecimiento en Florida y en la nación. Esto subraya la importancia de atender a un grupo diverso de culturas e idiomas en la zona. Por eso es fundamental para nosotros contar con pediatras y personal bilingüe en nuestra clínica.',
    'about.equipo': 'Atención humana, cercana y en tu idioma.',

    // Contactanos Strip
    'strip.number': 'Llámanos:',
    'strip.email': 'Correo:',
    'strip.location': 'Dirección:',

    // contact
    'contact.pretitle': 'Contactanos',
    'contact.title': '¡Estamos para ayudarte!',
    'contact.subtitle': 'Escríbenos o llámanos para agendar una consulta.',
    'contact.address.label': 'Dirección',
    'contact.address.openMap': 'Abrir en Google Maps',
    'contact.contact.label': 'Contacto',
    'contact.contact.email': 'Enviar correo',
    'contact.contact.phone': 'Llamar',
    'contact.hours.label': 'Horario',
    'contact.hours.weekdays': 'Lunes a Viernes:',
    'contact.hours.weekend': 'Sábado - Domingo:',
    'contact.hours.closed': 'Cerrado',
    'contact.follow.facebook': 'Síguenos en Facebook',
    'contact.map.title': 'Mapa de la clínica',
    'contact.map.open': 'Abrir en Google Maps',
    'contact.footer': '© {year} YouHealth Pediatrics. Todos los derechos reservados.',

    // Services
    'services.pretitle': 'Especialidades',
    'services.title': 'Atención amable, servicios de confianza',
    'services.subtitle': 'Comprometidos a brindarte el mejor servicio.',
    'services.hotline.title': 'Línea Directa de Enfermería 24/7',
    'services.hotline.desc': 'Orientación médica y apoyo las 24 horas',
    'services.flexible.title': 'Horarios Flexibles',
    'services.flexible.desc': 'Citas disponibles temprano en la mañana y por la noche',
    'services.cta.title': '¿Listo para Programar una Cita?',
    'services.cta.subtitle': 'Nuestro personal amable está listo para ayudarle a programar la próxima visita de su hijo. Aceptamos la mayoría de los planes de seguro y ofrecemos opciones de pago flexibles.',
    'services.schedule': 'Programar Cita',
    'services.call': 'Llámanos Hoy',
    'services.details': 'Ver Detalles',
    'service.seeAll.button': 'Ver todos los Servicios',
    'services.search.placeholder': 'Buscar servicios...',
    'services.search.noResults': 'No se encontraron servicios',
    'services.search.results': 'Resultados de búsqueda',
    'services.search.hint': 'Prueba con otra búsqueda',

    // Lista de servicios (array de objetos)
    'services.list': [
      { key: 'well-visit', title: 'Chequeos regulares', description: 'Chequeos regulares para asegurar un desarrollo y crecimiento saludable en cada etapa.' },
      { key: 'sick-visit', title: 'Visita por enfermedad', description: 'Atención médica cuando tu hijo presenta síntomas o malestar inesperado.' },
      { key: 'follow-up', title: 'Cita de seguimiento', description: 'Consultas para evaluar el progreso después de un tratamiento o diagnóstico.' },
      { key: 'immunizations', title: 'Inmunizaciones', description: 'Vacunas esenciales para proteger a tu hijo contra enfermedades prevenibles.' },
      { key: 'food-allergy-test', title: 'Prueba de alergia alimentaria', description: 'Evaluaciones para detectar posibles reacciones a alimentos comunes.' },
      { key: 'environmental-allergy-test', title: 'Prueba de alergia ambiental', description: 'Diagnóstico de alergias relacionadas con polvo, polen, mascotas u otros factores.' },
      { key: 'vision-screening', title: 'Examen de la vista', description: 'Prueba rápida para identificar problemas visuales que puedan afectar el aprendizaje.' },
      { key: 'audiology-screening', title: 'Examen de audición', description: 'Evaluación auditiva para asegurar un desarrollo óptimo del lenguaje y la comunicación.' },
      { key: 'obesity-care-plan', title: 'Plan de cuidado para la obesidad', description: 'Apoyo médico y nutricional para promover un peso saludable y hábitos de vida positivos.' },
      { key: 'asthma-care-plan', title: 'Plan de cuidado para el asma', description: 'Manejo personalizado para controlar síntomas y mejorar la calidad de vida.' },
      { key: 'adhd-care-plan', title: 'Plan de cuidado para TDAH', description: 'Estrategias y seguimiento para apoyar el desarrollo escolar y emocional de tu hijo.' },
    ],

    // Providers
    'providers.pretitle': 'Atención confiable',
    'providers.title': 'Nuestro Equipo',
    'providers.subtitle': 'Profesional comprometido para brindar el mejor servicio a tu familia.',
    'providers.dr1.title': 'Pediatra',
    'providers.dr1.education': 'La Dra. Acosta se graduó de la Facultad de Ciencias de la Salud de la Universidad de Carabobo en Valencia, Venezuela. Posteriormente completó su residencia en Pediatría en el Hospital Regional de Caguas, Puerto Rico, donde se desempeñó como jefa de residentes.',
    'providers.dr1.specialty1': 'Medicina Pediátrica General',
    'providers.dr1.specialty2': 'Cuidado del Recién Nacido',
    'providers.dr1.specialty3': 'Medicina del Adolescente',
    'providers.dr1.experience': '20+ years of experience',
    'providers.dr1.languages': 'Idiomas: Spanish, English',
    'providers.dr2.title': 'Pediatra',
    'providers.dr2.education': 'El Dr. Eduardo F. Acosta se graduó de la Escuela de Medicina de la Universidad Central del Este en la República Dominicana. Posteriormente completó su residencia en Pediatría en el Jersey Shore University Medical Center en Neptune, New Jersey.',
    'providers.dr2.specialty1': 'Medicina Pediátrica General',
    'providers.dr2.specialty2': 'Exámenes Deportivos',
    'providers.dr2.specialty3': 'Medicina Preventiva',
    'providers.dr2.experience': '20+ years of experience',
    'providers.dr2.languages': 'Idiomas: Spanish, English',
    'providers.education': 'Educación',
    'providers.specialties': 'Especialidades',
    'providers.experience': 'Experiencia',
    'providers.languages': 'Idiomas',
    'providers.cta.title': 'Encuentra tu proveedor',
    'providers.cta.subtitle': 'profesionales capacitados para brindar el mejor servicio a tu familia, horarios amplios para tu conveniencia y atención personalizada. Conócelos y reserva tu cita.',
    'providers.schedule': 'Programar Cita',
    'providers.meet': 'Conocer al Equipo',
    'provider.bio.dr1': 'La Dra. Martha I. Acosta es una médica consolidada y con experiencia que ha ejercido en Florida por más de 20 años. Es reconocida en el campo por brindar atención de calidad, centrada en el paciente, para niños desde recién nacidos hasta adolescentes.',
    'provider.bio.dr2': 'El Dr. Eduardo F. Bolumen es un pediatra capacitado y compasivo que ejerce en Florida. Ha brindado atención integral a lactantes, niños y adolescentes por más de dos décadas.',
    'provider.bio.dr2.text2': 'El Dr. Bolumen combina su experiencia con un enfoque compasivo para garantizar resultados óptimos de salud y promover el bienestar general.',
    'proider.cta': 'Ver mas',
    'provider.see.insurance': 'Ver planes aceptados',
    'provider.treated': 'Condiciones atendidas',

    // appointment
    'appointment.pretitle': 'Cómo funciona',
    'appointment.title': 'Proceso de cita',
    'appointment.subtitle': 'Sigue estos sencillos pasos para agendar tu cita.',
    'appointment.step1': 'Elige tu proveedor',
    'appointment.step2': 'Programa tu cita',
    'appointment.step3': 'Asiste a tu consulta',
    'appointment.step1.desc': 'Elige al especialista que mejor se adapte a tus necesidades.',
    'appointment.step2.desc': 'Llámenos o escríbanos y hable con nuestro equipo para encontrar la cita adecuada para usted.',
    'appointment.step3.desc': 'Asiste puntualmente a tu cita y prepárate para conversar sobre tus inquietudes con el proveedor.',

    // Clinica
    'clinic.pretitle': 'Nuestra oficina',
    'clinic.title': 'Espacio diseñado para la comodidad de tus pequeños.',
    'clinic.cta': 'Ver galería de fotos',

    // Adulto / Clínica para adultos (texto original)
    'adult.kicker': 'Clínica para adultos',
    'adult.heading': 'Clínica de adultos',
    'adult.tagline': 'Medicina primaria para adultos, servicio bilingüe en la misma localidad oficinas independientes.',

    'adult.hours': 'Lun–Vie 8:00 a.m.–5:00 p.m. · Sáb-Dom Cerrado',

    'adult.cta': 'Solicitar cita',
    'adult.ctaAria': 'Solicitar una cita',
    'adult.call': 'Llamar',
    'adult.callAria': 'Llamar a {{name}} al {{phone}}',

    'adult.asideTitle': 'Comodidades que te facilitan la vida',

    // Beneficios (texto original)
    'adult.benefits.bilingual.title': 'Equipo bilingüe',
    'adult.benefits.bilingual.desc': 'Atención en español e inglés',

    'adult.benefits.twoInSameLocation.title': 'Nuevos pacientes',
    'adult.benefits.twoInSameLocation.desc': 'Bienvenidos desde la primera llamada.',

    'adult.benefits.oneAddress.title': 'Una sola dirección',
    'adult.benefits.oneAddress.descWithAddress': '{{address}}, {{city}}',
    'adult.benefits.oneAddress.descWithCity': '{{city}}',

    'adult.benefits.insurance.title': 'Planes médicos',
    'adult.benefits.insurance.desc': 'Aceptamos planes medicos',

    'adult.websiteCta': 'Visítanos en la página web',


    // Provider Details
    'providers.click.details': 'Haz clic para ver detalles',
    'providers.back': 'Volver a Proveedores',
    'providers.about': 'Acerca del Doctor',
    'providers.education.certifications': 'Educación y Certificaciones',
    'providers.certifications': 'Certificaciones',
    'providers.location': 'Ubicación',
    'providers.schedule.appointment': 'Programar Cita',
    'providers.call.office': 'Llamar Oficina',
    'providers.ready.to.help': 'Listo para Ayudar',
    'providers.schedule.today': 'Programe su cita hoy y experimente la atención médica pediátrica excepcional.',
    'providers.book.appointment': 'Reservar Cita',
    'providers.dr1.bio': 'La Doctora Acosta se dedica a brindar atención médica integral y compasiva para niños de todas las edades. Con más de 12 años de experiencia en pediatría, se especializa en medicina pediátrica general, cuidado del recién nacido y medicina del adolescente.',
    'providers.dr1.certifications': 'Certificada por la Junta Americana de Pediatría, Certificación en Soporte Vital Pediátrico Avanzado (PALS)',
    'providers.dr1.philosophy': 'Creo en crear un ambiente cálido y acogedor donde los niños se sientan cómodos y seguros. Mi enfoque se centra en la medicina preventiva y en trabajar estrechamente con las familias para asegurar los mejores resultados de salud.',
    'providers.dr2.bio': 'El Dra. Thompson aporta más de 15 años de experiencia en pediatría, con un enfoque especial en medicina preventiva y exámenes deportivos. Es conocido por su enfoque paciente y su capacidad para conectar con niños de todas las edades.',
    'providers.dr2.certifications': 'Certificado por la Junta Americana de Pediatría, Certificación en Medicina Deportiva Pediátrica',
    'providers.dr2.philosophy': 'Mi filosofía se centra en la atención preventiva y en empoderar a las familias con el conocimiento que necesitan para mantener a sus hijos saludables. Creo en hacer que cada visita sea una experiencia positiva.',

    // Insurance
    'insurance.accepted.title': 'Planes de Seguro Aceptados',
    'insurance.images.title': 'Socios de Seguros Principales',
    'insurance.payment.title': 'Múltiples Métodos de Pago',
    'insurance.multiple.title': 'Múltiples Métodos de Pago',
    'insurance.multiple.desc': 'Para tu conveniencia, aceptamos efectivo, cheques y tarjetas de crédito.',
    'insurance.plans.title': 'Planes de Pago Disponibles',
    'insurance.plans.desc': 'Arreglos de pago flexibles para familias que califiquen',
    'insurance.billing.title': 'Facturación el Mismo Día',
    'insurance.billing.desc': 'Procesamiento rápido de seguros y facturación transparente',
    'insurance.assistance.title': 'Asistencia Financiera Disponible',
    'insurance.assistance.desc': 'Creemos que cada niño merece atención médica de calidad. Ofrecemos tarifas de escala móvil y programas de asistencia de pago para familias que califiquen.',
    'insurance.assistance.learn': 'Más Información Sobre Asistencia',
    'insurance.questions.title': '¿Preguntas sobre Seguros?',
    'insurance.questions.subtitle': 'Nuestros especialistas en facturación están aquí para ayudar a verificar su cobertura, explicar beneficios y responder cualquier pregunta sobre costos u opciones de pago.',
    'insurance.call.department': 'Llamar Departamento de Seguros',
    'insurance.request.verification': 'Solicitar Verificación de Cobertura',


    // insurance
    'insurance.title': 'Aceptamos planes medicos!',
    'insurance.subtitle': 'Trabajamos con proveedores de seguros para hacer que la atención pediátrica de calidad sea accesible y asequible para su familia.',
    'insurance.search': 'Buscar mi seguro',
    'insurance.inline': '¿Quieres saber si tu plan está cubierto?',

    // awards strip
    // Etiquetas generales del componente
    'awards.label': 'Reconocimiento',
    'awards.regionLabel': 'Franja de reconocimientos y premios',
    'awards.linkLabel': 'Abrir enlace del reconocimiento: {{title}}',
    // NCQA
    'awards.ncqa.title': 'NCQA 2024 y 2025: Procesos de Gestión de la Atención Centrados en el Paciente y Coordinados (dos años consecutivos)',
    'awards.ncqa.alt': 'Reconocimiento NCQA 2024 y 2025 - Procesos de gestión de la atención centrados en el paciente y coordinados',
    // AdventHealth
    'awards.adventHealth.title': 'AdventHealth: Premio a la Excelencia 2024 — Top 5 Percentil en Integridad de la Documentación',
    'awards.adventHealth.alt': 'AdventHealth Premio a la Excelencia 2024 (Top 5% Integridad de la Documentación)',

    // adults
    'adults.sectionLabel': 'Sección de clínica de adultos',
    'adults.title': 'Clínica de Adultos',
    'adults.subtitle': 'Atención médica integral y de calidad para adultos en todas las etapas de la vida.',

    'adults.experience.srOnly': 'Más de diez años de experiencia',
    'adults.experience.label': 'años de experiencia',

    'adults.button.label': 'Ver nuestra clínica de adultos',
    'adults.button.aria': 'Abrir la página de la clínica de adultos',

    // Location
    'location.title': 'Nuestra Ubicación',
    'location.subtitle': 'Visítenos en nuestra conveniente ubicación en Kissimmee, Florida. Somos fácilmente accesibles y ofrecemos amplio estacionamiento para su comodidad.',
    'location.visit.title': 'Visite Nuestra Clínica',
    'location.directions': 'Obtener Direcciones',
    'location.contact.title': 'Información de Contacto',
    'location.phone': 'Teléfono',
    'location.fax': 'Fax',
    'location.email': 'Correo',
    'location.hours.title': 'Horarios de Oficina',
    'location.hours.weekdays': 'Lunes - Viernes',
    'location.hours.saturday': 'Sábado',
    'location.hours.sunday': 'Sábado - Domingo',
    'location.hours.closed': 'Cerrado',
    'location.hours.emergency': '*Citas de emergencia disponibles',
    'location.ready.title': '¿Listo para Programar su Visita?',
    'location.call': 'Llamar (936) 582-5620',


    // Formulario
    'contact.form.title': 'Agenda o consulta',
    'contact.form.subtitle': 'Completa el formulario y te responderemos a la brevedad.',
    'contact.form.success': '¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.',

    'contact.form.buttons.submit': 'Enviar mensaje',
    'contact.form.buttons.sending': 'Enviando...',

    'contact.form.fields.name.label': 'Nombre del padre o tutor legal',
    'contact.form.fields.patientName.label': 'Nombre de paciente',
    'contact.form.fields.name.placeholder': 'Nombre',
    'contact.form.fields.patientName.placeholder': 'Nombre',

    "contact.form.fields.reason.options.select": "Selecciona una opcion",
    "contact.form.errors.phoneRequired": "Por favor, escribe un número de teléfono válido.",
    "contact.form.errors.reason": "Por favor, selecciona un motivo.",
    "contact.form.errors.patientName": "Por favor, escribe el nombre del paciente.",

    "contact.form.done.title": "¡Mensaje enviado!",
    "contact.form.done.subtitle": "Gracias por escribirnos. Te contactaremos pronto por teléfono o email.",
    "contact.form.done.actions.new": "Enviar otro mensaje",
    "contact.form.done.actions.call": "Llamar a la clínica",


    'contact.form.fields.email.label': 'Correo electrónico',
    'contact.form.fields.email.placeholder': 'correo@ejemplo.com',

    'contact.form.fields.phone.label': 'Teléfono',
    'contact.form.fields.phone.placeholder': '(000) 000-0000',

    'contact.form.fields.reason.label': 'Motivo principal',
    'contact.form.fields.reason.options.wellvisit': 'Niño sano',
    'contact.form.fields.reason.options.sickvisit': 'Niño enfermo',
    'contact.form.fields.reason.options.vaccine': 'Vacunas/inmunizaciones',
    'contact.form.fields.reason.options.other': 'Otro',

    'contact.form.fields.appointmentType.label': 'Tipo de cita',
    'contact.form.fields.appointmentType.aria': 'Tipo de cita',
    'contact.form.fields.appointmentType.options.new': 'Nueva',
    'contact.form.fields.appointmentType.options.followup': 'Seguimiento',

    'contact.form.fields.doctor.label': 'Doctor preferido',
    'contact.form.fields.doctor.optional': 'opcional',
    'contact.form.fields.doctor.placeholder': '— Selecciona un doctor —',
    'contact.form.fields.doctor.help': 'Si no tienes preferencia, deja la opción por defecto.',

    'contact.form.fields.message.label': 'Mensaje',
    'contact.form.fields.message.placeholder': 'Escribe tu consulta...',

    // (Si habilitas la casilla de política)
    'contact.form.fields.privacy.label': 'Acepto la política de privacidad.',

    // Errores del formulario (validación y envío)
    'contact.form.errors.name': 'Por favor escribe tu nombre.',
    'contact.form.errors.email': 'Ingresa un correo válido.',
    'contact.form.errors.phone': 'El teléfono parece incompleto.',
    'contact.form.errors.message': 'Cuéntanos brevemente tu consulta.',
    'contact.form.errors.privacy': 'Debes aceptar la política de privacidad.',
    'contact.form.errors.bot': 'Bot detectado.',
    'contact.form.errors.send': 'No se pudo enviar el formulario.',
    'contact.form.errors.unknown': 'Ocurrió un error al enviar. Intenta nuevamente o llámanos.',

    // Tarjeta de información
    'contact.info.title': 'Información de contacto',
    'contact.info.fax': 'Fax',

    // Social
    'contact.social.facebookAria': 'Abrir Facebook en nueva pestaña',
    'contact.social.instagramAria': 'Abrir Instagram en nueva pestaña',



    // Marca y tagline
    'footer.brand': 'Your Health Adult Care',
    'footer.tagline': 'Cuidando la salud de tus pequeños con dedicación y cariño.',
    'footer.cta': 'Agendar cita',
    'footer.ctaAria': 'Agendar cita',

    // Navegación
    'footer.nav.title': 'Enlaces',
    'footer.nav.home': 'Inicio',
    'footer.nav.services': 'Servicios',
    'footer.nav.about': 'Nosotros',
    'footer.nav.contact': 'Contacto',
    'footer.nav.appointment': 'Agendar cita',

    // Social
    'footer.social.title': 'Redes',
    'footer.social.facebook': 'Facebook',
    'footer.social.instagram': 'Instagram',
    'footer.social.facebookAria': 'Abrir Facebook en nueva pestaña',
    'footer.social.instagramAria': 'Abrir Instagram en nueva pestaña',

    // Contacto
    'footer.contact.title': 'Contáctanos',
    'footer.contact.phoneDisplay': '(407)554-5707',
    'footer.contact.emailAria': 'Abrir cliente de correo',
    'footer.contact.address.line1': '201 Hilda St Suite # 10',
    'footer.contact.address.line2': 'Kissimmee, FL 34741',

    // Horarios
    'footer.hours.title': 'Horarios',
    'footer.hours.weekdays': 'Lunes – Viernes: 7:30 AM – 4:30 PM',
    'footer.hours.weekend': 'Sábados – Domingo: Cerrado',

    // Derechos
    'footer.copyright': 'Todos los derechos reservados.',

  },

  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.insurance': 'Insurance',
    'nav.providers': 'Providers',
    'nav.clinic': 'Clinic',
    'nav.contact': 'Contact',
    'nav.explore': 'Schedule Appointment',
    'nav.gallery': 'Gallery',
    'nav.language': 'Language',
    'nav.process': 'Process',

    // Hero Banner
    'hero.pretitle': 'FAMILY CARE',
    'hero.subtitle': "Close and reliable services to care for what matters most: your family.",
    'hero.contact': 'Schedule an appointment',
    'hero.portal': 'Explore Services',

    // About Us
    'about.pretitle': 'About Us',
    'about.title': 'Your trusted Experts',
    'about.subtitle': 'Prevention, clarity, and science in every consultation.',
    'about.bullet1': 'Vaccine calendar up to date',
    'about.bullet2': 'Growth and development check-ups',
    'about.bullet3': 'Breastfeeding and infant nutrition',
    'about.cta1': 'Learn more about us',
    'about.cta2': 'See all Services',
    'about.insurance': 'Trusted by',
    'about.text1': 'At our bilingual clinic, we are dedicated to providing high-quality medical care for the little ones. Our vision is focused on the comprehensive well-being of each child, ensuring they grow up healthy and happy.',
    'about.text2': 'Pediatricians are primary care physicians (PCPs) for children, infants, and adolescents. They are trained to meet the unique needs of children, through all of their developmental stages, as they grow and mature.',
    'about.text3': 'We provide vaccines, manage common illnesses (asthma, allergies, infections), offer newborn guidance, and support healthy weight management, among other pediatric needs.',
    'about.text4': 'Our commitment is clear: to resolve your doubts in simple language, act with evidence, and be available when you need us most.',
    'about.stats.experience': 'Years of Experience',
    'about.stats.families': 'Happy Families',
    'about.title.detail': 'Your Health Adult Care: Bilingual Pediatric Care',
    'about.cta1.detail': 'Meet Our Providers',
    'about.cta2.detail': 'Schedule Apointment',
    'about.mission.title': 'Our Mission',
    'about.details.title2': 'We want to take care of your loved ones',
    'about.vacunas': 'Vaccines',
    'about.vacunas.detail': 'Up to date calendars and clear guidance.',
    'about.enfermedades': 'Common illnesses',
    'about.enfermedades.detail': 'Asthma, allergies, infections',
    'about.newborn': 'Newborns',
    'about.newborn.detail': 'Breastfeeding and development support',
    'about.peso': 'Healthy weight',
    'about.peso.detail': 'Habits and personalized follow up.',
    'about.mission': 'Our Mission',
    'mission.text1': "The mission of Your Health Adult Care is to promote the health and well-being of the local pediatric population by providing accessible, high-quality care to children from newborns to adolescents (18 years and older). Your Health Adult Care aspires to provide services that exceed our patients' expectations, resulting in healthy children and happy parents, making it the preferred bilingual pediatric clinic in Osceola County.",
    'mission.text2': "Statistics show that Osceola is one of the fastest-growing counties in Florida and the nation. This underscores the importance of serving a diverse group of cultures and languages ​​in the area. That's why it's critical for us to have bilingual pediatricians and staff at our clinic.",
    'about.equipo': 'Human attention, close and in your language.',
    'about.mission.text1': 'At Your Health Adult Care, we promote the health of children and adolescents (0–18) with accessible, high-quality care. We aim to exceed expectations and be Osceola’s preferred bilingual pediatric clinic.',
    'about.mission.text2': 'Osceola is diverse and increasingly Hispanic; in Kissimmee, 60% speak Spanish at home. That’s why our team is bilingual and offers warm, respectful care.',


    // ContactanosStrip
    'strip.number': 'Call us:',
    'strip.email': 'Email:',
    'strip.location': 'Location:',

    // contact
    'contact.pretitle': 'Contact Us',
    'contact.title': "We’re here to help!",
    'contact.subtitle': "Write to us or call us to schedule a consultation.",
    'contact.address.label': 'Address',
    'contact.address.openMap': 'Open in Google Maps',
    'contact.contact.label': 'Contact',
    'contact.contact.email': 'Send email',
    'contact.contact.phone': 'Call',
    'contact.hours.label': 'Hours',
    'contact.hours.weekdays': 'Monday to Friday:',
    'contact.hours.weekend': 'Saturday - Sunday:',
    'contact.hours.closed': 'Closed',
    'contact.follow.facebook': 'Follow us on Facebook',
    'contact.map.title': 'Clinic map',
    'contact.map.open': 'Open in Google Maps',
    'contact.footer': '© {year} YouHealth Pediatrics. All rights reserved.',

    // Services
    'services.pretitle': 'Specialities',
    'services.title': 'Gentle Care, Trusted Services',
    'services.subtitle': 'Committed to providing you with the best service.',
    'services.cta.title': 'Ready to Schedule an Appointment?',
    'services.cta.subtitle': "Our friendly staff is ready to help you schedule your child's next visit. We accept most insurance plans and offer flexible payment options.",
    'services.call': 'Call Us Today',
    'services.details': 'View Details',
    'service.seeAll.button': 'See all Services',
    'services.search.placeholder': 'Search services...',
    'services.search.noResults': 'No services found',
    'services.search.hint': 'Search service name',
    'services.search.empty': 'No results to display.',

    // Services list (array of objects)
    'services.list': [
      { key: 'well-visit', title: 'Well Visit', description: 'Regular checkups to ensure healthy growth and development at every stage.' },
      { key: 'sick-visit', title: 'Sick Visit', description: 'Medical care when your child is experiencing unexpected symptoms or discomfort.' },
      { key: 'follow-up', title: 'Follow-up Appointment', description: 'Visits to monitor progress after a treatment or diagnosis.' },
      { key: 'immunizations', title: 'Immunizations', description: 'Essential vaccines to protect your child against preventable diseases.' },
      { key: 'food-allergy-test', title: 'Food Allergy Test', description: 'Evaluations to detect possible reactions to common foods.' },
      { key: 'environmental-allergy-test', title: 'Environmental Allergy Test', description: 'Diagnosis of allergies related to dust, pollen, pets, or other triggers.' },
      { key: 'vision-screening', title: 'Vision Screening', description: 'Quick test to identify vision problems that may affect learning.' },
      { key: 'audiology-screening', title: 'Audiology Screening', description: 'Hearing evaluation to ensure healthy language and communication development.' },
      { key: 'obesity-care-plan', title: 'Obesity Care Plan', description: 'Medical and nutritional support to encourage healthy weight and lifestyle habits.' },
      { key: 'asthma-care-plan', title: 'Asthma Care Plan', description: 'Personalized management to control symptoms and improve quality of life.' },
      { key: 'adhd-care-plan', title: 'ADHD Care Plan', description: 'Strategies and follow-up to support your child’s academic and emotional development.' },
    ],

    // Providers
    'providers.pretitle': 'Trusted Care',
    'providers.title': 'Our Providers',
    'providers.subtitle': 'Committed professional to provide the best service to your family.',
    'providers.dr1.title': 'Pediatrician',
    'providers.dr1.education': " Dr. Acosta graduated from the Faculty of Health Sciences at the University of Carabobo in Valencia, Venezuela. She subsequently completed her residency in Pediatrics at the Regional Hospital of Caguas, Puerto Rico, where she served as chief resident.",
    'providers.dr1.specialty1': 'General Pediatric Medicine',
    'providers.dr1.specialty2': 'Newborn Care',
    'providers.dr1.specialty3': 'Adolescent Medicine',
    'providers.dr1.experience': '20+ years of experience',
    'providers.dr1.languages': 'Language: Spanish, English',
    'providers.dr2.title': 'Pediatrician',
    'providers.dr2.education': 'Dr. Eduardo F. Acosta graduated from the Universidad Central del Este School of Medicine in the Dominican Republic. He subsequently completed his residency in Pediatrics at Jersey Shore University Medical Center in Neptune, New Jersey.',
    'providers.dr2.specialty1': 'General Pediatric Medicine',
    'providers.dr2.specialty2': 'Sports Physicals',
    'providers.dr2.specialty3': 'Preventive Medicine',
    'providers.dr2.experience': '20+ years of experience',
    'providers.dr2.languages': 'Language: Spanish, English',
    'providers.education': 'Education',
    'providers.specialties': 'Specialties',
    'providers.experience': 'Experience',
    'providers.languages': 'Languages',
    'providers.cta.title': 'Ready to Meet Our Providers?',
    'providers.cta.subtitle': 'Schedule an appointment today and experience the exceptional pediatric healthcare your child deserves.',
    'providers.schedule': 'Schedule Appointment',
    'providers.meet': 'Meet the Team',
    'provider.bio.dr1': 'Dr. Martha I. Acosta is an established and skilled physician who has practiced in Florida for over 20 years. She is recognized in the field for providing quality, patient centered care for children from newborns to adolescents.',
    'provider.bio.dr2': 'Dr. Eduardo F. Bolumen is a skilled and compassionate pediatrician practicing in Florida. He has provided comprehensive care to infants, children, and adolescents for over two decades.',
    'proider.cta': 'See more',
    'provider.bio.dr2.text2': 'Dr. Bolumen combines his experience with a compassionate approach to ensure optimal health outcomes and promote overall well-being.',
    'provider.see.insurance': 'See insurance covered by this doctor',
    'provider.treated': 'Conditions Treated',

    // appointment
    'appointment.pretitle': 'How it works',
    'appointment.title': 'Appointment Process',
    'appointment.subtitle': 'Follow these simple steps to book your appointment.',
    'appointment.step1': 'Choose your provider',
    'appointment.step2': 'Schedule your appointment',
    'appointment.step3': 'Attend your consultation',
    'appointment.step1.desc': 'Choose the specialist that best fits your needs.',
    'appointment.step2.desc': 'Call or message us and speak with our team to find the appointment that’s right for you.',
    'appointment.step3.desc': 'Join your appointment on time and be prepared to discuss your concerns with the provider.',

    // Clinica
    'clinic.pretitle': 'Our office',
    'clinic.title': 'A Place Designed for Your Little Ones’ Comfort',
    'clinic.cta': 'View Gallery',

    // Adult / Clinic for adults (traducción fiel del original)
    'adult.kicker': 'Clinic for adults',
    'adult.heading': 'Adult clinic',
    'adult.tagline': 'Primary care for adults, bilingual service in the same location independent offices.',

    'adult.hours': 'Mon–Fri 8:00 a.m.–5:00 p.m. · Sat-Sun Closed',

    'adult.cta': 'Request appointment',
    'adult.ctaAria': 'Request an appointment',
    'adult.call': 'Call',
    'adult.callAria': 'Call {{name}} at {{phone}}',

    'adult.asideTitle': 'Amenities that make your life easier',

    // Benefits
    'adult.benefits.bilingual.title': 'Bilingual team',
    'adult.benefits.bilingual.desc': 'Care in Spanish and English',

    'adult.benefits.twoInSameLocation.title': 'New Patients',
    'adult.benefits.twoInSameLocation.desc': 'Welcome from day one.',


    'adult.benefits.oneAddress.title': 'Single address',
    'adult.benefits.oneAddress.descWithAddress': '{{address}}, {{city}}',
    'adult.benefits.oneAddress.descWithCity': '{{city}}',

    'adult.benefits.insurance.title': 'Medical plans',
    'adult.benefits.insurance.desc': 'We accept medical plans',

    'adult.websiteCta': 'Visit us on the website',


    // Provider Details
    'providers.click.details': 'Click for details',
    'providers.back': 'Back to Providers',
    'providers.about': 'About the Doctor',
    'providers.education.certifications': 'Education & Certifications',
    'providers.certifications': 'Certifications',
    'providers.location': 'Location',
    'providers.schedule.appointment': 'Schedule Appointment',
    'providers.call.office': 'Call Office',
    'providers.ready.to.help': 'Ready to Help',
    'providers.schedule.today': 'Schedule your appointment today and experience exceptional pediatric healthcare.',
    'providers.book.appointment': 'Book Appointment',
    'providers.dr1.bio': 'Dra. Rodriguez is dedicated to providing comprehensive, compassionate healthcare for children of all ages. With over 12 years of experience in pediatrics, she specializes in general pediatric medicine, newborn care, and adolescent medicine.',
    'providers.dr1.certifications': 'Board Certified by the American Board of Pediatrics, Pediatric Advanced Life Support (PALS) Certification',
    'providers.dr1.philosophy': 'I believe in creating a warm, welcoming environment where children feel comfortable and safe. My approach focuses on preventive medicine and working closely with families to ensure the best health outcomes.',
    'providers.dr2.bio': 'Dr. Thompson brings over 15 years of pediatric experience, with a special focus on preventive medicine and sports physicals. He is known for his patient approach and ability to connect with children of all ages.',
    'providers.dr2.certifications': 'Board Certified by the American Board of Pediatrics, Pediatric Sports Medicine Certification',
    'providers.dr2.philosophy': 'My philosophy centers on preventive care and empowering families with the knowledge they need to keep their children healthy. I believe in making every visit a positive experience.',

    // Insurance
    'insurance.title': 'We Accept Insurance!',
    'insurance.search': 'Search my insurance',
    'insurance.subtitle': 'We work with insurance providers to make quality pediatric care accessible and affordable for your family.',
    'insurance.accepted.title': 'Accepted Insurance Plans',
    'insurance.images.title': 'Major Insurance Partners',
    'insurance.not.listed': "Don't see your insurance listed?",
    'insurance.verify': 'Insurance plans change frequently. Please call our office to verify your specific plan coverage and benefits.',
    'insurance.payment.title': 'Payment Options',
    'insurance.multiple.title': 'Multiple Payment Methods',
    'insurance.multiple.desc': ' For your convenience we accept cash, check, and credit cards',
    'insurance.plans.title': 'Payment Plans Available',
    'insurance.plans.desc': 'Flexible payment arrangements for qualifying families',
    'insurance.billing.title': 'Same-Day Billing',
    'insurance.billing.desc': 'Quick insurance processing and transparent billing',
    'insurance.assistance.title': 'Financial Assistance Available',
    'insurance.assistance.desc': 'We believe every child deserves quality healthcare. We offer sliding scale fees and payment assistance programs for qualifying families.',
    'insurance.assistance.learn': 'Learn More About Assistance',
    'insurance.questions.title': 'Insurance Questions?',
    'insurance.questions.subtitle': 'Our billing specialists are here to help verify your coverage, explain benefits, and answer any questions about costs or payment options.',
    'insurance.call.department': 'Call Insurance Department',
    'insurance.request.verification': 'Request Coverage Verification',
    'insurance.inline': 'Want to know if your plan is covered?',

    // awards strip
    // General labels
    'awards.label': 'Award',
    'awards.regionLabel': 'Awards and recognitions strip',
    'awards.linkLabel': 'Open award link: {{title}}',
    // NCQA
    'awards.ncqa.title': 'NCQA 2024 & 2025: Patient-Centered, Coordinated Care Management Processes (two consecutive years)',
    'awards.ncqa.alt': 'NCQA Recognition 2024 & 2025 - Patient-Centered, Coordinated Care Management Processes',
    // AdventHealth
    'awards.adventHealth.title': 'AdventHealth: Award for Excellence 2024 — Top 5 Percentile in Documentation Integrity',
    'awards.adventHealth.alt': 'AdventHealth Award for Excellence 2024 (Top 5% Documentation Integrity)',

    // adults
    'adults.sectionLabel': 'See our Adults Clinic! section',
    'adults.title': 'See our Adults Clinic!',
    'adults.subtitle': 'Comprehensive, high-quality care for adults at every stage of life.',

    'adults.experience.srOnly': 'More than ten years of experience',
    'adults.experience.label': 'years of experience',

    'adults.button.label': 'View our adult clinic',
    'adults.button.aria': 'Open adult clinic page',
    // Location
    'location.title': 'Our Location',
    'location.subtitle': "Visit us at our convenient location in Montgomery, Texas. We're easily accessible and offer ample parking for your convenience.",
    'location.visit.title': 'Visit Our Clinic',
    'location.directions': 'Get Directions',
    'location.contact.title': 'Contact Information',
    'location.phone': 'Phone',
    'location.fax': 'Fax',
    'location.email': 'Email',
    'location.hours.title': 'Office Hours',
    'location.hours.weekdays': 'Monday - Friday',
    'location.hours.saturday': 'Saturday',
    'location.hours.sunday': 'Sunday',
    'location.hours.closed': 'Closed',
    'location.hours.emergency': '*Emergency appointments available',
    'location.ready.title': 'Ready to Schedule Your Visit?',
    'location.call': 'Call (936) 582-5620',

    // Form
    'contact.form.title': 'Schedule or inquiry',
    'contact.form.subtitle': 'Fill out the form and we will get back to you shortly.',
    'contact.form.success': 'Thanks! We received your message and will contact you soon.',

    'contact.form.buttons.submit': 'Send message',
    'contact.form.buttons.sending': 'Sending...',

    'contact.form.fields.name.label': 'Parent or Legal Guardian Name',
    'contact.form.fields.patientName.label': 'Patient Name',
    'contact.form.fields.name.placeholder': 'Name',
    'contact.form.fields.patientName.placeholder': 'Name',

    "contact.form.fields.reason.options.select": "Select main reason",
    "contact.form.errors.phoneRequired": "Por favor, escribe un número de teléfono válido.",
    "contact.form.errors.reason": "Por favor, selecciona un motivo.",
    "contact.form.errors.patientName": "Por favor, escribe el nombre del paciente.",


    "contact.form.done.title": "Message sent!",
    "contact.form.done.subtitle": "Thanks for reaching out. We’ll contact you soon by phone or email.",
    "contact.form.done.actions.new": "Send another message",
    "contact.form.done.actions.call": "Call the clinic",


    'contact.form.fields.email.label': 'Email',
    'contact.form.fields.email.placeholder': 'email@example.com',

    'contact.form.fields.phone.label': 'Phone',
    'contact.form.fields.phone.placeholder': '(000) 000-0000',


    "contact.form.fields.reason.label": "Main reason",
    "contact.form.fields.reason.options.wellvisit": "Well visit",
    "contact.form.fields.reason.options.sickvisit": "Sick visit",
    "contact.form.fields.reason.options.vaccine": "Vaccines/Immunizations",
    "contact.form.fields.reason.options.other": "Other",

    'contact.form.fields.appointmentType.label': 'Appointment type',
    'contact.form.fields.appointmentType.aria': 'Appointment type',
    'contact.form.fields.appointmentType.options.new': 'New',
    'contact.form.fields.appointmentType.options.followup': 'Follow-up',

    'contact.form.fields.doctor.label': 'Preferred doctor',
    'contact.form.fields.doctor.optional': 'optional',
    'contact.form.fields.doctor.placeholder': '— Select a doctor —',
    'contact.form.fields.doctor.help': 'If you have no preference, leave the default option.',

    'contact.form.fields.message.label': 'Message',
    'contact.form.fields.message.placeholder': 'Write your inquiry...',

    // (If you enable the policy checkbox)
    'contact.form.fields.privacy.label': 'I accept the privacy policy.',

    // Form errors (validation & sending)
    'contact.form.errors.name': 'Please enter your name.',
    'contact.form.errors.email': 'Enter a valid email.',
    'contact.form.errors.phone': 'The phone number seems incomplete.',
    'contact.form.errors.message': 'Tell us briefly about your inquiry.',
    'contact.form.errors.privacy': 'You must accept the privacy policy.',
    'contact.form.errors.bot': 'Bot detected.',
    'contact.form.errors.send': 'The form could not be sent.',
    'contact.form.errors.unknown': 'An error occurred while sending. Please try again or call us.',

    // Info card
    'contact.info.title': 'Contact information',
    'contact.info.fax': 'Fax',

    // Social
    'contact.social.facebookAria': 'Open Facebook in a new tab',
    'contact.social.instagramAria': 'Open Instagram in a new tab',



    // Brand and tagline
    'footer.brand': 'Your Health Adult Care',
    'footer.tagline': 'Caring for your little ones with dedication and kindness.',
    'footer.cta': 'Book appointment',
    'footer.ctaAria': 'Book appointment',

    // Navigation
    'footer.nav.title': 'Links',
    'footer.nav.home': 'Home',
    'footer.nav.services': 'Services',
    'footer.nav.about': 'About',
    'footer.nav.contact': 'Contact',
    'footer.nav.appointment': 'Book appointment',

    // Social
    'footer.social.title': 'Social',
    'footer.social.facebook': 'Facebook',
    'footer.social.instagram': 'Instagram',
    'footer.social.facebookAria': 'Open Facebook in a new tab',
    'footer.social.instagramAria': 'Open Instagram in a new tab',

    // Contact
    'footer.contact.title': 'Contact us',
    'footer.contact.phoneDisplay': '(407)554-5707',
    'footer.contact.emailAria': 'Open email client',
    'footer.contact.address.line1': '201 Hilda St Suite # 10',
    'footer.contact.address.line2': 'Kissimmee, FL 34741',

    // Hours
    'footer.hours.title': 'Hours',
    'footer.hours.weekdays': 'Monday – Friday: 7:30 AM – 4:30 PM',
    'footer.hours.weekend': 'Saturday – Sunday: Closed',

    // Rights
    'footer.copyright': 'All rights reserved.',
  },
};

/* ===================== Context ===================== */

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

/* ===================== Utils ===================== */

function interpolate(src: string, params: Record<string, string | number>): string {
  return src.replace(/\{(\w+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`
  );
}

/* ===================== Provider & Hook ===================== */

type ProviderProps = { children: ReactNode };

export function TranslationProvider({ children }: ProviderProps) {
  const [language, setLanguage] = useState<Language>('en'); // default: en

  const raw = (key: string): TranslationValue | undefined => translations[language][key];

  /** t: siempre string (fallback a la clave si no es string) */
  const t = (key: string): string => {
    const v = raw(key);
    return typeof v === 'string' ? v : key;
    // Si prefieres devolver '' cuando no es string:
    // return typeof v === 'string' ? v : '';
  };

  /** tFormat: interpolación {var} con fallback a la clave si no es string */
  const tFormat = (key: string, params: Record<string, string | number>): string => {
    const v = raw(key);
    return typeof v === 'string' ? interpolate(v, params) : key;
  };

  /** tArray: siempre array; tipa con genérico al consumir */
  const tArray = <T = unknown,>(key: string): T[] => {
    const v = raw(key);
    return Array.isArray(v) ? (v as T[]) : [];
  };

  // 👇 value exactamente del tipo TranslationContextType
  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    tFormat,
    tArray,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
