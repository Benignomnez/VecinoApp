"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { getPlaceDetails } from "@/lib/google-places/client";
import ReviewForm from "@/components/business/ReviewForm";
import ReviewList from "@/components/business/ReviewList";
import StarRating from "@/components/business/StarRating";
import Map from "@/components/maps/Map";
import GoogleMapsScript from "@/components/maps/GoogleMapsScript";

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
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export default function BusinessPage() {
  const { id } = useParams();
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const details = await getPlaceDetails(id as string);
        const typedDetails = details as PlaceDetails;
        setPlaceDetails(typedDetails);

        // Extraer la ubicación para el mapa
        if (typedDetails.geometry && typedDetails.geometry.location) {
          setLocation({
            lat: typedDetails.geometry.location.lat(),
            lng: typedDetails.geometry.location.lng(),
          });
        }
      } catch (err) {
        console.error("Error al cargar los detalles del lugar:", err);
        setError(
          "No se pudieron cargar los detalles del lugar. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [id]);

  const handleReviewSubmitted = () => {
    // Incrementar el contador para forzar la recarga de reseñas
    setRefreshReviews((prev) => prev + 1);
    // Cambiar a la pestaña de reseñas
    setActiveTab("reviews");
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box height="300px" bg="gray.200" mb={6} />
        <Box height="40px" bg="gray.200" mb={4} />
        <Box height="20px" bg="gray.200" mb={2} />
        <Box height="20px" bg="gray.200" mb={6} />
      </Container>
    );
  }

  if (error || !placeDetails) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box p={4} borderRadius="md" bg="red.50" color="red.500">
          {error || "No se encontraron detalles para este lugar."}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Galería de fotos */}
      {placeDetails.photos && placeDetails.photos.length > 0 && (
        <Box mb={6} overflow="hidden" borderRadius="lg">
          <Image
            src={placeDetails.photos[0].getUrl()}
            alt={placeDetails.name}
            width="100%"
            height="400px"
            objectFit="cover"
          />
        </Box>
      )}

      {/* Información principal */}
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <GridItem>
          <Heading as="h1" size="xl" mb={2}>
            {placeDetails.name}
          </Heading>

          <Flex align="center" mb={4}>
            <StarRating
              initialRating={placeDetails.rating}
              isReadOnly
              size="md"
            />
            <Text ml={2} fontWeight="bold">
              {placeDetails.rating}
            </Text>
            <Text ml={1} color="gray.500">
              ({placeDetails.user_ratings_total} reseñas)
            </Text>
          </Flex>

          <Text mb={6}>{placeDetails.formatted_address}</Text>

          {/* Pestañas simplificadas */}
          <Flex mb={4} borderBottom="1px" borderColor="gray.200">
            <Box
              px={4}
              py={2}
              cursor="pointer"
              fontWeight={activeTab === "info" ? "bold" : "normal"}
              borderBottom={activeTab === "info" ? "2px solid" : "none"}
              borderColor="blue.500"
              onClick={() => setActiveTab("info")}
            >
              Información
            </Box>
            <Box
              px={4}
              py={2}
              cursor="pointer"
              fontWeight={activeTab === "reviews" ? "bold" : "normal"}
              borderBottom={activeTab === "reviews" ? "2px solid" : "none"}
              borderColor="blue.500"
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas
            </Box>
          </Flex>

          {/* Contenido de las pestañas */}
          {activeTab === "info" && (
            <Box>
              {/* Información del negocio */}
              <Box mb={4}>
                <Heading as="h3" size="md" mb={2}>
                  Contacto
                </Heading>
                {placeDetails.formatted_phone_number && (
                  <Text mb={2}>
                    <strong>Teléfono:</strong>{" "}
                    {placeDetails.formatted_phone_number}
                  </Text>
                )}
                {placeDetails.website && (
                  <Text mb={2}>
                    <strong>Sitio web:</strong>{" "}
                    <a
                      href={placeDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {placeDetails.website}
                    </a>
                  </Text>
                )}
              </Box>

              {placeDetails.opening_hours && (
                <Box mb={4}>
                  <Heading as="h3" size="md" mb={2}>
                    Horario
                  </Heading>
                  {placeDetails.opening_hours.weekday_text.map((day, index) => (
                    <Text key={index} mb={1}>
                      {day}
                    </Text>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeTab === "reviews" && (
            <Box>
              {/* Reseñas */}
              <Box mb={6}>
                <ReviewForm
                  placeId={id as string}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </Box>
              <ReviewList
                placeId={id as string}
                refreshTrigger={refreshReviews}
              />
            </Box>
          )}
        </GridItem>

        <GridItem>
          {/* Mapa */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            height="300px"
          >
            {location ? (
              <GoogleMapsScript>
                <Map
                  center={location}
                  zoom={15}
                  markers={[
                    {
                      id: id as string,
                      position: location,
                      title: placeDetails.name,
                    },
                  ]}
                  height="300px"
                />
              </GoogleMapsScript>
            ) : (
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
              >
                <Text>No se pudo cargar el mapa</Text>
              </Box>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}
