"use client";

import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const CLINIC_NAME = "Your Health Adult Clinic";
const EMAIL = "info@yourhealthadultclinic.com";
const PHONE_DISPLAY = "(407) 554-5707";
const PHONE_TEL = "+14075744848";
const ADDRESS_LINE_1 = "201 Hilda St Suite 15 Kisseemmee FL 34741 United States";
const ADDRESS_LINE_2 = "Kissimmee, FL 34741";

export default function ComingSoonClinic() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-50">
      {/* BG decor (sin el cuadrado) */}
      <div aria-hidden className="pointer-events-none select-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:py-28 lg:py-32">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-900 text-white shadow-md">
          <span className="text-lg font-bold">YH</span>
        </div>

        {/* Título y subtítulo centrados */}
        <h1 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
          {CLINIC_NAME}
        </h1>
        <p className="mt-3 text-center text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          We&apos;re building a new online experience. In the meantime, reach us by phone or email.
        </p>

        <div className="mt-8 rounded-2xl border border-sky-100 bg-white/70 shadow-sm backdrop-blur p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Call */}
            <a
              href={`tel:${PHONE_TEL}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-sky-50 p-2">
                  <Phone className="h-5 w-5 text-sky-900" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-600">{PHONE_DISPLAY}</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-sky-50 p-2">
                  <Mail className="h-5 w-5 text-sky-900" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600 break-all">{EMAIL}</p>
                </div>
              </div>
            </a>

            {/* Location */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-sky-50 p-2">
                  <MapPin className="h-5 w-5 text-sky-900" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {ADDRESS_LINE_1}
                    <br />
                    {ADDRESS_LINE_2}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-sky-900" aria-hidden="true" />
              <span>Mon–Fri: 7:30 – 4:30 pm · Closed weekends</span>
            </div>
            <p className="text-xs text-gray-500">If this is an emergency, call 911.</p>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
