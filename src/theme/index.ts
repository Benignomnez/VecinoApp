import { extendTheme } from "@chakra-ui/react";

// Configuración personalizada para Chakra UI v2.x
const colors = {
  dominican: {
    blue: "#00209F", // Azul de la bandera dominicana
    red: "#CE1126", // Rojo de la bandera dominicana
    white: "#FFFFFF", // Blanco de la bandera dominicana
    turquoise: "#00CED1", // Azul turquesa del mar Caribe
    sand: "#F5DEB3", // Color arena de las playas
    palm: "#228B22", // Verde de las palmeras
    sun: "#FFD700", // Amarillo sol
    coral: "#FF7F50", // Coral de los arrecifes
    emerald: "#50C878", // Verde esmeralda de la vegetación
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: "var(--font-poppins)",
    body: "var(--font-inter)",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "md",
      },
    },
  },
});

export default theme;
