import doctorAvatar from "@/../public/assets/images/Jaime.webp";
import maleAvatar from "@/../public/assets/images/Juan.webp";
import { useTranslation } from "../contexts/TranslationContext";

export interface ProviderItem {
  id: string;
  name: string;
  title: string;
  image: { src: string } | string;
  // 👇 CAMBIO: ahora puede ser texto o array de textos
  education: string | string[];
  residency: string;
  experience: string;
  languages: string;
  bio: string;
  bio2?: string; // <— opcional
  conditions?: string[];
  researchGate?: string;
  linkedIn?: string;
}

/**
 * Genera los datos de proveedores traducidos usando el hook de traducción.
 */
export const useProvidersData = () => {
  // 👇 CAMBIO: extraemos también tArray del contexto
  const { t, tArray } = useTranslation() as {
    t: (key: string) => string;
    tFormat: (key: string, params: Record<string, string | number>) => string;
    tArray: <T = unknown>(key: string) => T[];
  };

  const providers: ProviderItem[] = [
    {
      id: "dr-Jaime-Acosta",
      name: "Dr. Jaime A. Acosta , MD",
      title: t("providers.dr1.title"),
      image: doctorAvatar,
      education: tArray<string>("providers.dr1.education"),
      residency: "",
      experience: t("providers.dr1.experience"),
      languages: t("providers.dr1.languages"),
      bio: t("provider.bio.dr1"),
      bio2: t("provider.bio.dr1.text2"),
      researchGate: "#",
      linkedIn: "#",
    },
    {
      id: "dr-Juan-Ortiz",
      name: "Dr. Juan Ortiz Guevara, MD",
      title: t("providers.dr2.title"),
      image: maleAvatar,
      education: t("providers.dr2.education"),
      residency: "Jersey Shore Medical Center, Neptune City, NJ",
      experience: t("providers.dr2.experience"),
      languages: t("providers.dr2.languages"),
      bio: t("provider.bio.dr2"),
      bio2: t("provider.bio.dr2.text2"), // <— segundo párrafo opcional
    },
  ];

  return providers;
};
