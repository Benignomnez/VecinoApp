import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import { Box } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VecinoApp - Encuentra los mejores lugares en República Dominicana",
  description:
    "Descubre y comparte opiniones sobre los mejores lugares en República Dominicana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box as="main" flex="1">
              {children}
            </Box>
            <Box as="footer" py={6} textAlign="center" bg="gray.100">
              <Box maxW="container.xl" mx="auto" px={4}>
                <p>
                  © {new Date().getFullYear()} VecinoApp - Todos los derechos
                  reservados
                </p>
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
