"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Flex,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "@/lib/supabase/auth-context";
import { getFavorites, Favorite } from "@/lib/supabase/client";
import Link from "next/link";
import FavoriteButton from "@/components/business/FavoriteButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await getFavorites(user.id);

        if (error) {
          throw error;
        }

        if (data) {
          setFavorites(data);
        }
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
        setError(
          "No se pudieron cargar tus lugares favoritos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <Container maxW="container.xl" py={12}>
        <Box textAlign="center" py={12} px={6}>
          <Heading as="h2" size="xl" mb={6}>
            Inicia sesión para ver tus favoritos
          </Heading>
          <Text mb={6}>
            Necesitas iniciar sesión para guardar y ver tus lugares favoritos.
          </Text>
          <Link href="/auth/login" passHref>
            <Button colorScheme="blue" size="lg">
              Iniciar sesión
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" mb={8}>
          Mis Lugares Favoritos
        </Heading>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GridItem key={i}>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                height="300px"
                bg="gray.100"
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box p={4} borderRadius="md" bg="red.50" color="red.500">
          {error}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={4}>
        Mis Lugares Favoritos
      </Heading>

      {favorites.length === 0 ? (
        <Box textAlign="center" py={12} px={6}>
          <Text fontSize="xl" mb={6}>
            Aún no tienes lugares favoritos
          </Text>
          <Link href="/search" passHref>
            <Button colorScheme="blue">Explorar lugares</Button>
          </Link>
        </Box>
      ) : (
        <>
          <Text mb={8} color="gray.600">
            Has guardado {favorites.length}{" "}
            {favorites.length === 1 ? "lugar" : "lugares"} como favoritos
          </Text>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {favorites.map((favorite) => (
              <GridItem key={favorite.id}>
                <Box position="relative">
                  <Link
                    href={`/business/${favorite.place_id}`}
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="md"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.3s"
                    >
                      <Image
                        src={favorite.place_image || "/placeholder-image.jpg"}
                        alt={favorite.place_name}
                        height="200px"
                        width="100%"
                        objectFit="cover"
                      />
                      <Box p={4}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <Badge borderRadius="full" px={2} colorScheme="red">
                            Favorito
                          </Badge>
                        </Flex>
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          mb={2}
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {favorite.place_name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Añadido el{" "}
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Box>
                  </Link>

                  {/* Botón de favorito */}
                  <FavoriteButton
                    placeId={favorite.place_id}
                    placeName={favorite.place_name}
                    placeImage={favorite.place_image}
                    size="sm"
                    position="absolute"
                    top={3}
                    right={3}
                  />
                </Box>
              </GridItem>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
