"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useProvidersData } from "../data";
import { useTranslation } from "@/app/contexts/TranslationContext";
import InsuranceDoctorModal from "../components/InsuranceDoctorModal";

/* 🎨 Paleta */
const PALETTE = {
  amber: "#B67B39",
  moss: "#7C8C4D",
  wine: "#812D20",
  ochre: "#D8C27A",
  olive: "#4F5635",
  cream: "#FAF4E6",
  dark: "#2B2725",
};

/* ============ Subcomponentes ============ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-md p-6" style={{ backgroundColor: PALETTE.cream }}>
    <h3 className="mb-3 text-lg font-semibold" style={{ color: PALETTE.dark }}>
      {title}
    </h3>
    <div
      className="prose max-w-none text-sm leading-relaxed"
      style={{ color: PALETTE.olive }}
    >
      {children}
    </div>
  </section>
);

const Bullet = ({ items }: { items: string[] }) => (
  <ul className="mt-2 list-disc space-y-2 pl-5" style={{ color: PALETTE.olive }}>
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
        <h4 className="font-semibold" style={{ color: PALETTE.dark }}>
          {name}
        </h4>
        <p className="mt-0.5 text-xs" style={{ color: `${PALETTE.olive}CC` }}>
          {title}
        </p>

        <Link
          href={`/provider/${id}`}
          className="mt-2 ml-1 inline-block text-xs font-medium hover:underline transition"
          style={{ color: PALETTE.moss }}
        >
          {t("provider.cta")}
        </Link>
      </div>
    </li>
  );
}

/* Utilidades */
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
      ? p.bio.split("\n").map((s) => s.trim()).filter(Boolean)
      : [p.bio];

  const fallbackDr2 = p.id === "dr-Juan-Ortiz" ? t("provider.bio.dr2.text2") : "";
  const secondParagraph = isMeaningful(p.bio2)
    ? p.bio2
    : isMeaningful(fallbackDr2)
      ? fallbackDr2
      : undefined;
  const aboutParagraphs = isMeaningful(secondParagraph)
    ? [...baseParagraphs, secondParagraph.trim()]
    : baseParagraphs;

  const conditions: string[] =
    (p as any).conditions && (p as any).conditions.length > 0
      ? (p as any).conditions
      : [
        "Preventive Medicine",
        "Adult Immunizations",
        "Minor Illness Diagnosis and Treatment",
        "Minor Injury Diagnosis and Treatment",
        "Chronic Disease Management",
      ];


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
          backgroundColor: PALETTE.cream,
        }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div
              className="sticky rounded-md p-6 bg-transparent"
              style={{
                top: `calc(${toPx(navbarOffset)} + 16px)`,
              }}
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={avatar}
                  alt={p.name}
                  className="aspect-square w-full object-cover rounded-lg"
                />
              </div>

              <div
                className="my-6 h-px"
                style={{ backgroundColor: `${PALETTE.olive}33` }}
              />

              <h2
                className="text-xl font-semibold"
                style={{ color: PALETTE.dark }}
              >
                {p.name}
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: `${PALETTE.olive}CC` }}
              >
                {p.title}
              </p>

              {p.languages && (
                <div className="mt-4">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: PALETTE.dark }}
                  >
                    Languages
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: `${PALETTE.olive}CC` }}
                  >
                    {p.languages}
                  </p>
                </div>
              )}

              {p.experience && (
                <div className="mt-4">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: PALETTE.dark }}
                  >
                    Years of Experience
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: `${PALETTE.olive}CC` }}
                  >
                    {p.experience}
                  </p>
                </div>
              )}

              {/* Botón principal */}
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-sm px-4 py-2 text-sm font-semibold transition hover:scale-[1.03]"
                style={{
                  backgroundColor: PALETTE.olive,
                  color: PALETTE.cream,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                }}
              >
                {t("about.cta2.detail")}
              </Link>

              {/* Botones secundarios */}
              <div className="mt-3 grid grid-cols-1 gap-2">
                <a
                  href="/services"
                  className="inline-flex w-full items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition hover:scale-[1.02]"
                  style={{
                    color: PALETTE.dark,
                    backgroundColor: PALETTE.cream,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    border: `1px solid ${PALETTE.olive}33`, // borde sutil oliva translúcido
                  }}
                >
                  {t("service.seeAll.button")}
                </a>

                <button
                  type="button"
                  onClick={() => setInsuranceOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition hover:scale-[1.02]"
                  style={{
                    color: PALETTE.dark,
                    backgroundColor: PALETTE.cream,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    border: `1px solid ${PALETTE.olive}33`, // borde igual al de arriba
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
                  style={{ color: PALETTE.olive }}
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
        <footer className="mt-12" style={{ backgroundColor: PALETTE.cream }}>
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h3 className="mb-4 text-lg font-semibold" style={{ color: PALETTE.dark }}>
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
