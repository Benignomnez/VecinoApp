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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredBusinesses = activeCategory
    ? featuredBusinesses.filter(
        (business) => business.category.toLowerCase() === activeCategory
      )
    : featuredBusinesses;

  return (
    <Box as="main">
      {/* Hero Section */}
      <Box
        bg="dominican.blue"
        color="white"
        py={12}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Box maxW="container.md" position="relative" zIndex={1}>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              fontFamily="heading"
              fontWeight="bold"
              lineHeight="1.2"
            >
              Descubre los mejores lugares en
              <Text as="span" color="dominican.red">
                {" "}
                República Dominicana
              </Text>
            </Heading>
            <Text fontSize="xl" mb={6} fontFamily="body" fontWeight="medium">
              Encuentra restaurantes, playas, hoteles y más. Comparte tus
              experiencias y descubre recomendaciones de otros viajeros.
            </Text>
            <Flex gap={4}>
              <Button
                as={Link}
                href="/search"
                size="lg"
                bg="dominican.red"
                color="white"
                _hover={{ bg: "dominican.red", opacity: 0.9 }}
                fontFamily="heading"
                fontWeight="medium"
              >
                Explorar lugares
              </Button>
              <Button
                as={Link}
                href="/auth/register"
                size="lg"
                variant="outline"
                colorScheme="whiteAlpha"
                _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                fontFamily="heading"
                fontWeight="medium"
              >
                Registrarse
              </Button>
            </Flex>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box py={12} bg="gray.50">
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="xl"
            mb={8}
            textAlign="center"
            fontFamily="heading"
            color="gray.800"
          >
            Explora por categorías
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
            {categories.map((category) => (
              <Box
                key={category.id}
                bg={activeCategory === category.id ? "dominican.blue" : "white"}
                color={activeCategory === category.id ? "white" : "gray.800"}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                textAlign="center"
                cursor="pointer"
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )
                }
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                }}
                fontFamily="heading"
              >
                <Text fontSize="3xl" mb={2}>
                  {category.icon}
                </Text>
                <Text fontWeight="bold">{category.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Places Section */}
      <Box py={12}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="xl"
            mb={2}
            fontFamily="heading"
            color="gray.800"
          >
            Lugares destacados
          </Heading>
          <Text fontSize="lg" mb={8} color="gray.600" fontFamily="body">
            {activeCategory
              ? `Mostrando lugares en la categoría ${
                  categories.find((c) => c.id === activeCategory)?.name
                }`
              : "Descubre los mejores lugares en República Dominicana"}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {filteredBusinesses.map((business) => (
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
      <Box py={16} bg="gray.50">
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            bg="dominican.blue"
            color="white"
            borderRadius="xl"
            p={{ base: 8, md: 12 }}
            boxShadow="xl"
            overflow="hidden"
            position="relative"
          >
            <Box
              maxW={{ base: "100%", md: "50%" }}
              mb={{ base: 8, md: 0 }}
              position="relative"
              zIndex={2}
            >
              <Heading
                as="h2"
                size="xl"
                mb={4}
                fontFamily="heading"
                fontWeight="bold"
              >
                Lleva VecinoApp contigo a donde vayas
              </Heading>
              <Text fontSize="lg" mb={6} fontFamily="body" fontWeight="medium">
                Descubre lugares, lee reseñas y comparte tus experiencias desde
                tu dispositivo móvil. Nunca te pierdas los mejores lugares de
                República Dominicana.
              </Text>
              <Flex gap={4} flexWrap="wrap">
                <Button
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800", transform: "translateY(-2px)" }}
                  transition="all 0.2s ease-in-out"
                  size="lg"
                  fontFamily="heading"
                  fontWeight="medium"
                  px={6}
                  leftIcon={<Text fontSize="xl">🍎</Text>}
                >
                  App Store
                </Button>
                <Button
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800", transform: "translateY(-2px)" }}
                  transition="all 0.2s ease-in-out"
                  size="lg"
                  fontFamily="heading"
                  fontWeight="medium"
                  px={6}
                  leftIcon={<Text fontSize="xl">🤖</Text>}
                >
                  Google Play
                </Button>
              </Flex>
            </Box>

            <Box
              position="relative"
              zIndex={2}
              transform={{ base: "none", md: "rotate(-5deg)" }}
              transition="transform 0.3s ease"
              _hover={{ transform: "rotate(0deg)" }}
            >
              {/* Mockup de la aplicación móvil */}
              <Box
                width="280px"
                height="550px"
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                border="10px solid black"
                boxShadow="2xl"
                position="relative"
              >
                {/* Barra de estado */}
                <Box bg="dominican.blue" p={2} color="white">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs">9:41</Text>
                    <Flex>
                      <Text fontSize="xs" mr={2}>
                        4G
                      </Text>
                      <Text fontSize="xs">100%</Text>
                    </Flex>
                  </Flex>
                </Box>

                {/* Contenido de la app */}
                <Box p={3}>
                  {/* Navbar de la app */}
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading
                      size="sm"
                      fontFamily="heading"
                      color="dominican.blue"
                    >
                      Vecino
                      <Text as="span" color="dominican.red">
                        App
                      </Text>
                    </Heading>
                    <Text fontSize="lg">👤</Text>
                  </Flex>

                  {/* Búsqueda */}
                  <Box
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                    mb={4}
                    display="flex"
                    alignItems="center"
                  >
                    <Text mr={2}>🔍</Text>
                    <Text color="gray.500" fontSize="sm">
                      Buscar lugares...
                    </Text>
                  </Box>

                  {/* Categorías */}
                  <Text fontWeight="bold" mb={2} color="gray.700">
                    Categorías
                  </Text>
                  <Flex overflowX="auto" gap={2} mb={4} pb={2}>
                    {categories.slice(0, 4).map((category) => (
                      <Flex
                        key={category.id}
                        direction="column"
                        align="center"
                        bg="dominican.blue"
                        color="white"
                        p={2}
                        borderRadius="md"
                        minW="60px"
                      >
                        <Text>{category.icon}</Text>
                        <Text fontSize="xs">{category.name}</Text>
                      </Flex>
                    ))}
                  </Flex>

                  {/* Lugares destacados */}
                  <Text fontWeight="bold" mb={2} color="gray.700">
                    Destacados
                  </Text>
                  <VStack spacing={3} align="stretch">
                    {featuredBusinesses.slice(0, 3).map((business) => (
                      <Flex
                        key={business.id}
                        bg="white"
                        p={2}
                        borderRadius="md"
                        boxShadow="sm"
                        gap={3}
                      >
                        <Box
                          bg="gray.200"
                          borderRadius="md"
                          width="60px"
                          height="60px"
                          flexShrink={0}
                        />
                        <Box>
                          <Text fontWeight="bold" fontSize="sm">
                            {business.name}
                          </Text>
                          <Flex align="center">
                            <Text color="dominican.sun" fontSize="xs" mr={1}>
                              ★★★★☆
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              ({business.reviewCount})
                            </Text>
                          </Flex>
                          <Text fontSize="xs" color="dominican.red">
                            {business.category}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </Box>

            {/* Elementos decorativos de fondo */}
            <Box
              position="absolute"
              right="-50px"
              top="-50px"
              width="200px"
              height="200px"
              borderRadius="full"
              bg="dominican.red"
              opacity={0.3}
              zIndex={1}
            />
            <Box
              position="absolute"
              left="-30px"
              bottom="-30px"
              width="150px"
              height="150px"
              borderRadius="full"
              bg="dominican.turquoise"
              opacity={0.3}
              zIndex={1}
            />
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
