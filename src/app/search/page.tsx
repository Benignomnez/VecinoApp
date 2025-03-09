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
} from "@chakra-ui/react";
import { PlacesAutocomplete } from "@/components/search/PlacesAutocomplete";
import BusinessCard from "@/components/business/BusinessCard";
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

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={4}>
          Buscar lugares en República Dominicana
        </Heading>
        <Text mb={6}>
          Busca restaurantes, playas, bares y más en República Dominicana
        </Text>

        <Box maxW="container.md" mx="auto" mb={8}>
          <GoogleMapsScript>
            <PlacesAutocomplete
              onPlaceSelect={handlePlaceSelect}
              placeholder="Buscar lugares en República Dominicana..."
            />
          </GoogleMapsScript>
        </Box>
      </Box>

      {/* Filtros de tipo de lugar */}
      <Box mb={6}>
        <Heading as="h3" size="md" mb={3}>
          Filtrar por tipo de lugar
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={3}>
          {placeTypes.map((type) => (
            <Flex
              key={type.id}
              p={2}
              borderWidth="1px"
              borderRadius="md"
              borderColor={
                selectedTypes.includes(type.id) ? "blue.500" : "gray.200"
              }
              bg={selectedTypes.includes(type.id) ? "blue.50" : "white"}
              cursor="pointer"
              onClick={() => handleTypeSelect(type.id)}
              align="center"
            >
              <Checkbox
                isChecked={selectedTypes.includes(type.id)}
                onChange={() => handleTypeSelect(type.id)}
                mr={2}
              >
                {type.label}
              </Checkbox>
            </Flex>
          ))}
        </SimpleGrid>
        {selectedTypes.length > 0 && (
          <Button
            mt={3}
            size="sm"
            variant="outline"
            onClick={() => setSelectedTypes([])}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>

      {loading && (
        <Box textAlign="center" py={8}>
          <Text>Cargando resultados...</Text>
        </Box>
      )}

      {error && (
        <Box p={4} borderRadius="md" bg="red.50" color="red.500" mb={8}>
          {error}
        </Box>
      )}

      {!loading && !error && filteredResults.length > 0 && (
        <>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="lg">
              Resultados de búsqueda
            </Heading>
            <Text color="gray.500">
              {filteredResults.length}{" "}
              {filteredResults.length === 1
                ? "lugar encontrado"
                : "lugares encontrados"}
            </Text>
          </Flex>

          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
            mb={8}
          >
            {filteredResults.map((place) => (
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

          {filteredResults.length > 0 &&
            searchResults.length > filteredResults.length && (
              <Box textAlign="center" mb={8}>
                <Text mb={2}>
                  Mostrando {filteredResults.length} de {searchResults.length}{" "}
                  resultados
                </Text>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => setSelectedTypes([])}
                >
                  Mostrar todos los resultados
                </Button>
              </Box>
            )}
        </>
      )}

      {!loading &&
        !error &&
        searchResults.length > 0 &&
        filteredResults.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text mb={4}>
              No se encontraron resultados con los filtros seleccionados.
            </Text>
            <Button colorScheme="blue" onClick={() => setSelectedTypes([])}>
              Mostrar todos los resultados
            </Button>
          </Box>
        )}

      {!loading && !error && searchResults.length === 0 && selectedPlace && (
        <Box textAlign="center" py={8}>
          <Text>
            No se encontraron resultados para {selectedPlace.name}. Intenta con
            otra búsqueda.
          </Text>
        </Box>
      )}
    </Container>
  );
}
