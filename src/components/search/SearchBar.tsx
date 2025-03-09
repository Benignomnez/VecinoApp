"use client";

import { useState, useEffect, useRef } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Flex,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { placesAutocompleteOptions } from "@/lib/google-places/client";
import { FaMapMarkerAlt } from "react-icons/fa";

interface SearchBarProps {
  onPlaceSelect?: (place: {
    placeId: string;
    description: string;
    location: google.maps.LatLngLiteral;
  }) => void;
  placeholder?: string;
}

// Definir la interfaz para las sugerencias de lugares
interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const SearchBar = ({
  onPlaceSelect,
  placeholder = "Buscar restaurantes, playas, bares...",
}: SearchBarProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: placesAutocompleteOptions,
    debounce: 300,
  });

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Colores para el modo claro/oscuro
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
    setValue(e.target.value);
  };

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setValue(suggestion.description, false);
    clearSuggestions();
    setIsFocused(false);

    try {
      const results = await getGeocode({ placeId: suggestion.place_id });
      const { lat, lng } = await getLatLng(results[0]);

      if (onPlaceSelect) {
        onPlaceSelect({
          placeId: suggestion.place_id,
          description: suggestion.description,
          location: { lat, lng },
        });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Box position="relative" width="100%">
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          disabled={!ready}
          placeholder={placeholder}
          borderRadius="full"
          borderWidth="2px"
          borderColor={isFocused ? "dominican.blue" : borderColor}
          _hover={{ borderColor: "dominican.blue" }}
          _focus={{
            borderColor: "dominican.blue",
            boxShadow: "0 0 0 1px var(--chakra-colors-dominican-blue)",
          }}
          fontSize="md"
          bg={bgColor}
        />
      </InputGroup>

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
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <VStack spacing={0} align="stretch">
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;

              return (
                <Box
                  key={place_id}
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: hoverBgColor }}
                  onClick={() => handleSelect(suggestion)}
                >
                  <Flex align="center">
                    <Icon as={FaMapMarkerAlt} color="dominican.red" mr={3} />
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
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
