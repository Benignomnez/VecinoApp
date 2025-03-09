"use client";

import { Box, Flex, Text, Button, VStack, Container } from "@chakra-ui/react";
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

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Buscar", href: "/search" },
    { label: "Categorías", href: "/categories" },
  ];

  const onToggle = () => setOpen(!open);

  return (
    <Box as="nav" bg="dominican.blue" color="white" boxShadow="md">
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Link href="/" passHref>
              <Text fontWeight="bold" fontSize="xl" cursor="pointer">
                VecinoApp
              </Text>
            </Link>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }}>
            <Flex gap="4" alignItems="center">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Text
                    px={2}
                    py={1}
                    rounded="md"
                    fontWeight={isActive(item.href) ? "bold" : "normal"}
                    bg={isActive(item.href) ? "dominican.red" : "transparent"}
                    _hover={{
                      bg: "dominican.red",
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
                      px={2}
                      py={1}
                      rounded="md"
                      fontWeight={isActive("/favorites") ? "bold" : "normal"}
                      bg={
                        isActive("/favorites") ? "dominican.red" : "transparent"
                      }
                      _hover={{
                        bg: "dominican.red",
                      }}
                      cursor="pointer"
                    >
                      ❤️ Favoritos
                    </Text>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      mr={2}
                    >
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    size="sm"
                    onClick={signOut}
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
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <Button variant="solid" colorScheme="red" size="sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </Flex>
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
            <VStack align="stretch" gap="4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Text
                    px={2}
                    py={1}
                    rounded="md"
                    fontWeight={isActive(item.href) ? "bold" : "normal"}
                    bg={isActive(item.href) ? "dominican.red" : "transparent"}
                    _hover={{
                      bg: "dominican.red",
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
                      px={2}
                      py={1}
                      rounded="md"
                      fontWeight={isActive("/favorites") ? "bold" : "normal"}
                      bg={
                        isActive("/favorites") ? "dominican.red" : "transparent"
                      }
                      _hover={{
                        bg: "dominican.red",
                      }}
                      cursor="pointer"
                    >
                      ❤️ Favoritos
                    </Text>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="sm"
                      w="full"
                      mb={2}
                    >
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    size="sm"
                    w="full"
                    onClick={signOut}
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
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/register" passHref>
                    <Button
                      variant="solid"
                      colorScheme="red"
                      size="sm"
                      w="full"
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
