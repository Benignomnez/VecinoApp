"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/supabase/auth-context";
import system from "../theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
