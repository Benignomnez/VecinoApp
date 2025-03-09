"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Box, Text } from "@chakra-ui/react";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title: string;
    onClick?: () => void;
  }>;
  height?: string | number;
  width?: string | number;
}

const Map = ({
  center,
  zoom = 15,
  markers = [],
  height = "400px",
  width = "100%",
}: MapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Opciones del mapa
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  };

  // Referencia al contenedor del mapa
  const mapContainerStyle = {
    width,
    height,
  };

  // Callback cuando el mapa se carga
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      // Puedes hacer algo con el mapa si es necesario
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.position));
      if (markers.length > 1) {
        map.fitBounds(bounds);
      }
    },
    [markers]
  );

  // Callback cuando el mapa se desmonta
  const onUnmount = useCallback(() => {
    // Limpieza si es necesaria
  }, []);

  return (
    <Box borderRadius="lg" overflow="hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => {
              setSelectedMarker(marker.id);
              if (marker.onClick) {
                marker.onClick();
              }
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={markers.find((m) => m.id === selectedMarker)?.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <Box p={2}>
              <Text fontWeight="bold">
                {markers.find((m) => m.id === selectedMarker)?.title}
              </Text>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  );
};

export default Map;
