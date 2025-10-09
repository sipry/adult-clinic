"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useProvidersData } from "../data";
import { useTranslation } from "@/app/contexts/TranslationContext";
import InsuranceDoctorModal from "../components/InsuranceDoctorModal"; // ⬅️ ajusta la ruta si es necesario

type Provider = {
  id: string;
  name: string;
  title: string;
  image: string | { src: string };
  bio: string;
  bio2?: string;
  languages?: string;
  experience?: string | number;
  conditions?: string[];
  board?: string[];
  education?: string | string[];
  educationList?: string[];
  memberships?: string[];
  research?: string[];
  rating?: number;
  reviews?: number;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-sm bg-white p-6">
    <h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3>
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">
      {children}
    </div>
  </section>
);

const Bullet = ({ items }: { items: string[] }) => (
  <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

/* Item vertical para doctores relacionados */
function RelatedDoctorItem({
  id,
  name,
  title,
  photo,
}: {
  id: string;
  name: string;
  title: string;
  photo: string;
}) {
  const { t } = useTranslation();
  return (
    <li className="flex items-start gap-4 py-4">
      <img
        src={photo}
        alt={name}
        className="h-32 w-32 flex-none rounded-sm object-cover"
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{title}</p>

        <Link
          href={`/provider/${id}`}
          className="mt-2 ml-2 inline-block text-xs font-medium text-lime-900 rounded-sm hover:underline"
        >
          {t("proider.cta")}
        </Link>
      </div>
    </li>
  );
}

/** Utilidad: convierte string/string[] en lista limpia */
const toList = (v?: string | string[]) =>
  Array.isArray(v)
    ? v
      .filter(Boolean)
      .map((s) => s.trim())
      .filter(Boolean)
    : typeof v === "string"
      ? v
        .split(/[\n•|]+/) // soporta saltos de línea, bullets y barras
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

/** Type predicate para estrechar a string cuando hay contenido real */
const isMeaningful = (v: string | undefined): v is string => {
  const s = v?.trim();
  return !!s && s !== "provider.bio.dr2.text2";
};

/** 🔹 Mapping temporal: planes por doctora/doctor.
 *  Si ya los traes en tu data (p.ej. p.insurancePlans), reemplaza esto por esa fuente. */
const DOCTOR_PLANS: Record<string, string[]> = {
  "Dra. Martha I. Acosta": [
    "AETNA HEALTHCARE (PPO)",
    "BETTER HEALTHCARE (Commercial)",
    "BLUE CROSS & BLUE SHIELD (PPO)",
    "CIGNA HEALTHCARE (PPO)",
    "CMS - SUNSHINE (Medicaid)",
    "FIRST HEALTHCARE (Commercial)",
    "HEALTH FIRST (Commercial)",
    "HUMANA HEALTHCARE (Medicaid)",
    "OSCAR HEALTHCARE (Commercial)",
    "SIMPLY HEALTHCARE (Medicaid)",
    "SUNSHINE HEALTHCARE (Medicaid)",
    "UNITED HEALTHCARE (PPO)",
  ],
  "Dr. Eduardo F. Bolumen": [
    "CMS - SUNSHINE (Medicaid)",
    "HUMANA HEALTHCARE (Medicaid)",
    "OSCAR HEALTHCARE (Commercial)",
    "SIMPLY HEALTHCARE (Medicaid)",
    "SUNSHINE HEALTHCARE (Medicaid)",
    "UNITED HEALTHCARE (PPO)",
  ],
};

/* ============ Page ============ */
export default function ProviderDetailPage() {
  const params = useParams<{ id: string }>();
  const providers = useProvidersData() as Provider[];
  const { t } = useTranslation();
  const p = providers.find((it) => it.id === params.id);
  if (!p) notFound();

  const avatar = typeof p.image === "string" ? p.image : p.image.src;

  // Modal state
  const [insuranceOpen, setInsuranceOpen] = React.useState(false);

  // 1) párrafos base desde p.bio
  const baseParagraphs =
    typeof p.bio === "string" && p.bio.includes("\n")
      ? p.bio
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      : [p.bio];

  // 2) segundo párrafo opcional:
  const fallbackDr2 =
    p.id === "dr-james-thompson" ? t("provider.bio.dr2.text2") : "";

  const secondParagraph = isMeaningful(p.bio2)
    ? p.bio2
    : isMeaningful(fallbackDr2)
      ? fallbackDr2
      : undefined;

  // 3) compón la lista final
  const aboutParagraphs = isMeaningful(secondParagraph)
    ? [...baseParagraphs, secondParagraph.trim()]
    : baseParagraphs;

  // ----- estas constantes ya sin (p as any) -----
  const conditions: string[] =
    p.conditions && p.conditions.length > 0
      ? p.conditions
      : [
        "Well visit",
        "Sick Visit",
        "Follow up",
        "Immunizations",
        "Food Allergy test",
        "Environmental Allergy test",
        "Vision screening",
        "Audiology screening",
        "Obesity care plan",
        "Asthma care plan",
        "ADHD care plan",
      ];

  const board: string[] =
    p.board && p.board.length > 0
      ? p.board
      : ["American Board of Pediatrics — Board Certified in Pediatric Medicine"];

  const educationList: string[] = Array.isArray(p.educationList)
    ? p.educationList
    : Array.isArray(p.education)
      ? p.education
      : typeof p.education === "string"
        ? p.education
          .split(/[\n•|]/)
          .map((s) => s.trim())
          .filter(Boolean)
        : [];

  const navbarOffset = 88;
  const toPx = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

  const related = providers
    .filter((it) => it.id !== p.id)
    .map((it) => ({
      id: it.id,
      name: it.name,
      title: it.title,
      photo: typeof it.image === "string" ? it.image : it.image.src,
    }));

  // 🔹 planes para ESTA doctora/doctor (desde mapping temporal)
  const doctorPlans = DOCTOR_PLANS[p.name] ?? [];

  // (Opcional) Teléfono para el pie del modal
  const phoneHref = "tel:+14075744848";

  return (
    <>
      {/* Contenido principal */}
      <div
        className="mx-auto max-w-6xl px-4"
        style={{ paddingTop: toPx(navbarOffset) }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div
              className="sticky"
              style={{ top: `calc(${toPx(navbarOffset)} + 16px)` }}
            >
              <div className="bg-white p-6">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={avatar}
                    alt={p.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>

                <div className="my-6 h-px bg-slate-200" />

                <h2 className="text-xl font-semibold text-slate-900">
                  {p.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{p.title}</p>

                {p.languages ? (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Languages:
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{p.languages}</p>
                  </div>
                ) : null}

                {p.experience ? (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Years of Experience
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {p.experience}
                    </p>
                  </div>
                ) : null}

                {/* Botón existente (contacto) */}
                <Link
                  href="/contact"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-lime-900 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition"
                >
                  {t("about.cta2.detail")}
                </Link>

                {/* NUEVOS BOTONES */}
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <a
                    href="/services"
                    className="inline-flex w-full items-center justify-center rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
                  >
                    {t('service.seeAll.button')}
                  </a>

                  {/* Abre el modal con planes de ESTA doctora/doctor */}
                  <button
                    type="button"
                    onClick={() => setInsuranceOpen(true)}
                    className="inline-flex w-full items-center justify-center rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
                  >
                    {t('provider.see.insurance')}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-8">
            <div className="space-y-6">
              <Section title="About the Doctor">
                <div className="space-y-4 text-[15px] leading-7 text-gray-700">
                  {aboutParagraphs.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
              </Section>

              {conditions.length > 0 && (
                <div id="services">
                  <Section title={t('provider.treated')}>
                    <Bullet items={conditions} />
                  </Section>
                </div>
              )}

              {educationList.length > 0 && (
                <Section title="Education">
                  <Bullet items={educationList} />
                </Section>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer con Related Doctors (vertical list) */}
      {related.length > 0 && (
        <footer className="mt-12">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Related Doctors
            </h3>
            <ul className="divide-y divide-slate-200 bg-white p-2">
              {related.map((d) => (
                <RelatedDoctorItem
                  key={d.id}
                  id={d.id}
                  name={d.name}
                  title={d.title}
                  photo={d.photo}
                />
              ))}
            </ul>
          </div>
        </footer>
      )}

      {/* ⬇️ Modal de insurance por doctora/doctor */}
      <InsuranceDoctorModal
        open={insuranceOpen}
        onClose={() => setInsuranceOpen(false)}
        providerId={p.id}
        providerName={p.name}
        phoneHref="tel:+14075744848"
        contactHref="/#contact"
      />
    </>
  );
}
