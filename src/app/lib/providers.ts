import doctorAvatar from "@/../public/assets/images/foto-doctora.jpg";
import maleAvatar from "@/../public/assets/images/Juan.jpg";
import { useTranslation } from "../contexts/TranslationContext";

export interface ProviderItem {
  id: string;
  name: string;
  title: string;
  image: { src: string } | string;
  education: string;
  experience: string;
  languages: string;
  bio: string;
  bio2?: string; // <- segundo párrafo opcional
}

/** Genera los datos de proveedores traducidos usando el hook de traducción. */
export const useProvidersData = () => {
  const { t } = useTranslation();

  // Helper para leer una traducción opcional sin “fugar” la key cruda
  const opt = (key: string) => {
    const v = t(key);
    return v && v !== key ? v : undefined;
  };

  const providers: ProviderItem[] = [
    {
      id: "dr-Jaime-acosta",
      name: "Dra. Martha I. Acosta, MD",
      title: t("providers.dr1.title"),
      image: doctorAvatar,
      education: t("providers.dr1.education"),
      experience: t("providers.dr1.experience"),
      languages: t("providers.dr1.languages"),
      bio: t("provider.bio.dr1"),
      bio2: opt("provider.bio.dr1.text2"),

    },
    {
      id: "dr-Juan-Ortiz ",
      name: "Dr. Juan Ortiz Guevara, MD",
      title: t("providers.dr2.title"),
      image: maleAvatar,
      education: t("providers.dr2.education"),
      experience: t("providers.dr2.experience"),
      languages: t("providers.dr2.languages"),
      bio: t("provider.bio.dr2"),
      bio2: opt("provider.bio.dr2.text2"), // ← se renderiza solo si existe
    },
  ];

  return providers;
};
