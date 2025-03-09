"use client";

import { Container, Box, Heading } from "@chakra-ui/react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Container maxW="container.md" py={12}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl">
          Iniciar Sesión en VecinoApp
        </Heading>
      </Box>

      <LoginForm />
    </Container>
  );
}
