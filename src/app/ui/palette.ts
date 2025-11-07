// src/app/ui/palette.ts

// misma paleta que usaste en ServicesRail
export const PALETTE = [
  { base: "#B8EEE8", back: "#9EDBD4" },
  { base: "#A9E2D7", back: "#8FC8BE" },
  { base: "#D6F1D7", back: "#BFE0C1" },
  { base: "#F6EBCF", back: "#E6D5AE" },
  { base: "#FFE1A0", back: "#F2CD87" },
  { base: "#F6B588", back: "#E29663" },
  { base: "#EE9786", back: "#D77C6B" },
  { base: "#E47D79", back: "#CD6663" },
];

// colores “de marca” que se repiten en tus secciones
export const BRAND = {
  bg: "#FFFFFF",
  text: "#001219",
  subtitle: "#005F73",
  accent: "#0A9396",
  cta: "#BB3E03",
  border: "rgba(202, 103, 2, 0.3)", // equivalente a #CA6702/30
};

// opcional, pero útil para listas/cards
export const getPaletteColor = (index: number) =>
  PALETTE[index % PALETTE.length];
