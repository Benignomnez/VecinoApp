"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  useToast,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import { updateUserProfile, getUserProfile } from "@/lib/supabase/client";
import { getFavorites } from "@/lib/supabase/client";
import { Favorite } from "@/lib/supabase/client";
import Link from "next/link";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // Formulario
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const { data, error } = await getUserProfile(user.id);

        if (error) throw error;

        if (data) {
          setProfile(data);
          setUsername(data.username || "");
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del perfil",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const { data, error } = await getFavorites(user.id);

        if (error) throw error;

        if (data) {
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchProfile();
    fetchFavorites();
  }, [user, router, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setUpdating(true);

    try {
      const { error } = await updateUserProfile(user.id, {
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      if (error) throw error;

      setProfile({
        ...profile!,
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la información del perfil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} alignItems="center">
          <Heading>Acceso no autorizado</Heading>
          <Text>Debes iniciar sesión para ver esta página</Text>
          <Button colorScheme="blue" onClick={() => router.push("/auth/login")}>
            Iniciar Sesión
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} alignItems="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Mi Perfil
        </Heading>

        <Tabs colorScheme="blue" isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Información Personal</Tab>
            <Tab>Mis Favoritos</Tab>
          </TabList>

          <TabPanels>
            {/* Panel de Información Personal */}
            <TabPanel>
              <VStack spacing={6} alignItems="stretch">
                {loading ? (
                  <VStack spacing={4} alignItems="center">
                    <Skeleton
                      height="100px"
                      width="100px"
                      borderRadius="full"
                    />
                    <Skeleton height="20px" width="200px" />
                    <Skeleton height="20px" width="150px" />
                  </VStack>
                ) : (
                  <>
                    <HStack justifyContent="center">
                      <Avatar
                        size="xl"
                        name={fullName || username || user.email}
                        src={avatarUrl}
                      />
                    </HStack>

                    <Divider />

                    <VStack spacing={4} alignItems="stretch">
                      <FormControl>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <Input value={user.email} readOnly />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Nombre de usuario"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>URL de Avatar</FormLabel>
                        <Input
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="URL de imagen de perfil"
                        />
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        onClick={handleUpdateProfile}
                        isLoading={updating}
                        loadingText="Actualizando..."
                      >
                        Actualizar Perfil
                      </Button>
                    </VStack>

                    <Divider />

                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={signOut}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                )}
              </VStack>
            </TabPanel>

            {/* Panel de Favoritos */}
            <TabPanel>
              <VStack spacing={4} alignItems="stretch">
                <Heading as="h3" size="md">
                  Mis Lugares Favoritos
                </Heading>

                {loadingFavorites ? (
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacingX={4}
                    spacingY={4}
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} height="100px" />
                    ))}
                  </SimpleGrid>
                ) : favorites.length === 0 ? (
                  <Box textAlign="center" py={6}>
                    <Text fontSize="lg" mb={4}>
                      No tienes lugares favoritos guardados
                    </Text>
                    <Button
                      colorScheme="blue"
                      onClick={() => router.push("/search")}
                    >
                      Explorar Lugares
                    </Button>
                  </Box>
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacingX={4}
                    spacingY={4}
                  >
                    {favorites.map((favorite) => (
                      <Link
                        key={favorite.id}
                        href={`/business/${favorite.place_id}`}
                        passHref
                      >
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderRadius="lg"
                          overflow="hidden"
                          _hover={{
                            shadow: "md",
                            borderColor: "blue.300",
                            transform: "translateY(-2px)",
                            transition: "all 0.2s ease-in-out",
                          }}
                          cursor="pointer"
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            size="md"
                            src={favorite.place_image || ""}
                            name={favorite.place_name}
                            mr={4}
                          />
                          <VStack alignItems="start" spacing={1}>
                            <Text fontWeight="bold" isTruncated>
                              {favorite.place_name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Añadido el{" "}
                              {new Date(
                                favorite.created_at
                              ).toLocaleDateString()}
                            </Text>
                          </VStack>
                        </Box>
                      </Link>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
