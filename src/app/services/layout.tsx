// app/services/layout.tsx  (o donde tengas este layout)

import React from "react";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
