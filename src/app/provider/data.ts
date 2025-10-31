import doctorAvatar from "@/../public/assets/images/avatar.jpg";
import maleAvatar from "@/../public/assets/images/Juan.jpg";
import { useTranslation } from "../contexts/TranslationContext";

export interface ProviderItem {
  id: string;
  name: string;
  title: string;
  image: { src: string } | string;
  education: string;
  education2?: string; // <— opcional
  residency: string;
  experience: string;
  languages: string;
  bio: string;
  bio2?: string; // <— opcional
  conditions?: string[];

}

/**
 * Genera los datos de proveedores traducidos usando el hook de traducción.
 */
export const useProvidersData = () => {
  const { t } = useTranslation();

  const providers: ProviderItem[] = [
    {
      id: "dr-Jaime-Acosta",
      name: "Dr. Jaime A. Acosta , MD",
      title: t("providers.dr1.title"),
      image: doctorAvatar,
      education: t("providers.dr1.education"),
      education2: t("providers.dr1.education2"),
      residency: "",
      experience: t("providers.dr1.experience"),
      languages: t("providers.dr1.languages"),
      bio: t("provider.bio.dr1"),
      bio2: t("provider.bio.dr1.text2"),

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
