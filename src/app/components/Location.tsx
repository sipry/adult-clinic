import React from 'react';
import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

const Location: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="location" className="py-15">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-gray-800 mb-6">
            {t('location.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('location.subtitle')}
          </p>
        </div>

        {/* Location Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div className="p-8 text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">{t('about.location.title')}</h4>
            <div className="mb-4">
              <p className="text-gray-600 font-medium">Your Health Pediatrics</p>
              <p className="text-gray-600">201 Hilda St Suite # 10 Kissimmee FL 34741</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.8!2d-95.6!3d30.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI0JzAwLjAiTiA5NcKwMzYnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Your Health Pediatrics Location"
              ></iframe>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="p-8">
              <div className="flex items-start space-x-4">
                {/* <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div> */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t('location.contact.title')}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>{t('location.phone')}:</strong> (936) 582-5620</p>
                    <p><strong>{t('location.fax')}:</strong> (936) 582-5621</p>
                    <p><strong>{t('location.email')}:</strong> YourHealth.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-8">
              <div className="flex items-start space-x-4">
                {/* <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div> */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t('location.hours.title')}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>{t('location.hours.weekdays')}:</strong> 8:00 AM - 5:00 PM</p>
                    <p><strong>{t('location.hours.sunday')}:</strong> {t('location.hours.closed')}</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;