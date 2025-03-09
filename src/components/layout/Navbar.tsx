"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Container,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Colores mejorados
  const bgColor = "dominican.blue";
  const textColor = "white";
  const activeColor = "dominican.red";
  const hoverBgColor = "rgba(206, 17, 38, 0.8)"; // dominican.red con transparencia

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Buscar", href: "/search" },
    { label: "Categorías", href: "/categories" },
  ];

  const onToggle = () => setOpen(!open);

  return (
    <Box
      as="nav"
      bg={bgColor}
      color={textColor}
      boxShadow="lg"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Link href="/" passHref>
              <Heading
                as="h1"
                size="md"
                fontFamily="heading"
                fontWeight="bold"
                letterSpacing="tight"
                cursor="pointer"
              >
                Vecino
                <Text as="span" color="dominican.red">
                  App
                </Text>
              </Heading>
            </Link>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }}>
            <HStack spacing={4} alignItems="center">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Text
                    px={3}
                    py={2}
                    rounded="md"
                    fontFamily="heading"
                    fontWeight={isActive(item.href) ? "bold" : "medium"}
                    bg={isActive(item.href) ? activeColor : "transparent"}
                    _hover={{
                      bg: hoverBgColor,
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    cursor="pointer"
                    transition="all 0.2s ease-in-out"
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}

              {user ? (
                <>
                  <Link href="/favorites" passHref>
                    <Text
                      px={3}
                      py={2}
                      rounded="md"
                      fontFamily="heading"
                      fontWeight={isActive("/favorites") ? "bold" : "medium"}
                      bg={isActive("/favorites") ? activeColor : "transparent"}
                      _hover={{
                        bg: hoverBgColor,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      cursor="pointer"
                      transition="all 0.2s ease-in-out"
                    >
                      Favoritos
                    </Text>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      mr={2}
                      fontFamily="heading"
                      fontWeight="medium"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button
                    variant="solid"
                    bg="dominican.red"
                    color="white"
                    size="sm"
                    onClick={signOut}
                    fontFamily="heading"
                    fontWeight="medium"
                    _hover={{
                      bg: "dominican.red",
                      opacity: 0.9,
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s ease-in-out"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      mr={2}
                      fontFamily="heading"
                      fontWeight="medium"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <Button
                      variant="solid"
                      bg="dominican.red"
                      color="white"
                      size="sm"
                      fontFamily="heading"
                      fontWeight="medium"
                      _hover={{
                        bg: "dominican.red",
                        opacity: 0.9,
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </HStack>
          </Flex>

          <Button
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            variant="ghost"
            aria-label="Toggle Navigation"
            colorScheme="whiteAlpha"
            size="sm"
            p={2}
          >
            {open ? <CloseIcon /> : <HamburgerIcon />}
          </Button>
        </Flex>

        {/* Menú móvil */}
        {open && (
          <Box pb={4} display={{ md: "none" }}>
            <VStack align="stretch" spacing={3}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Text
                    px={3}
                    py={2}
                    rounded="md"
                    fontFamily="heading"
                    fontWeight={isActive(item.href) ? "bold" : "medium"}
                    bg={isActive(item.href) ? activeColor : "transparent"}
                    _hover={{
                      bg: hoverBgColor,
                    }}
                    cursor="pointer"
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}

              {user ? (
                <>
                  <Link href="/favorites" passHref>
                    <Text
                      px={3}
                      py={2}
                      rounded="md"
                      fontFamily="heading"
                      fontWeight={isActive("/favorites") ? "bold" : "medium"}
                      bg={isActive("/favorites") ? activeColor : "transparent"}
                      _hover={{
                        bg: hoverBgColor,
                      }}
                      cursor="pointer"
                    >
                      Favoritos
                    </Text>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      w="full"
                      mb={2}
                      fontFamily="heading"
                      fontWeight="medium"
                    >
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button
                    variant="solid"
                    bg="dominican.red"
                    color="white"
                    size="sm"
                    w="full"
                    onClick={signOut}
                    fontFamily="heading"
                    fontWeight="medium"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      w="full"
                      mb={2}
                      fontFamily="heading"
                      fontWeight="medium"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <Button
                      variant="solid"
                      bg="dominican.red"
                      color="white"
                      size="sm"
                      w="full"
                      fontFamily="heading"
                      fontWeight="medium"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
