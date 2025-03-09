"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/lib/supabase/auth-context";
import theme from "@/theme";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
