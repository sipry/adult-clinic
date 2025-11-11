// TODO: clean file
import React from 'react';
import { ArrowLeft, Clock, Users, Phone, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

interface ServiceDetailProps {
  serviceId: string;
  onBack: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ serviceId, onBack }) => {
  const { t } = useTranslation();

  const services = {
    'well-child-checkups': {
      title: t('services.wellchild.title'),
      description: t('services.wellchild.desc'),
      image: "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Los chequeos de niño sano son visitas médicas regulares que se centran en la prevención y el monitoreo del crecimiento y desarrollo saludable de su hijo.",
        whatToExpect: [
          "Medición de altura, peso y circunferencia de la cabeza",
          "Evaluación del desarrollo físico y mental",
          "Vacunas según el calendario recomendado",
          "Examen físico completo",
          "Discusión sobre nutrición y hábitos saludables",
          "Orientación sobre seguridad y prevención de accidentes"
        ],
        schedule: "Recomendamos chequeos regulares: recién nacidos cada 2-4 semanas, bebés cada 2-4 meses, niños pequeños cada 6 meses, y niños mayores anualmente.",
        preparation: "Traiga el registro de vacunas, lista de medicamentos actuales, y cualquier pregunta o preocupación que tenga sobre el desarrollo de su hijo."
      }
    },
    'adhd-school-issues': {
      title: t('services.adhd.title'),
      description: t('services.adhd.desc'),
      image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Ofrecemos evaluación integral y manejo del TDAH y dificultades de aprendizaje para ayudar a su hijo a tener éxito académico y social.",
        whatToExpect: [
          "Evaluación psicológica y médica completa",
          "Cuestionarios para padres y maestros",
          "Pruebas de atención y concentración",
          "Plan de tratamiento personalizado",
          "Coordinación con la escuela",
          "Seguimiento regular y ajustes del tratamiento"
        ],
        schedule: "La evaluación inicial puede tomar 1-2 visitas. El seguimiento se programa según las necesidades individuales.",
        preparation: "Traiga reportes escolares recientes, cualquier evaluación previa, y complete los cuestionarios que le proporcionemos antes de la cita."
      }
    },
    'asthma-allergies': {
      title: t('services.asthma.title'),
      description: t('services.asthma.desc'),
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Brindamos diagnóstico, tratamiento y manejo integral del asma y alergias para mejorar la calidad de vida de su hijo.",
        whatToExpect: [
          "Evaluación de síntomas y desencadenantes",
          "Pruebas de función pulmonar cuando sea apropiado",
          "Plan de manejo personalizado del asma",
          "Educación sobre el uso de inhaladores",
          "Identificación y manejo de alérgenos",
          "Plan de acción para emergencias"
        ],
        schedule: "Visitas iniciales para evaluación, seguimiento cada 3-6 meses o según sea necesario.",
        preparation: "Mantenga un diario de síntomas, traiga todos los medicamentos actuales, y note cualquier desencadenante conocido."
      }
    },
    'adolescent-health': {
      title: t('services.adolescent.title'),
      description: t('services.adolescent.desc'),
      image: "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Atención médica especializada para adolescentes que aborda las necesidades únicas de salud física, mental y emocional durante esta etapa crucial.",
        whatToExpect: [
          "Exámenes físicos anuales completos",
          "Evaluación de salud mental y emocional",
          "Educación sobre salud reproductiva",
          "Vacunas para adolescentes",
          "Consejería sobre estilo de vida saludable",
          "Confidencialidad apropiada para la edad"
        ],
        schedule: "Visitas anuales recomendadas, con citas adicionales según sea necesario.",
        preparation: "Los adolescentes pueden hablar privadamente con el médico. Prepare preguntas sobre desarrollo, salud mental, o cualquier preocupación."
      }
    },
    'urgent-care': {
      title: t('services.urgent.title'),
      description: t('services.urgent.desc'),
      image: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Atención médica inmediata para condiciones que requieren tratamiento rápido pero no constituyen emergencias que requieran sala de emergencias.",
        whatToExpect: [
          "Evaluación rápida de síntomas",
          "Tratamiento de infecciones menores",
          "Manejo de fiebre y dolor",
          "Cuidado de heridas menores",
          "Evaluación de erupciones cutáneas",
          "Orientación sobre cuándo buscar atención de emergencia"
        ],
        schedule: "Citas el mismo día disponibles. Llame temprano para mejor disponibilidad.",
        preparation: "Llame antes de venir. Traiga lista de síntomas, medicamentos actuales, y tarjeta de seguro."
      }
    },
    'school-physical': {
      title: t('services.physical.title'),
      description: t('services.physical.desc'),
      image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Exámenes físicos completos requeridos para la inscripción escolar y participación en actividades deportivas y extracurriculares.",
        whatToExpect: [
          "Examen físico completo",
          "Revisión del historial médico",
          "Verificación de vacunas",
          "Evaluación de la visión y audición",
          "Completar formularios escolares requeridos",
          "Recomendaciones para actividades deportivas"
        ],
        schedule: "Programe con anticipación antes del inicio del año escolar. Disponible durante todo el año.",
        preparation: "Traiga formularios escolares, registro de vacunas, y cualquier documentación médica relevante."
      }
    },
    'covid-19': {
      title: t('services.covid.title'),
      description: t('services.covid.desc'),
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Servicios completos de COVID-19 incluyendo pruebas, vacunación y manejo para mantener a su familia segura y saludable.",
        whatToExpect: [
          "Pruebas rápidas y PCR disponibles",
          "Vacunas COVID-19 para edades elegibles",
          "Evaluación de síntomas",
          "Orientación sobre aislamiento y cuarentena",
          "Monitoreo de síntomas a largo plazo",
          "Coordinación con salud pública cuando sea necesario"
        ],
        schedule: "Pruebas disponibles el mismo día. Vacunas por cita.",
        preparation: "Llame antes de venir si tiene síntomas. Traiga tarjeta de vacunación y lista de contactos cercanos."
      }
    },
    'obesity-plan': {
      title: t('services.obesity.title'),
      description: t('services.obesity.desc'),
      image: "https://images.pexels.com/photos/6111563/pexels-photo-6111563.jpeg?auto=compress&cs=tinysrgb&w=800",
      details: {
        overview: "Programas personalizados de manejo de peso y nutrición para promover hábitos saludables y un crecimiento óptimo en niños.",
        whatToExpect: [
          "Evaluación nutricional completa",
          "Plan de alimentación personalizado",
          "Orientación sobre actividad física",
          "Monitoreo del crecimiento",
          "Apoyo familiar y educación",
          "Seguimiento regular del progreso"
        ],
        schedule: "Consulta inicial seguida de visitas de seguimiento cada 4-6 semanas.",
        preparation: "Mantenga un diario de alimentos por una semana antes de la cita. Traiga información sobre actividades físicas actuales."
      }
    }
  };

  const service = services[serviceId as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Servicio no encontrado
            </h1>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a servicios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a servicios
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-64 sm:h-80">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {service.title}
                </h1>
                <p className="text-blue-100 text-lg">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Descripción General
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {service.details.overview}
              </p>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Qué Esperar
                </h2>
              </div>
              <ul className="space-y-3">
                {service.details.whatToExpect.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Cómo Prepararse
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {service.details.preparation}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Programación
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.details.schedule}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Programar Cita
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                ¿Listo para programar? Contáctanos hoy mismo.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar Ahora
                </a>
                <button className="flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Cita en Línea
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Información Adicional
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Aceptamos la mayoría de seguros</li>
                <li>• Planes de pago disponibles</li>
                <li>• Servicios en español</li>
                <li>• Estacionamiento gratuito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;