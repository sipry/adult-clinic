import doctorAvatar from "@/../public/assets/images/foto-doctora.jpg";
import maleAvatar from "@/../public/assets/images/Bolumen.jpeg";
import { useTranslation } from "../contexts/TranslationContext";

export interface ProviderItem {
  id: string;
  name: string;
  title: string;
  image: { src: string } | string;
  education: string;
  residency: string;
  experience: string;
  languages: string;
  bio: string;
  bio2?: string; // <— opcional
}

/**
 * Genera los datos de proveedores traducidos usando el hook de traducción.
 */
export const useProvidersData = () => {
  const { t } = useTranslation();

  const providers: ProviderItem[] = [
    {
      id: "dr-maria-rodriguez",
      name: "Dra. Martha I. Acosta, MD",
      title: t("providers.dr1.title"),
      image: doctorAvatar,
      education: t("providers.dr1.education"),
      residency: "",
      experience: t("providers.dr1.experience"),
      languages: t("providers.dr1.languages"),
      bio: t("provider.bio.dr1"),
      // sin bio2
    },
    {
      id: "dr-james-thompson",
      name: "Dr. Eduardo F. Bolumen, MD",
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
