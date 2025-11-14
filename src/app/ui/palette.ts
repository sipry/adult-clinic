// src/app/ui/palette.ts

export const PALETTE = [
  { base: "#B8EEE8", back: "#9EDBD4" }, // 0
  { base: "#A9E2D7", back: "#8FC8BE" }, // 1
  { base: "#D6F1D7", back: "#BFE0C1" }, // 2
  { base: "#F6EBCF", back: "#E6D5AE" }, // 3
  { base: "#FFE1A0", back: "#F2CD87" }, // 4
  { base: "#F6B588", back: "#E29663" }, // 5
  { base: "#EE9786", back: "#D77C6B" }, // 6
  { base: "#E47D79", back: "#CD6663" }, // 7
];

export const BRAND = {
  bg: "#FFFFFF",
  text: "#001219",
  subtitle: "#005F73",
  accent: "#0A9396",
  cta: "#BB3E03",
  border: "rgba(202, 103, 2, 0.3)",
};

export const getPaletteColor = (index: number) =>
  PALETTE[index % PALETTE.length];
