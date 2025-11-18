// app/contexts/TranslationContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Language = 'es' | 'en';

export interface ServiceTranslation {
  key: string;
  title: string;
  description: string;
  longDescription?: string;
  tags?: string[];
}

type TranslationValue = string | string[] | ServiceTranslation[];

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tFormat: (key: string, params: Record<string, string | number>) => string;
  tArray: <T = unknown>(key: string) => T[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);


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

    // Hero Banner
    'hero.pretitle': 'CUIDADO FAMILIAR',
    'hero.subtitle': 'Servicios médicos cercanos y confiables para cuidar lo más valioso: tu familia.',
    'hero.contact': 'Programar una cita',
    'hero.portal': 'Explorar servicios',

    // About Us
    'about.pretitle': 'Sobre nosotros',
    'about.title': 'Tus expertos de confianza',
    'about.subtitle': 'Prevención, claridad y ciencia en cada consulta.',
    'about.bullet1': 'Tratamos enfermedades agudas como resfriados, gripe y neumonía.',
    'about.bullet2': 'Manejamos asma, diabetes y problemas cardíacos.',
    'about.bullet3': 'Ayudamos con colesterol alto, presión arterial alta y obesidad.',
    'about.cta1': 'Más sobre nosotros',
    'about.cta2': 'Ver todos los Servicios',
    'about.insurance': 'Con la confianza de',
    'about.text1': 'Un médico de atención primaria ofrece atención médica continua y completa. Es el primer punto de contacto para chequeos preventivos, tratamiento de enfermedades comunes y coordinación con especialistas cuando es necesario.',
    'about.text2': 'En Your Health Adult Care tratamos una amplia variedad de condiciones agudas y crónicas, como diabetes, hipertensión, enfermedades del corazón y asma. Nuestros médicos brindan atención compasiva y personalizada, adaptada a las necesidades de cada paciente.',
    'about.text3': 'Te ayudamos a mantener tu bienestar con chequeos regulares, medicina preventiva, laboratorios, vacunas y atención bilingüe en un ambiente cálido y profesional.',
    'about.stats.families': 'Familias Felices',
    'about.stats.experience': 'Años de Experiencia',

    // detalles de about us (TODO)
    'about.title.detail': 'Your Health Adult Care: Atención médica bilingüe',
    'about.text1.detail': 'Un médico de atención primaria (PCP, por sus siglas en inglés) es un profesional de la salud, generalmente un médico general, que brinda atención médica integral y a largo plazo. Son el primer punto de contacto para la mayoría de los problemas de salud, desde chequeos rutinarios y preventivos hasta el tratamiento de enfermedades comunes. También pueden derivar a los pacientes a especialistas y coordinar su atención.',
    'about.text2.detail': 'En Your Health Adult Care, nuestros médicos de atención primaria se especializan en el tratamiento de afecciones agudas y crónicas, como colesterol alto e hipertensión, diabetes, enfermedades cardíacas, asma, medicina geriátrica y atención de lesiones menores. También ofrecen desde chequeos anuales hasta inmunizaciones. Permita que nuestros médicos de familia con experiencia le brinden una atención compasiva y personalizada.',
    'about.text3.detail': 'Le ayudaremos a mantenerse saludable con chequeos regulares, recuperarse de lesiones y manejar afecciones agudas y crónicas. En YHAC, recibirá una atención integral que incluye medicina preventiva para adultos, cuidado de personas mayores, servicios de laboratorio, inmunizaciones, atención de lesiones menores y un personal amable y bilingüe.',



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
    'contact.portal.qr.label': 'Pacientes existentes',
    'contact.portal.qr.desc': '¿Ya eres paciente y tienes récord con nosotros? Accede a tu portal del paciente.',
    'contact.portal.qr.scan': 'Escanea el código con la cámara de tu teléfono',
    'contact.portal.qr.visit': 'Visita nuestro portal del paciente',
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
      {
        key: 'preventive-medicine',
        title: 'Medicina preventiva',
        description: 'Pruebas médicas y tratamientos que pueden ayudarte a evitar enfermedades innecesarias y a detectar a tiempo una condición de salud potencialmente peligrosa, cuando aún está en su etapa más temprana y tratable.',
      },
      {
        key: 'adult-immunizations',
        title: 'Inmunizaciones para adultos',
        description: 'Nuestros médicos ofrecen todas las inmunizaciones recomendadas por los CDC, incluyendo las que te protegen contra la influenza (gripe), infecciones neumocócicas, VPH, hepatitis, culebrilla (herpes zóster), VRS y más.',
      },
      {
        key: 'minor-illness-diagnosis',
        title: 'Diagnóstico y tratamiento de enfermedades menores',
        description: 'Evaluación y tratamiento de enfermedades agudas comunes, como el resfriado o la gripe, que no requieren hospitalización.',
      },
      {
        key: 'minor-injury-treatment',
        title: 'Diagnóstico y tratamiento de lesiones menores',
        description: 'Evaluación y tratamiento de lesiones que no ponen en riesgo la vida y que comúnmente pueden manejarse en el consultorio de un médico de atención primaria.',
      },
      {
        key: 'chronic-disease-management',
        title: 'Manejo de enfermedades crónicas',
        description: 'Monitoreo regular y tratamiento de enfermedades crónicas que van desde enfermedades cardiovasculares hasta obesidad, diabetes, EPOC, asma y artritis. Nuestro enfoque multidisciplinario de atención primaria te brinda las herramientas y el apoyo que necesitas en cualquier edad y etapa de tu salud.',
      },
    ],


    // Providers
    'providers.pretitle': 'Atención confiable',
    'providers.title': 'Nuestro Equipo',
    'providers.subtitle': 'Profesional comprometido para brindar el mejor servicio a tu familia.',
    'providers.dr1.title': 'Médico de Atención Primaria',
    'providers.dr1.education': [
      'El Dr. Acosta se graduó de la Facultad de Medicina de la Universidad Central de Venezuela (UCV) en 1986, en Caracas, Venezuela, y completó una amplia formación con una residencia en Cirugía General en el Hospital Militar de Caracas, donde se desempeñó como jefe de residentes. Posteriormente completó su residencia en Cirugía Plástica y Reconstructiva en el Hospital de la Cruz Roja en Caracas, Venezuela.',
      'Posteriormente se trasladó a Puerto Rico y, después de aprobar los exámenes de la junta médica, completó su internado (2005) en el Hospital HIMA de Caguas, Puerto Rico, donde también se desempeñó como jefe de residentes. El Dr. Acosta ha publicado además varios artículos científicos a lo largo de su carrera.',
    ],
    'providers.dr1.specialty1': 'Medicina Pediátrica General',
    'providers.dr1.specialty2': 'Cuidado del Recién Nacido',
    'providers.dr1.specialty3': 'Medicina del Adolescente',
    'providers.dr1.experience': '20+ años de experiencia',
    'providers.dr1.languages': 'Idiomas: Spanish, English',
    'providers.dr2.title': 'Médico de Atención Primaria y Geriatra',
    'providers.dr2.education': 'Dr. Ortiz Guevara graduated from the Universidad Central del Este (UCE) School of Medicine in the Dominican Republic in 1978 and worked for many years in Puerto Rico. He specializes in Family Medicine and Geriatric Medicine and is affiliated with AdventHealth Network. He is currently accepting new patients.',
    'providers.dr2.specialty1': 'Medicina Pediátrica General',
    'providers.dr2.specialty2': 'Exámenes Deportivos',
    'providers.dr2.specialty3': 'Medicina Preventiva',
    'providers.dr2.experience': '20+ años de experiencia',
    'providers.dr2.languages': 'Idiomas: Spanish, English',
    'providers.education': 'Educación',
    'providers.specialties': 'Especialidades',
    'providers.experience': 'Experiencia',
    'providers.languages': 'Idiomas',
    'providers.cta.title': 'Encuentra tu proveedor',
    'providers.cta.subtitle': 'profesionales capacitados para brindar el mejor servicio a tu familia, horarios amplios para tu conveniencia y atención personalizada. Conócelos y reserva tu cita.',
    'providers.schedule': 'Programar Cita',
    'providers.meet': 'Conocer al Equipo',
    'provider.bio.dr1': 'El Dr. Jaime A. Acosta, MD, es un médico general altamente capacitado y compasivo, comprometido con brindar servicios de atención médica integral a pacientes adultos en Kissimmee, Florida. Con un enfoque en la continuidad del cuidado y la medicina preventiva, ofrece planes de tratamiento personalizados para abordar una amplia variedad de condiciones médicas y promover el bienestar integral.',
    'provider.bio.dr2': 'El Dr. Juan Ortiz Guevara, MD, es un médico geriatra en Kissimmee, Florida. Está afiliado a la red de AdventHealth. Acepta nuevos pacientes y consultas por telemedicina, y acepta todos los principales planes de seguro médico. Por favor, llame con anticipación para programar una cita y confirmar todos los planes de seguro médico aceptados.',
    'proider.cta': 'Ver mas',
    'provider.see.insurance': 'Ver planes aceptados',
    'provider.treated': 'Condiciones atendidas',
    'provider.cta': 'Ver más',

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
    'clinic.title': 'Espacio diseñado para tu comodidad.',
    'clinic.cta': 'Ver galería de fotos',

    // Clinica de pediatria
    "peds.pretitle": "Vea también nuestra clínica de pediatría",
    "peds.title": "Your Health Clínica Pediátrica",
    "peds.subtitle": "Todo en un solo lugar: consultas, vacunas, seguimiento y orientación para madres y padres.",
    "peds.clinicName": "Clínica Pediátrica DulceCuidado",
    "peds.phone": "(407) 554-5707",
    "peds.city": "Kissimmee, FL 34741",
    "peds.address": "201 Hilda St Suite # 10",
    "peds.tagline": "Controles de niño sano, vacunación y atención el mismo día para tus peques.",
    "peds.badge": "Atención pediátrica",
    "peds.heroTitle": "Gentle Care, Trusted Services",
    "peds.info.schedule": "Lunes – Viernes: 7:30 AM – 4:30 PM",
    "peds.info.phoneLabel": "Llama o escribenos para agendar una cita",
    "peds.ctaPrimary": "Agendar cita pediátrica",
    "peds.ctaPrimaryAria": "Agendar una cita en la clínica pediátrica",
    "peds.ctaSecondary": "Llamar ahora",
    "peds.ctaSecondaryAria": "Llamar a la clínica pediátrica {{clinic}} al {{phone}}",
    "peds.firstVisitNote": "¿Primera visita? Trae el récord de vacunas y el plan médico del menor.",
    "peds.viewServices": "Ver servicios de pediatría",
    "peds.benefits.ariaLabel": "Beneficios de la clínica pediátrica",
    "peds.benefits.specialists.title": "Especialistas en niñez",
    "peds.benefits.specialists.desc": "Atención centrada en bebés, niños y adolescentes.",
    "peds.benefits.bilingual.title": "Equipo bilingüe",
    "peds.benefits.bilingual.desc": "Español e inglés para que te sientas cómodo en cada visita.",
    "peds.benefits.fastAppointments.title": "Nuevos pacientes",
    "peds.benefits.fastAppointments.desc": "Bienvenidos desde la primera llamada.",
    "peds.benefits.insurance.title": "Aceptamos la mayoría de planes",
    "peds.benefits.insurance.desc": "Llámanos para verificar tu cubierta.",
    "ctaPrimary": "Agendar cita pediátrica",
    "ctaPrimaryAria": "Agendar una cita en la clínica pediátrica",
    "ctaSecondary": "Llamar ahora",
    "ctaSecondaryAria": "Llamar a la clínica pediátrica {{clinic}} al {{phone}}",
    "firstVisitNote": "¿Primera visita? Trae el récord de vacunas y el plan médico del menor.",
    "viewServices": "Ver servicios de pediatría",
    "benefits.ariaLabel": "Beneficios de la clínica pediátrica",
    "benefits.specialists.title": "Especialistas en niñez",
    "benefits.specialists.desc": "Atención centrada en bebés, niños y adolescentes.",
    "benefits.bilingual.title": "Equipo bilingüe",
    "benefits.bilingual.desc": "Español e inglés para que te sientas cómodo en cada visita.",
    "benefits.fastAppointments.title": "Citas rápidas",
    "benefits.fastAppointments.desc": "Intentamos verte el mismo día cuando tu hijo lo necesita.",
    "benefits.insurance.title": "Aceptamos la mayoría de planes",
    "benefits.insurance.desc": "Llámanos para verificar tu cubierta.",

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
    'insurance.subtitle': 'Trabajamos con proveedores de seguros para hacer que la atención médica sea de calidad, accesible y asequible para su familia.',
    'insurance.search': 'Buscar mi seguro',
    'insurance.inline': '¿Quieres saber si tu plan está cubierto?',
    "insurance.ariaLabel": "Lista completa de seguros aceptados",
    "insurance.ariaLabel.title": "Aseguradoras aceptadas",
    "insurance.closeAria": "Cerrar modal",
    "insurance.doctor.label": "Doctor",
    "insurance.doctor.all": "Todos los doctores",
    "insurance.searchBox.label": "Buscar plan o aseguradora",
    "insurance.searchBox.placeholder": "Ej. Cigna, Aetna...",
    "insurance.disclaimer": "La cobertura puede variar por plan y red. Si no ves tu seguro, contáctanos para verificar.",
    "insurance.empty.title": "No se encontraron planes",
    "insurance.empty.subtitle": "Verifica la selección de doctor o contáctanos para confirmar cobertura.",
    "insurance.copyNumberAria": "Copiar número de teléfono",
    "insurance.contact": "Contáctanos",
    "insuranceclose": "Cerrar",


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

    "contact.form.fields.reason.label": "Motivo principal",
    "contact.form.fields.reason.options.wellvisit": "Visita de control",
    "contact.form.fields.reason.options.sickvisit": "Visita por enfermedad",
    "contact.form.fields.reason.options.vaccine": "Vacunas/Inmunizaciones",
    "contact.form.fields.reason.options.other": "Otro",


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
    'footer.tagline': 'Cuidando la salud de tu familia con dedicación y cariño.',
    'footer.cta': 'Agendar cita',
    'footer.ctaAria': 'Agendar cita',

    // Navegación
    'footer.nav.title': 'Enlaces',
    'footer.nav.home': 'Inicio',
    'footer.nav.services': 'Servicios',
    'footer.nav.about': 'Sobre Nosotros',
    'footer.nav.providers': 'Proveedores',
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
    'about.title': 'Your Trusted Experts',
    'about.subtitle': 'Prevention, clarity, and science in every visit.',
    'about.bullet1': 'We treat acute illnesses such as colds, flu, and pneumonia.',
    'about.bullet2': 'We manage asthma, diabetes, and heart conditions.',
    'about.bullet3': 'We help with high cholesterol, high blood pressure, and obesity.',
    'about.cta1': 'Learn More About Us',
    'about.cta2': 'View All Services',
    'about.insurance': 'Trusted by',
    'about.text1': 'A primary care physician provides continuous, comprehensive care. They are your first point of contact for preventive checkups, common illnesses, and coordination with specialists when needed.',
    'about.text2': 'At Your Health Adult Care, we treat a wide range of acute and chronic conditions such as diabetes, hypertension, heart disease, and asthma. Our physicians offer compassionate, personalized care tailored to each patient’s needs.',
    'about.text3': 'We help you stay healthy with regular checkups, preventive medicine, lab services, vaccines, and bilingual care in a warm and professional environment.',
    'about.stats.experience': 'Years of Experience',
    'about.stats.families': 'Happy Families',

    // detalles de about us (TODO)
    'about.title.detail': 'Your Health Adult Care: Bilingual Medical Care',
    'about.text1.detail': 'A primary care physician (PCP) is a healthcare professional, usually a general practitioner, who provides comprehensive long-term medical care. They are the first point of contact for most health issues, from routine and preventive checkups to the treatment of common illnesses. They can also refer patients to specialists and coordinate their care.',
    'about.text2.detail': 'At Your Health Adult Care, our primary care physicians specialize in the treatment of acute and chronic conditions, such as high cholesterol and hypertension, diabetes, heart disease, asthma, geriatric medicine, and minor injury care. They also offer everything from annual checkups to immunizations. Let our experienced family physicians provide you with compassionate and personalized care.',
    'about.text3.detail': "We'll help you stay healthy with regular checkups, recover from injuries, and manage acute and chronic conditions. At YHAC, you'll receive comprehensive care, including adult preventive medicine, senior care, lab services, immunizations, minor injury care, and a friendly, bilingual staff.",

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
    'mission.text2': "Statistics show that Osceola is one of the fastest-growing counties in Florida and the nation. This underscores the importance of serving a diverse group of cultures and languages ​​in the area. That's why it's critical for us to have bilingual info and staff at our clinic.",
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
    'contact.portal.qr.label': 'Existing patients',
    'contact.portal.qr.desc': 'Are you already a patient and have a record with us? Access your patient portal.',
    'contact.portal.qr.scan': 'Scan the code with your phone’s camera',
    'contact.portal.qr.visit': 'Visit our patient portal',
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
      {
        key: 'preventive-medicine',
        title: 'Preventive Medicine',
        description: 'Medical screenings and treatments that can help you avoid unnecessary illness and detect a potentially dangerous health condition while it is in its earliest and most treatable stage',
      },
      {
        key: 'adult-immunizations',
        title: 'Adult Immunizations',
        description: 'Our doctors provide all CDC-recommended immunizations including those that protect you against Influenza (Flu), Pneumococcal Infections; HPV, Hepatitis, Shingles, RSV and more.',
      },
      {
        key: 'minor-illness-diagnosis',
        title: 'Minor Illness Diagnosis and Treatment',
        description: 'Evaluating and treating commonly diagnosed acute illnesses like cold and flu that do not require hospitalization.',
      },
      {
        key: 'minor-injury-treatment',
        title: 'Minor Injury Diagnosis and Treatment',
        description: 'Evaluating and treating injuries that are not life threatening and can commonly be managed in a primary care physician’s office',
      },

      {
        key: 'chronic-disease-management',
        title: 'Chronic Disease Management',
        description: 'Regular monitoring and treatment of chronic diseases ranging from cardiovascular disease to Obesity, Diabetes, COPD, Asthma and Arthritis. Our multidisciplinary approach to Primary Care gives you the tools and support you need at any age and stage of your health.',
      },
    ],


    // Providers
    'providers.pretitle': 'Trusted Care',
    'providers.title': 'Our Providers',
    'providers.subtitle': 'Committed professional to provide the best service to your family.',
    'providers.dr1.title': 'Primary Care Physician',
    'providers.dr1.education': [
      'El Dr. Acosta se graduó de la Facultad de Medicina de la Universidad Central de Venezuela (UCV) en 1986, en Caracas, Venezuela, y completó una amplia formación con una residencia en Cirugía General en el Hospital Militar de Caracas, donde se desempeñó como jefe de residentes. Posteriormente completó su residencia en Cirugía Plástica y Reconstructiva en el Hospital de la Cruz Roja en Caracas, Venezuela.',
      'Posteriormente se trasladó a Puerto Rico y, después de aprobar los exámenes de la junta médica, completó su internado (2005) en el Hospital HIMA de Caguas, Puerto Rico, donde también se desempeñó como jefe de residentes. El Dr. Acosta ha publicado además varios artículos científicos a lo largo de su carrera.',
    ],
    'providers.dr1.specialty1': 'General Pediatric Medicine',
    'providers.dr1.specialty2': 'Newborn Care',
    'providers.dr1.specialty3': 'Adolescent Medicine',
    'providers.dr1.experience': '20+ years of experience',
    'providers.dr1.languages': 'Language: Spanish, English',
    'providers.dr2.title': 'Primary Care Physician and Geriatrician',
    'providers.dr2.education': 'Dr. Ortiz Guevara graduated from the Universidad Central del Este (UCE) School of Medicine in the Dominican Republic in 1978 and worked for many years in Puerto Rico. He specializes in Family Medicine and Geriatric Medicine and is affiliated with AdventHealth Network. He is currently accepting new patients.',
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
    'provider.bio.dr1': 'Dr. Jaime A. Acosta, MD, is a highly skilled and compassionate general practitioner committed to providing comprehensive healthcare services to adult patients in Kissimmee, Florida. With a focus on continuity of care and preventative medicine, he offers personalized treatment plans to address a wide range of medical conditions and promote overall well-being.',
    'provider.bio.dr1.text2': 'At Your Health Adult Care, he offers a variety of services, including health screenings, acute and chronic disease management, and minor surgical procedures. Dr. Acosta is a general medicine specialist, licensed to practice medicine in Florida, Michigan, and Puerto Rico, and affiliated with AdventHealth Network. He is currently accepting new patients.',
    'provider.bio.dr2': 'Dr. Juan Ortiz Guevara, MD, is a geriatric physician in Kissimmee, Florida. He is affiliated with the AdventHealth Network. He is accepting new patients and telehealth consultations and accepts all major health insurance plans. Please call ahead to schedule an appointment and confirm all accepted health insurance plans.',

    'provider.see.insurance': 'See insurance covered by this doctor',
    'provider.treated': 'Conditions Treated',
    'provider.cta': 'See more',

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
    'clinic.title': 'A place designed for your Comfort',
    'clinic.cta': 'View Gallery',

    // Clinica de pediatria
    "peds.pretitle": "See our pediatric clinic",
    "peds.title": "Your Health Pediatric",
    "peds.subtitle": "Everything in one place: visits, vaccines, follow-ups and guidance for parents.",
    "peds.clinicName": "SweetCare Pediatric Clinic",
    "peds.phone": "(407) 554-5707",
    "peds.city": "Kissimmee, FL 34741",
    "peds.address": "201 Hilda St Suite # 10",
    "peds.tagline": "Well-child checkups, vaccinations and same-day care for your little ones.",
    "peds.badge": "Pediatric care",
    "peds.heroTitle": "Gentle Care, Trusted Services",
    "peds.info.schedule": "Monday – Friday: 7:30 AM – 4:30 PM",
    "peds.info.phoneLabel": "Call or message us to schedule an appointment",
    "peds.ctaPrimary": "Book pediatric appointment",
    "peds.ctaPrimaryAria": "Book a pediatric appointment",
    "peds.ctaSecondary": "Call now",
    "peds.ctaSecondaryAria": "Call the pediatric clinic {{clinic}} at {{phone}}",
    "peds.firstVisitNote": "First visit? Bring vaccine records and your child's insurance plan.",
    "peds.viewServices": "View pediatric services",
    "peds.benefits.ariaLabel": "Pediatric clinic benefits",
    "peds.benefits.specialists.title": "Childhood specialists",
    "peds.benefits.specialists.desc": "Focused care for babies, children and adolescents.",
    "peds.benefits.bilingual.title": "Bilingual team",
    "peds.benefits.bilingual.desc": "Spanish and English so you feel comfortable in every visit.",
    "peds.benefits.fastAppointments.title": "New Patients",
    "peds.benefits.fastAppointments.desc": "Welcome from day one.",
    "peds.benefits.insurance.title": "We accept most plans",
    "peds.benefits.insurance.desc": "Call us to verify your coverage.",

    "ctaPrimary": "Book pediatric appointment",
    "ctaPrimaryAria": "Book a pediatric appointment",
    "ctaSecondary": "Call now",
    "ctaSecondaryAria": "Call the pediatric clinic {{clinic}} at {{phone}}",
    "firstVisitNote": "First visit? Bring vaccine records and your child's insurance plan.",
    "viewServices": "View pediatric services",
    "benefits.ariaLabel": "Pediatric clinic benefits",
    "benefits.specialists.title": "Childhood specialists",
    "benefits.specialists.desc": "Focused care for babies, children and adolescents.",
    "benefits.bilingual.title": "Bilingual team",
    "benefits.bilingual.desc": "Spanish and English so you feel comfortable in every visit.",
    "benefits.fastAppointments.title": "Fast appointments",
    "benefits.fastAppointments.desc": "We try to see you the same day when your child needs it.",
    "benefits.insurance.title": "We accept most plans",
    "benefits.insurance.desc": "Call us to verify your coverage.",





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
    'insurance.subtitle': 'We work with insurance providers to make quality medical care accessible and affordable for your family.',
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

    "insurance.ariaLabel": "Full list of accepted insurances",
    "insurance.ariaLabel.title": "Accepted insurances",
    "insurance.closeAria": "Close modal",
    "insurance.doctor.label": "Doctor",
    "insurance.doctor.all": "All doctors",
    "insurance.searchBox.label": "Search plan or insurer",
    "insurance.searchBox.placeholder": "e.g., Cigna, Aetna...",
    "insurance.disclaimer": "Coverage may vary by plan and network. If you don't see your insurance, contact us to verify.",
    "insurance.empty.title": "No plans found",
    "insurance.empty.subtitle": "Check the selected doctor or contact us to confirm coverage.",
    "insurance.copyNumberAria": "Copy phone number",
    "insurance.contact": "Contact us",
    "insurance.close": "Close",


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
    'footer.tagline': 'Caring for your family with dedication and kindness.',
    'footer.cta': 'Book appointment',
    'footer.ctaAria': 'Book appointment',

    // Navigation
    'footer.nav.title': 'Links',
    'footer.nav.home': 'Home',
    'footer.nav.services': 'Services',
    'footer.nav.about': 'About Us',
    'footer.nav.providers': 'Providers',
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

/* ===== Helper para interpolación {var} en tFormat ===== */

function interpolate(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = params[key];
    return v !== undefined ? String(v) : `{${key}}`;
  });
}

/* ===================== Provider ===================== */

type ProviderProps = {
  children: ReactNode;
  initialLanguage: Language; // 👈 viene del layout
};

export function TranslationProvider({ children, initialLanguage }: ProviderProps) {
  // 🔹 El estado inicial viene del servidor (cookie)
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    if (typeof document !== 'undefined') {
      // Guardamos en cookie para siguientes requests/refresh
      document.cookie = `lang=${lang}; path=/; max-age=31536000`;
      document.documentElement.lang = lang;
    }
  };

  const raw = (key: string): TranslationValue | undefined =>
    translations[language]?.[key];

  const t = (key: string): string => {
    const v = raw(key);
    return typeof v === 'string' ? v : key;
  };

  const tFormat = (
    key: string,
    params: Record<string, string | number>
  ): string => {
    const v = raw(key);
    return typeof v === 'string' ? interpolate(v, params) : key;
  };

  const tArray = <T = unknown,>(key: string): T[] => {
    const v = raw(key);
    return Array.isArray(v) ? (v as T[]) : [];
  };

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