"use client";

import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  Image,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";

// Datos de ejemplo para las categorías
const categories = [
  { id: "beaches", name: "Playas", icon: "🏖️" },
  { id: "restaurants", name: "Restaurantes", icon: "🍽️" },
  { id: "bars", name: "Bares", icon: "🍹" },
  { id: "hotels", name: "Hoteles", icon: "🏨" },
  { id: "activities", name: "Actividades", icon: "🏄‍♂️" },
  { id: "attractions", name: "Atracciones", icon: "🏛️" },
];

// Datos de ejemplo para los negocios destacados
const featuredBusinesses = [
  {
    id: "1",
    name: "Playa Bávaro",
    image:
      "https://images.unsplash.com/photo-1580541631950-7282082b53fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    rating: 4.8,
    reviewCount: 230,
    location: "Punta Cana, La Altagracia",
    category: "Playas",
  },
  {
    id: "2",
    name: "Adrian Tropical",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    rating: 4.5,
    reviewCount: 187,
    location: "Santo Domingo",
    category: "Restaurantes",
  },
  {
    id: "3",
    name: "Onno's Bar",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    rating: 4.3,
    reviewCount: 156,
    location: "Cabarete, Puerto Plata",
    category: "Bares",
  },
  {
    id: "4",
    name: "Hotel Casa Colonial",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    reviewCount: 203,
    location: "Puerto Plata",
    category: "Hoteles",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box as="main">
      {/* Hero Section */}
      <Box
        bgImage="url('https://images.unsplash.com/photo-1545319261-f3760f9dd64d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        height="500px"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
        />
        <Container maxW="container.xl" height="100%">
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="100%"
            position="relative"
            zIndex="1"
            textAlign="center"
            color="white"
          >
            <Heading as="h1" size="2xl" mb={4}>
              Descubre los mejores lugares en República Dominicana
            </Heading>
            <Text fontSize="xl" mb={8} maxW="container.md">
              Encuentra restaurantes, playas, bares y más. Lee reseñas de otros
              usuarios y comparte tus experiencias.
            </Text>

            {/* Aquí iría el componente SearchBar */}
            <Box width="100%" maxW="container.md">
              <input
                type="text"
                placeholder="Buscar restaurantes, playas, bares..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  fontSize: "16px",
                  borderRadius: "9999px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Categorías Populares */}
      <Container maxW="container.xl" py={16}>
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          Categorías Populares
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id} passHref>
              <VStack
                spacing={4}
                p={6}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
              >
                <Text fontSize="4xl">{category.icon}</Text>
                <Text fontWeight="bold">{category.name}</Text>
              </VStack>
            </Link>
          ))}
        </SimpleGrid>
      </Container>

      {/* Lugares Destacados */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Lugares Destacados
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {featuredBusinesses.map((business) => (
              <Link
                href={`/business/${business.id}`}
                key={business.id}
                passHref
              >
                <Box
                  bg="white"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                >
                  <Image
                    src={business.image}
                    alt={business.name}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />
                  <Box p={4}>
                    <Text fontWeight="bold" fontSize="lg" mb={1}>
                      {business.name}
                    </Text>
                    <Flex align="center" mb={1}>
                      {/* Aquí irían las estrellas */}
                      <Text color="dominican.sun" fontWeight="bold" mr={1}>
                        {business.rating}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ({business.reviewCount} reseñas)
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      {business.location}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="dominican.red"
                      mt={2}
                    >
                      {business.category}
                    </Text>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
          <Flex justify="center" mt={12}>
            <Button
              size="lg"
              colorScheme="blue"
              bg="dominican.blue"
              _hover={{ bg: "dominican.blue", opacity: 0.9 }}
            >
              Ver más lugares
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Sección de Descarga de App */}
      <Container maxW="container.xl" py={16}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          bg="dominican.turquoise"
          color="white"
          borderRadius="xl"
          p={{ base: 8, md: 12 }}
          boxShadow="xl"
        >
          <Box maxW={{ base: "100%", md: "60%" }} mb={{ base: 8, md: 0 }}>
            <Heading as="h2" size="xl" mb={4}>
              Descarga nuestra aplicación móvil
            </Heading>
            <Text fontSize="lg" mb={6}>
              Lleva VecinoApp contigo a donde vayas. Descubre lugares, lee
              reseñas y comparte tus experiencias desde tu dispositivo móvil.
            </Text>
            <Flex gap={4}>
              <Button bg="black" color="white" _hover={{ bg: "gray.800" }}>
                App Store
              </Button>
              <Button bg="black" color="white" _hover={{ bg: "gray.800" }}>
                Google Play
              </Button>
            </Flex>
          </Box>
          <Box>
            {/* Aquí iría una imagen de un teléfono con la app */}
            <Box
              width="250px"
              height="500px"
              bg="gray.200"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>Imagen de App</Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
