"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { signUp } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "El nombre es requerido";
    }

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        throw error;
      }

      toast({
        title: "Cuenta creada",
        description:
          "Te hemos enviado un correo de confirmación. Por favor, verifica tu correo electrónico.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirigir al usuario a la página de inicio de sesión
      router.push("/auth/login");
    } catch (err: Error | unknown) {
      toast({
        title: "Error al crear la cuenta",
        description:
          err instanceof Error
            ? err.message
            : "Ha ocurrido un error. Por favor, intenta de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl">
          Crear una cuenta en VecinoApp
        </Heading>
        <Text mt={2} color="gray.600">
          Únete a nuestra comunidad y descubre los mejores lugares en República
          Dominicana
        </Text>
      </Box>

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
          <FormControl isInvalid={!!errors.fullName} mb={4}>
            <FormLabel>Nombre completo</FormLabel>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.fullName && (
              <FormErrorMessage>{errors.fullName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email} mb={4}>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword} mb={6}>
            <FormLabel>Confirmar contraseña</FormLabel>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && (
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Creando cuenta..."
          >
            Registrarse
          </Button>

          <Box textAlign="center" mt={4}>
            <Text>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" passHref>
                <ChakraLink color="blue.500">Iniciar sesión</ChakraLink>
              </Link>
            </Text>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
