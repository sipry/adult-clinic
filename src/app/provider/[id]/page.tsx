"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useProvidersData } from "../data";
import { useTranslation } from "@/app/contexts/TranslationContext";
import InsuranceDoctorModal from "../components/InsuranceDoctorModal";
import { PALETTE, BRAND } from "@/app/ui/palette";
import { Linkedin } from "lucide-react";


/* ============ Subcomponentes ============ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-md p-6">
    <h3 className="mb-3 text-lg font-semibold" style={{ color: BRAND.text }}>
      {title}
    </h3>
    <div
      className="prose max-w-none text-sm leading-relaxed"
      style={{ color: BRAND.text }}
    >
      {children}
    </div>
  </section>
);

const Bullet = ({ items }: { items: string[] }) => (
  <ul
    className="mt-2 list-disc space-y-2 pl-5"
    style={{ color: BRAND.text }}
  >
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

/* Doctor relacionado */
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
    <li className="flex items-start gap-4 py-4 bg-transparent">
      <img
        src={photo}
        alt={name}
        className="h-32 w-32 flex-none rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold" style={{ color: BRAND.text }}>
          {name}
        </h4>
        <p className="mt-0.5 text-xs" style={{ color: `${BRAND.text}B3` }}>
          {title}
        </p>

        <Link
          href={`/provider/${id}`}
          className="mt-2 ml-1 inline-block text-xs font-medium hover:underline transition"
          style={{ color: BRAND.accent }}
        >
          {t("provider.cta")}
        </Link>
      </div>
    </li>
  );
}

