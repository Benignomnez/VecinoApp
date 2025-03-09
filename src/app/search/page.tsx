"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Flex,
  Checkbox,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { PlacesAutocomplete } from "@/components/search/PlacesAutocomplete";
import BusinessCard from "@/components/business/BusinessCard";
import BusinessCardSkeleton from "@/components/business/BusinessCardSkeleton";
import { searchNearbyPlaces } from "@/lib/google-places/client";
import GoogleMapsScript from "@/components/maps/GoogleMapsScript";

interface Place {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  types?: string[];
}

interface PlaceResult {
  place_id: string;
  name: string;
  photos?: Array<{
    getUrl: () => string;
  }>;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  types?: string[];
}

// Tipos de lugares disponibles para filtrar
const placeTypes = [
  { id: "restaurant", label: "Restaurantes", icon: "🍽️" },
  { id: "hotel", label: "Hoteles", icon: "🏨" },
  { id: "bar", label: "Bares", icon: "🍹" },
  { id: "cafe", label: "Cafeterías", icon: "☕" },
  { id: "beach", label: "Playas", icon: "🏖️" },
  { id: "museum", label: "Museos", icon: "🏛️" },
  { id: "park", label: "Parques", icon: "🌳" },
  { id: "shopping_mall", label: "Centros Comerciales", icon: "🛍️" },
  { id: "tourist_attraction", label: "Atracciones Turísticas", icon: "🗿" },
];

export default function SearchPage() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    location: { lat: number; lng: number };
  } | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filteredResults, setFilteredResults] = useState<Place[]>([]);

  const handlePlaceSelect = async (place: {
    placeId: string;
    name: string;
    address: string;
    location: { lat: number; lng: number };
  }) => {
    setSelectedPlace({
      name: place.name,
      location: place.location,
    });

    // Si se selecciona un lugar específico, redirigir a la página de detalles
    if (place.placeId) {
      router.push(`/business/${place.placeId}`);
      return;
    }

    // Si solo se selecciona una ubicación, buscar lugares cercanos
    try {
      setLoading(true);
      setError(null);

      // Usar el tipo seleccionado para la búsqueda si hay uno
      const type = selectedTypes.length === 1 ? selectedTypes[0] : undefined;
      const results = await searchNearbyPlaces(place.location, 5000, type);

      if (Array.isArray(results)) {
        const formattedResults = results.map((result: PlaceResult) => ({
          id: result.place_id,
          name: result.name,
          image: result.photos?.[0]?.getUrl() || "/placeholder-image.jpg",
          rating: result.rating || 0,
          reviewCount: result.user_ratings_total || 0,
          location: result.vicinity || "",
          category: result.types?.[0]?.replace("_", " ") || "Lugar",
          types: result.types,
        }));

        setSearchResults(formattedResults);
        applyFilters(formattedResults);
      } else {
        setSearchResults([]);
        setFilteredResults([]);
      }
    } catch (err) {
      console.error("Error al buscar lugares cercanos:", err);
      setError(
        "No se pudieron cargar los lugares cercanos. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    if (selectedTypes.includes(type)) {
      // Si ya está seleccionado, lo quitamos
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      // Si no está seleccionado, lo añadimos
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const applyFilters = useCallback(
    (results: Place[] = searchResults) => {
      if (selectedTypes.length === 0) {
        setFilteredResults(results);
        return;
      }

      const filtered = results.filter((place) => {
        // Si el lugar tiene tipos y al menos uno coincide con los seleccionados
        return place.types?.some((type) => selectedTypes.includes(type));
      });

      setFilteredResults(filtered);
    },
    [selectedTypes, searchResults]
  );

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Renderizar esqueletos durante la carga
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <GridItem key={`skeleton-${index}`}>
          <BusinessCardSkeleton />
        </GridItem>
      ));
  };

  return (
    <Box py={8}>
      <GoogleMapsScript />
      <Container maxW="container.xl">
        <Heading as="h1" size="xl" mb={6}>
          Buscar lugares en República Dominicana
        </Heading>

        <Box mb={8}>
          <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
        </Box>

        {/* Filtros por tipo de lugar */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Filtrar por tipo de lugar:
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
            {placeTypes.map((type) => (
              <Checkbox
                key={type.id}
                isChecked={selectedTypes.includes(type.id)}
                onChange={() => handleTypeSelect(type.id)}
                colorScheme="blue"
              >
                <Flex align="center">
                  <Text mr={2}>{type.icon}</Text>
                  <Text>{type.label}</Text>
                </Flex>
              </Checkbox>
            ))}
          </SimpleGrid>
        </Box>

        {/* Mostrar error si existe */}
        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error:</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Resultados de búsqueda */}
        {selectedPlace && (
          <Box mb={4}>
            <Text fontSize="lg" fontWeight="medium">
              Resultados cerca de{" "}
              <Text as="span" color="blue.600">
                {selectedPlace.name}
              </Text>
              :
            </Text>
          </Box>
        )}

        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {loading
            ? renderSkeletons()
            : filteredResults.map((place) => (
                <GridItem key={place.id}>
                  <BusinessCard
                    id={place.id}
                    name={place.name}
                    image={place.image}
                    rating={place.rating}
                    reviewCount={place.reviewCount}
                    location={place.location}
                    category={place.category}
                  />
                </GridItem>
              ))}
        </Grid>

        {/* Mensaje cuando no hay resultados */}
        {!loading &&
          filteredResults.length === 0 &&
          searchResults.length > 0 && (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.600">
                No hay resultados que coincidan con los filtros seleccionados.
              </Text>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => setSelectedTypes([])}
              >
                Limpiar filtros
              </Button>
            </Box>
          )}

        {/* Mensaje cuando no se ha realizado ninguna búsqueda */}
        {!loading && searchResults.length === 0 && !selectedPlace && (
          <Box
            textAlign="center"
            py={10}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.300"
          >
            <Text fontSize="lg" color="gray.600" mb={2}>
              Busca un lugar o selecciona una ubicación para ver resultados
            </Text>
            <Text fontSize="sm" color="gray.500">
              Puedes buscar por nombre, dirección o ciudad
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}
