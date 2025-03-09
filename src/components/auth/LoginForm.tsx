"use client";

import { useState } from "react";
import { Box, Button, Input, Text, Flex } from "@chakra-ui/react";
import { signIn } from "@/lib/supabase/client";
import Link from "next/link";

interface AuthError {
  message: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      // Redirigir al usuario a la página principal o dashboard
      window.location.href = "/";
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <form onSubmit={handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Iniciar Sesión
        </Text>

        {error && (
          <Box
            p={3}
            mb={4}
            bg="red.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="red.500">{error}</Text>
          </Box>
        )}

        <Box mb={4}>
          <Text mb={2} fontWeight="medium">
            Correo electrónico
          </Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            required
          />
        </Box>

        <Box mb={6}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Contraseña</Text>
            <Link href="/auth/reset-password" passHref>
              <Text color="blue.500" fontSize="sm">
                ¿Olvidaste tu contraseña?
              </Text>
            </Link>
          </Flex>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={loading}
          loadingText="Iniciando sesión..."
        >
          Iniciar Sesión
        </Button>

        <Flex justify="center" mt={4}>
          <Text mr={2}>¿No tienes una cuenta?</Text>
          <Link href="/auth/register" passHref>
            <Text color="blue.500" fontWeight="medium">
              Regístrate
            </Text>
          </Link>
        </Flex>
      </form>
    </Box>
  );
};

export default LoginForm;
