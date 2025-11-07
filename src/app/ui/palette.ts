// src/app/ui/palette.ts

// misma paleta que usaste en ServicesRail
export const PALETTE = [
  { base: "#9ADAD8", back: "#7EC4C2", text: "#001219" },
  { base: "#C8E7DA", back: "#A8D1C2", text: "#001219" },
  { base: "#F5EBC6", back: "#EAD7A4", text: "#001219" },
  { base: "#FFD77A", back: "#EEC46A", text: "#001219" },
  { base: "#F3A96C", back: "#E48B4F", text: "#001219" },
  { base: "#E48C7A", back: "#D67463", text: "#001219" },
  { base: "#E57B76", back: "#D66A65", text: "#001219" },
  { base: "#DC767B", back: "#C85D61", text: "#001219" },
];

// colores “de marca” que se repiten en tus secciones
export const BRAND = {
  bg: "#FFFFFF",
  title: "#001219",
  subtitle: "#005F73",
  accent: "#0A9396",
  cta: "#BB3E03",
  border: "rgba(202, 103, 2, 0.3)", // equivalente a #CA6702/30
};

// opcional, pero útil para listas/cards
export const getPaletteColor = (index: number) =>
  PALETTE[index % PALETTE.length];
