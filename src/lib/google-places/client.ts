// Configuración para Google Places API
export const googleMapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Opciones para el autocompletado de lugares
export const placesAutocompleteOptions = {
  componentRestrictions: { country: "do" }, // Restringir a República Dominicana
  types: ["establishment"], // Buscar establecimientos
};

// Opciones para el mapa
export const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Función para obtener detalles de un lugar por su ID
export const getPlaceDetails = async (placeId: string) => {
  // Esta función debe ser llamada desde el cliente
  // ya que utiliza la API de Google Places que solo está disponible en el navegador
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.google) {
      reject(new Error("Google Maps API no está disponible"));
      return;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "photos",
          "rating",
          "user_ratings_total",
          "formatted_phone_number",
          "opening_hours",
          "website",
          "types",
          "reviews",
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`Error al obtener detalles del lugar: ${status}`));
        }
      }
    );
  });
};

// Función para buscar lugares cercanos
export const searchNearbyPlaces = async (
  location: google.maps.LatLngLiteral,
  radius: number = 5000,
  type?: string
) => {
  // Esta función debe ser llamada desde el cliente
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.google) {
      reject(new Error("Google Maps API no está disponible"));
      return;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius,
    };

    if (type) {
      request.type = type;
    }

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error(`Error al buscar lugares cercanos: ${status}`));
      }
    });
  });
};
