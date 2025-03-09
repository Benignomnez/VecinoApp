"use client";

import { useState } from "react";
import { Box, Button, Textarea, Text, Flex, useToast } from "@chakra-ui/react";
import { createReview } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import StarRating from "@/components/business/StarRating";

interface ReviewFormProps {
  placeId: string;
  onReviewSubmitted?: () => void;
}

interface ReviewError {
  message: string;
}

const ReviewForm = ({ placeId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para dejar una reseña",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una calificación",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await createReview(user.id, placeId, rating, comment);

      if (error) {
        throw error;
      }

      toast({
        title: "Reseña enviada",
        description: "Tu reseña ha sido publicada correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Limpiar el formulario
      setRating(0);
      setComment("");

      // Notificar al componente padre
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: unknown) {
      const reviewError = err as ReviewError;
      toast({
        title: "Error",
        description: reviewError.message || "Error al enviar la reseña",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        borderStyle="dashed"
        borderColor="gray.300"
        textAlign="center"
      >
        <Text mb={2}>Inicia sesión para dejar una reseña</Text>
        <Button as="a" href="/auth/login" colorScheme="blue" size="sm">
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Deja tu reseña
      </Text>

      <Box as="form" onSubmit={handleSubmit}>
        <Text mb={2} fontWeight="medium">
          Tu calificación:
        </Text>
        <Box mb={4}>
          <StarRating initialRating={rating} onChange={setRating} size="lg" />
        </Box>
      </Box>

      <Box mb={4}>
        <Text mb={2}>Tu comentario</Text>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con este lugar..."
          resize="vertical"
          minHeight="100px"
        />
      </Box>

      <Flex justify="flex-end">
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Enviando..."
        >
          Publicar reseña
        </Button>
      </Flex>
    </Box>
  );
};

export default ReviewForm;
