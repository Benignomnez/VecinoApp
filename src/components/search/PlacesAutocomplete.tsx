"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
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
      types: ["establishment"], // Buscar establecimientos
    },
    debounce: 300,
  });

  const [isFocused, setIsFocused] = useState(false);
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
    setValue(e.target.value);
  };

  const handleSelect = async (placeId: string, description: string) => {
    setValue(description, false);
    clearSuggestions();
    setIsFocused(false);

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
    }
  };

  return (
    <Box position="relative" width="100%">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInput}
        onFocus={() => setIsFocused(true)}
        disabled={!ready}
        placeholder={placeholder}
        borderRadius="full"
        borderWidth="2px"
        borderColor={isFocused ? "blue.500" : "gray.200"}
        _hover={{ borderColor: "blue.500" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
        fontSize="md"
        bg="white"
        p={4}
      />

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
                  <Text fontWeight="semibold">{main_text}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {secondary_text}
                  </Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { PlacesAutocompleteWithScript as PlacesAutocomplete };
export default PlacesAutocompleteWithScript;
