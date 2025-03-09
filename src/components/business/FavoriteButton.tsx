"use client";

import { useState, useEffect } from "react";
import { Box, IconButton, useToast } from "@chakra-ui/react";
import { useAuth } from "@/lib/supabase/auth-context";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  placeId: string;
  placeName: string;
  placeImage?: string;
  size?: "sm" | "md" | "lg";
  position?: "absolute" | "relative";
  top?: number | string;
  right?: number | string;
}

const FavoriteButton = ({
  placeId,
  placeName,
  placeImage,
  size = "md",
  position = "absolute",
  top = 2,
  right = 2,
}: FavoriteButtonProps) => {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  // Verificar si el lugar está en favoritos
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;

      try {
        const { isFavorite: isFav } = await isFavorite(user.id, placeId);
        setIsFav(isFav);
      } catch (error) {
        console.error("Error al verificar favorito:", error);
      }
    };

    checkFavorite();
  }, [user, placeId]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      if (isFav) {
        // Eliminar de favoritos
        await removeFavorite(user.id, placeId);
        setIsFav(false);
        toast({
          title: "Eliminado de favoritos",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Añadir a favoritos
        await addFavorite(user.id, placeId, placeName, placeImage);
        setIsFav(true);
        toast({
          title: "Añadido a favoritos",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Estilos para el botón
  const buttonSize = {
    sm: { boxSize: "30px", fontSize: "14px" },
    md: { boxSize: "36px", fontSize: "18px" },
    lg: { boxSize: "42px", fontSize: "22px" },
  }[size];

  return (
    <Box position={position} top={top} right={right} zIndex={1}>
      <IconButton
        aria-label={isFav ? "Eliminar de favoritos" : "Añadir a favoritos"}
        icon={
          <Box as="span" fontSize={buttonSize.fontSize}>
            {isFav ? "❤️" : "🤍"}
          </Box>
        }
        variant="ghost"
        isRound
        size={size}
        isLoading={loading}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleToggleFavorite();
        }}
        bg="white"
        boxShadow="sm"
        _hover={{ transform: "scale(1.1)" }}
      />
    </Box>
  );
};

export default FavoriteButton;
