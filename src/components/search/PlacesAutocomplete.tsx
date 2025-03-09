"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Text,
  Flex,
  Spinner,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import GoogleMapsScript from "../maps/GoogleMapsScript";

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    placeId: string;
    name: string;
    address: string;
    location: { lat: number; lng: number };
  }) => void;
  placeholder?: string;
}

const PlacesAutocompleteWithScript = (props: PlacesAutocompleteProps) => {
  return (
    <GoogleMapsScript>
      <PlacesAutocomplete {...props} />
    </GoogleMapsScript>
  );
};

const PlacesAutocomplete = ({
  onPlaceSelect,
  placeholder = "Buscar restaurantes, playas, bares...",
}: PlacesAutocompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "do" }, // Restringir a República Dominicana
      types: ["establishment", "geocode"], // Buscar establecimientos y ubicaciones
    },
    debounce: 300,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpiar error al cambiar el input
    if (error) setError(null);
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    clearSuggestions();
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelect = async (placeId: string, description: string) => {
    setValue(description, false);
    clearSuggestions();
    setIsFocused(false);
    setIsLoading(true);
    setError(null);

    try {
      const results = await getGeocode({ placeId });
      const { lat, lng } = await getLatLng(results[0]);

      onPlaceSelect({
        placeId,
        name: description.split(",")[0], // Extraer el nombre del lugar
        address: description,
        location: { lat, lng },
      });
    } catch (error) {
      console.error("Error: ", error);
      setError("No se pudo obtener la ubicación. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" width="100%">
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none" h="full">
          <SearchIcon color="gray.400" />
        </InputLeftElement>

        <Input
          ref={inputRef}
          value={value}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          disabled={!ready || isLoading}
          placeholder={placeholder}
          borderRadius="full"
          borderWidth="2px"
          borderColor={isFocused ? "blue.500" : error ? "red.500" : "gray.200"}
          _hover={{ borderColor: error ? "red.500" : "blue.500" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          fontSize="md"
          bg="white"
          pl={10}
          pr={10}
          h="50px"
        />

        <InputRightElement h="full">
          {isLoading ? (
            <Spinner size="sm" color="blue.500" />
          ) : value ? (
            <Icon
              as={CloseIcon}
              color="gray.400"
              cursor="pointer"
              onClick={handleClear}
              _hover={{ color: "gray.600" }}
              boxSize={3}
            />
          ) : null}
        </InputRightElement>
      </InputGroup>

      {/* Mensaje de error */}
      {error && (
        <Text color="red.500" fontSize="sm" mt={1} ml={2}>
          {error}
        </Text>
      )}

      {/* Sugerencias */}
      {isFocused && status === "OK" && (
        <Box
          ref={suggestionsRef}
          position="absolute"
          mt={2}
          width="100%"
          zIndex={10}
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          overflow="hidden"
          maxH="300px"
          overflowY="auto"
        >
          <Box display="flex" flexDirection="column">
            {data.map((suggestion) => {
              const {
                place_id,
                description,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;

              return (
                <Box
                  key={place_id}
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleSelect(place_id, description)}
                >
                  <Flex align="center">
                    <Box mr={3}>
                      <SearchIcon color="gray.400" />
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">{main_text}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {secondary_text}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isFocused && status === "ZERO_RESULTS" && value.length > 0 && (
        <Box
          position="absolute"
          mt={2}
          width="100%"
          zIndex={10}
          borderRadius="md"
          boxShadow="md"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          p={4}
          textAlign="center"
        >
          <Text color="gray.500">
            No se encontraron resultados para "{value}"
          </Text>
        </Box>
      )}
    </Box>
  );
};

export { PlacesAutocompleteWithScript as PlacesAutocomplete };
export default PlacesAutocompleteWithScript;