/* Utils */
const toList = (v?: string | string[]) =>
  Array.isArray(v)
    ? v.filter(Boolean).map((s) => s.trim())
    : typeof v === "string"
      ? v
        .split(/[\n•|]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

const isMeaningful = (v: string | undefined): v is string => {
  const s = v?.trim();
  return !!s && s !== "provider.bio.dr2.text2";
};

/* ============ Página Principal ============ */
export default function ProviderDetailPage() {
  const params = useParams<{ id: string }>();
  const providers = useProvidersData();
  const { t } = useTranslation();

  const p = providers.find((it) => it.id === params.id);
  if (!p) notFound();

  const avatar = typeof p.image === "string" ? p.image : p.image.src;
  const [insuranceOpen, setInsuranceOpen] = React.useState(false);

  const baseParagraphs =
    typeof p.bio === "string" && p.bio.includes("\n")
      ? p.bio
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      : [p.bio];

  const fallbackDr2 =
    p.id === "dr-Juan-Ortiz" ? t("provider.bio.dr2.text2") : "";
  const secondParagraph = isMeaningful(p.bio2)
    ? p.bio2
    : isMeaningful(fallbackDr2)
      ? fallbackDr2
      : undefined;
  const aboutParagraphs = isMeaningful(secondParagraph)
    ? [...baseParagraphs, secondParagraph.trim()]
    : baseParagraphs;

  const defaultConditions = [
    "Preventive Medicine",
    "Adult Immunizations",
    "Minor Illness Diagnosis and Treatment",
    "Minor Injury Diagnosis and Treatment",
    "Chronic Disease Management",
  ];

  const conditions: string[] =
    Array.isArray(p.conditions) && p.conditions.length > 0
      ? p.conditions
      : defaultConditions;

  const educationList = toList(p.education);
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

  return (
    <>
      {/* Contenido principal */}
      <div
        className="min-h-screen mx-auto max-w-6xl px-4"
        style={{
          paddingTop: toPx(navbarOffset),
          backgroundColor: BRAND.bg,
        }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div
              className="sticky rounded-md p-6 bg-transparent"
              style={{ top: `calc(${toPx(navbarOffset)} + 16px)` }}
            >
              {/* foto */}
              <div className="overflow-hidden rounded-lg">
                <img
                  src={avatar}
                  alt={p.name}
                  className="aspect-square w-full object-cover rounded-lg"
                />
              </div>

              <div
                className="my-6 h-px"
                style={{ backgroundColor: `${BRAND.text}11` }}
              />

              {/* nombre */}
              <h2 className="text-xl font-semibold" style={{ color: BRAND.text }}>
                {p.name}
              </h2>
              <p className="mt-1 text-sm" style={{ color: `${BRAND.text}B3` }}>
                {p.title}
              </p>

              {/* botones de RG y Linkedin */}
              <div className="mt-2 flex gap-3 ">
                {/* reasearch gate */}
                <a
                  href="https://www.researchgate.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ir a ResearchGate"
                  className="inline-block"
                >
                  <span
                    className="inline-flex items-center justify-center transition-transform duration-150 hover:scale-[1.04]"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      backgroundColor: '#74CDBD',
                      border: "3px solid #FFFFFF",
                      position: "relative",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "serif",
                        fontSize: "22px",
                        lineHeight: 1,
                        fontWeight: 500,
                      }}
                    >
                      R
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "8px",
                        color: "#FFFFFF",
                        fontFamily: "serif",
                        fontSize: "11px",
                        lineHeight: 1,
                        fontWeight: 500,
                      }}
                    >
                      G
                    </span>
                  </span>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ir a LinkedIn"
                  className="inline-block"
                >
                  <span
                    className="inline-flex items-center justify-center transition-transform duration-150 hover:scale-[1.04]"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      backgroundColor: '#0A66C2',
                      border: "3px solid #FFFFFF", // como el de RG
                      boxSizing: "border-box",
                      position: "relative",
                    }}
                  >
                    {/* "in" de LinkedIn */}
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "18px",
                        lineHeight: 1,
                        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      }}
                    >
                      in
                    </span>
                  </span>
                </a>
              </div>

              {/* info extra */}
              {p.languages && (
                <div className="mt-4">
                  <p className="text-sm font-semibold" style={{ color: BRAND.text }}>
                    Languages
                  </p>
                  <p className="mt-1 text-sm" style={{ color: `${BRAND.text}B3` }}>
                    {p.languages}
                  </p>
                </div>
              )}

              {p.experience && (
                <div className="mt-4">
                  <p className="text-sm font-semibold" style={{ color: BRAND.text }}>
                    Years of Experience
                  </p>
                  <p className="mt-1 text-sm" style={{ color: `${BRAND.text}B3` }}>
                    {p.experience}
                  </p>
                </div>
              )}

              {/* BOTONES PRINCIPALES */}
              <div className="mt-6 flex flex-col gap-2">
                {/* 1. schedule */}
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                  style={{
                    backgroundColor: PALETTE[0].base,
                    color: BRAND.text,
                    border: `1px solid ${PALETTE[0].back}`,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {t("about.cta2.detail")}
                </Link>

                {/* 2. see all services */}
                <a
                  href="/services"
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition hover:scale-[1.01]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: BRAND.text,
                    border: `1px solid ${BRAND.accent}22`,
                  }}
                >
                  {t("service.seeAll.button")}
                </a>

                {/* 3. insurance */}
                <button
                  type="button"
                  onClick={() => setInsuranceOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition hover:scale-[1.01]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: BRAND.text,
                    border: `1px solid ${BRAND.accent}22`,
                  }}
                >
                  {t("provider.see.insurance")}
                </button>
              </div>


            </div>
          </aside>



          {/* Contenido principal */}
          <main className="lg:col-span-8">
            <div className="space-y-6">
              <Section title="About the Doctor">
                <div
                  className="space-y-4 text-[15px] leading-7"
                  style={{ color: BRAND.text }}
                >
                  {aboutParagraphs.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
              </Section>

              {conditions.length > 0 && (
                <div id="services">
                  <Section title={t("provider.treated")}>
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

      {/* Footer con doctores relacionados */}
      {related.length > 0 && (
        <footer className="mt-12" style={{ backgroundColor: BRAND.bg }}>
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h3
              className="mb-4 text-lg font-semibold"
              style={{ color: BRAND.text }}
            >
              Related Doctors
            </h3>
            <ul className="rounded-md p-2 bg-transparent space-y-2">
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

      {/* Modal de insurance */}
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
