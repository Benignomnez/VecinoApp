"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Badge,
  Button,
  HStack,
  VStack,
  Image,
  SimpleGrid,
  Divider,
  Icon,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import {
  StarIcon,
  PhoneIcon,
  TimeIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { getPlaceDetails } from "@/lib/google-places/client";

interface BusinessDetailsProps {
  placeId: string;
}

interface PlaceDetails {
  name: string;
  formatted_address: string;
  photos: Array<{
    getUrl: () => string;
  }>;
  rating: number;
  user_ratings_total: number;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
    isOpen: () => boolean;
  };
  website?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
  }>;
}

const BusinessDetails = ({ placeId }: BusinessDetailsProps) => {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        const details = await getPlaceDetails(placeId);
        setPlaceDetails(details as PlaceDetails);
        setError(null);
      } catch (err) {
        console.error("Error fetching place details:", err);
        setError(
          "No se pudieron cargar los detalles del lugar. Por favor, intenta de nuevo más tarde."
        );
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del lugar.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId, toast]);

  // Renderizar estrellas basadas en la calificación
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} color="dominican.sun" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} color="dominican.sun" />);
      } else {
        stars.push(<StarIcon key={i} color="gray.300" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Skeleton height="300px" mb={6} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="20px" mb={2} />
        <Skeleton height="20px" mb={6} />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Skeleton height="200px" />
          <Skeleton height="200px" />
          <Skeleton height="200px" />
        </SimpleGrid>
      </Container>
    );
  }

  if (error || !placeDetails) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Heading as="h2" size="xl" mb={4}>
          Error al cargar los detalles
        </Heading>
        <Text mb={6}>
          {error || "No se encontraron detalles para este lugar."}
        </Text>
        <Button colorScheme="blue" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </Container>
    );
  }

  return (
    <Box as="main">
      {/* Galería de fotos */}
      <Box bg="gray.100" mb={8}>
        <Container maxW="container.xl" py={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {placeDetails.photos &&
              placeDetails.photos
                .slice(0, 3)
                .map((photo, index) => (
                  <Image
                    key={index}
                    src={photo.getUrl()}
                    alt={`${placeDetails.name} - Foto ${index + 1}`}
                    height="300px"
                    width="100%"
                    objectFit="cover"
                    borderRadius="md"
                  />
                ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Información principal */}
          <Box flex="2">
            <Heading as="h1" size="xl" mb={2}>
              {placeDetails.name}
            </Heading>

            <Flex align="center" mb={4}>
              <HStack spacing={1} mr={2}>
                {renderStars(placeDetails.rating)}
              </HStack>
              <Text fontWeight="bold">{placeDetails.rating}</Text>
              <Text ml={2} color="gray.500">
                ({placeDetails.user_ratings_total} reseñas)
              </Text>
            </Flex>

            <Flex align="center" mb={4}>
              <Icon as={FaMapMarkerAlt} color="dominican.red" mr={2} />
              <Text>{placeDetails.formatted_address}</Text>
            </Flex>

            {placeDetails.formatted_phone_number && (
              <Flex align="center" mb={4}>
                <PhoneIcon color="dominican.blue" mr={2} />
                <Text>{placeDetails.formatted_phone_number}</Text>
              </Flex>
            )}

            {placeDetails.website && (
              <Flex align="center" mb={4}>
                <Icon as={FaGlobe} color="dominican.blue" mr={2} />
                <Text>
                  <a
                    href={placeDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {placeDetails.website}
                  </a>
                </Text>
                <ExternalLinkIcon ml={1} />
              </Flex>
            )}

            <Divider my={6} />

            {/* Reseñas */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Reseñas
              </Heading>

              {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {placeDetails.reviews.map((review, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                      <Flex justify="space-between" mb={2}>
                        <Text fontWeight="bold">{review.author_name}</Text>
                        <Text color="gray.500" fontSize="sm">
                          {review.relative_time_description}
                        </Text>
                      </Flex>
                      <HStack spacing={1} mb={2}>
                        {renderStars(review.rating)}
                      </HStack>
                      <Text>{review.text}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text>No hay reseñas disponibles para este lugar.</Text>
              )}

              <Button
                mt={6}
                colorScheme="blue"
                bg="dominican.blue"
                _hover={{ bg: "dominican.blue", opacity: 0.9 }}
              >
                Escribir una reseña
              </Button>
            </Box>
          </Box>

          {/* Información adicional */}
          <Box flex="1">
            <Box p={6} borderWidth="1px" borderRadius="lg" mb={6}>
              <Heading
                as="h3"
                size="md"
                mb={4}
                display="flex"
                alignItems="center"
              >
                <TimeIcon mr={2} /> Horario
              </Heading>

              {placeDetails.opening_hours ? (
                <VStack align="stretch" spacing={2}>
                  {placeDetails.opening_hours.weekday_text.map((day, index) => (
                    <Text key={index}>{day}</Text>
                  ))}
                  <Badge
                    colorScheme={
                      placeDetails.opening_hours.isOpen() ? "green" : "red"
                    }
                    alignSelf="flex-start"
                    mt={2}
                  >
                    {placeDetails.opening_hours.isOpen()
                      ? "Abierto ahora"
                      : "Cerrado ahora"}
                  </Badge>
                </VStack>
              ) : (
                <Text>Horario no disponible</Text>
              )}
            </Box>

            {/* Mapa */}
            <Box
              borderWidth="1px"
              borderRadius="lg"
              height="300px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>Mapa de ubicación</Text>
              {/* Aquí iría el componente de mapa con Google Maps */}
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default BusinessDetails;
