/**
 * React Query provider setup
 * Wraps app with QueryClientProvider
 */

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "@/config/queryClient";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({
  children,
}: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
