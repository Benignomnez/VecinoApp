"use client";

import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

// Definir las bibliotecas que necesitamos
const libraries: ["places"] = ["places"];

interface GoogleMapsScriptProps {
  children?: React.ReactNode;
}

const GoogleMapsScript = ({ children }: GoogleMapsScriptProps) => {
  const [isClient, setIsClient] = useState(false);

  // Asegurarnos de que estamos en el cliente antes de cargar el script
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener la clave de API desde las variables de entorno
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Cargar el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Mostrar un mensaje de error si hay un problema al cargar el script
  if (loadError) {
    return (
      <div>
        Error al cargar Google Maps. Por favor, recarga la página o intenta más
        tarde.
      </div>
    );
  }

  // Mostrar un mensaje de carga mientras se carga el script
  if (!isLoaded || !isClient) {
    return <div>Cargando Google Maps...</div>;
  }

  // Si no hay children, simplemente retornar null
  if (!children) {
    return null;
  }

  // Renderizar los componentes hijos una vez que el script está cargado
  return <>{children}</>;
};

export default GoogleMapsScript;
