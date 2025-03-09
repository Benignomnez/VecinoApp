"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
  Code,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // También podemos registrar el error en un servicio de reporte de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorFallback = ({
  error,
  errorInfo,
  onReload,
  onGoHome,
}: ErrorFallbackProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2} color="red.500">
            ¡Ups! Algo salió mal
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Hemos encontrado un error inesperado. Por favor, intenta recargar la
            página.
          </Text>
        </Box>

        <Box
          p={6}
          borderRadius="lg"
          bg="red.50"
          borderWidth="1px"
          borderColor="red.200"
        >
          <Text fontWeight="bold" mb={2}>
            Error: {error?.message || "Error desconocido"}
          </Text>
          <Button
            size="sm"
            onClick={onToggle}
            colorScheme="red"
            variant="outline"
            mt={2}
          >
            {isOpen ? "Ocultar detalles técnicos" : "Mostrar detalles técnicos"}
          </Button>
          <Collapse in={isOpen} animateOpacity>
            <Box
              mt={4}
              p={3}
              bg="gray.800"
              color="white"
              borderRadius="md"
              overflowX="auto"
            >
              <Code
                colorScheme="red"
                whiteSpace="pre-wrap"
                display="block"
                p={2}
              >
                {error?.stack}
                {errorInfo &&
                  `\n\nComponent Stack:\n${errorInfo.componentStack}`}
              </Code>
            </Box>
          </Collapse>
        </Box>

        <Box textAlign="center">
          <Button colorScheme="blue" mr={4} onClick={onReload}>
            Recargar página
          </Button>
          <Button variant="outline" onClick={onGoHome}>
            Ir al inicio
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default ErrorBoundary;
