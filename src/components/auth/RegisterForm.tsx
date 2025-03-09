"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { signUp } from "@/lib/supabase/client";
import Link from "next/link";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    setIsLoading(true);

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

      // Limpiar el formulario
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: Error | unknown) {
      toast({
        title: "Error al crear la cuenta",
        description:
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error. Por favor, intenta de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Stack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading as="h2" size="lg" textAlign="center" mb={2}>
          Crear una cuenta
        </Heading>
        <Text textAlign="center" color="gray.600" mb={4}>
          Únete a VecinoApp para descubrir y compartir los mejores lugares en
          República Dominicana
        </Text>

        <FormControl isInvalid={!!errors.fullName}>
          <FormLabel>Nombre completo</FormLabel>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            focusBorderColor="dominican.blue"
          />
          <FormErrorMessage>{errors.fullName}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Correo electrónico</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            focusBorderColor="dominican.blue"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Contraseña</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              focusBorderColor="dominican.blue"
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
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirmar contraseña</FormLabel>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            focusBorderColor="dominican.blue"
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          bg="dominican.blue"
          _hover={{ bg: "dominican.blue", opacity: 0.9 }}
          size="lg"
          isLoading={isLoading}
          loadingText="Creando cuenta..."
          mt={4}
        >
          Registrarse
        </Button>

        <Flex justify="center" mt={4}>
          <Text mr={2}>¿Ya tienes una cuenta?</Text>
          <Link href="/auth/login" passHref>
            <Text color="dominican.blue" fontWeight="bold">
              Iniciar sesión
            </Text>
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
};

export default RegisterForm;
