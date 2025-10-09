"use client";

import React from "react";
import { TranslationProvider } from "../contexts/TranslationContext";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TranslationProvider>{children}</TranslationProvider>;
}
