"use client";

import { ReduxProvider } from "../redux/provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
