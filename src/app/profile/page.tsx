"use client";

import { useState, useEffect, useRef } from "react";
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
  Flex,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  updateUserProfile,
  getUserProfile,
  createUserProfile,
} from "@/lib/supabase/client";
import { getFavorites } from "@/lib/supabase/client";
import { Favorite } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/supabase/storage";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  location?: string;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Formulario
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        setError(null);
        console.log("Fetching profile for user:", user.id);

        // Intentar obtener el perfil del usuario
        const { data, error } = await getUserProfile(user.id);

        if (error) {
          console.error("Error fetching profile:", error);
          setDebugInfo({
            type: "fetch_error",
            error,
            userId: user.id,
            userEmail: user.email,
          });
          throw error;
        }

        if (data) {
          console.log("Profile data received:", data);
          setProfile(data);
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
        } else {
          // Si no hay datos pero tampoco hay error, es un caso extraño
          console.log("No profile data found but no error");
          setDebugInfo({
            type: "no_profile_no_error",
            userId: user.id,
            userEmail: user.email,
          });

          // Intentar crear un perfil manualmente
          console.log("Attempting to create profile manually");
          const { data: newProfile, error: createError } =
            await createUserProfile(user.id, user.email || "");

          if (createError) {
            console.error("Error creating profile manually:", createError);
            setDebugInfo({
              type: "manual_create_error",
              error: createError,
              userId: user.id,
              userEmail: user.email,
            });
            throw createError;
          }

          if (newProfile) {
            console.log("Profile created manually:", newProfile);
            setProfile(newProfile);
            setFullName(newProfile.full_name || "");
            setAvatarUrl(newProfile.avatar_url || "");
            setBio(newProfile.bio || "");
            setLocation(newProfile.location || "");
          } else {
            throw new Error("No se pudo crear el perfil manualmente");
          }
        }
      } catch (error: any) {
        console.error("Error al cargar el perfil:", error);
        setError(
          `No se pudo cargar la información del perfil: ${
            error.message || "Error desconocido"
          }`
        );
        setDebugInfo({
          type: "catch_error",
          error,
          userId: user?.id,
          userEmail: user?.email,
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
    setError(null);

    try {
      const { error } = await updateUserProfile(user.id, {
        full_name: fullName,
        avatar_url: avatarUrl,
        bio,
        location,
      });

      if (error) throw error;

      // Actualizar el perfil en el estado
      setProfile({
        ...profile!,
        full_name: fullName,
        avatar_url: avatarUrl,
        bio,
        location,
      });

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error);
      setError(
        `No se pudo actualizar el perfil: ${
          error.message || "Error desconocido"
        }`
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      // Usar la función uploadAvatar del archivo storage.ts
      const { data, error } = await uploadAvatar(user.id, file);

      if (error) throw error;

      if (data?.path) {
        const newAvatarUrl = data.path;
        setAvatarUrl(newAvatarUrl);

        // Actualizar el perfil con la nueva URL del avatar
        await updateUserProfile(user.id, {
          avatar_url: newAvatarUrl,
        });

        toast({
          title: "Avatar actualizado",
          description: "Tu foto de perfil ha sido actualizada correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error("Error al subir el avatar:", error);
      setError(
        `No se pudo subir la imagen: ${error.message || "Error desconocido"}`
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const cancelEditing = () => {
    // Restaurar los valores originales
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            Cargando perfil...
          </Heading>
          <Skeleton height="100px" />
          <Skeleton height="200px" />
          <Skeleton height="300px" />
        </VStack>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.md" py={8}>
        <Box textAlign="center">
          <Heading size="lg" mb={4}>
            Acceso no autorizado
          </Heading>
          <Text mb={4}>Debes iniciar sesión para acceder a esta página.</Text>
          <Button as={Link} href="/auth/login" colorScheme="blue">
            Iniciar sesión
          </Button>
        </Box>
      </Container>
    );
  }

  // Si hay un error pero no hay perfil, mostrar un mensaje de error con opción de reintentar
  if (error && !profile) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert
          status="error"
          mb={6}
          borderRadius="md"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={4}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Error al cargar el perfil
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error}</AlertDescription>
          <Button
            mt={4}
            colorScheme="red"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Alert>

        {debugInfo && (
          <Box mt={8} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb={2}>
              Información de depuración:
            </Heading>
            <Code
              p={2}
              borderRadius="md"
              bg="gray.100"
              display="block"
              whiteSpace="pre-wrap"
            >
              {JSON.stringify(debugInfo, null, 2)}
            </Code>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Heading size="sm" mb={2}>
            Información de depuración:
          </Heading>
          <Code
            p={2}
            borderRadius="md"
            bg="gray.100"
            display="block"
            whiteSpace="pre-wrap"
          >
            {JSON.stringify(debugInfo, null, 2)}
          </Code>
        </Box>
      )}

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        boxShadow="md"
        mb={8}
      >
        <Box bg="dominican.blue" h="100px" position="relative" />

        <Box px={6} pb={6}>
          <Flex justify="space-between" align="flex-end" mt="-50px">
            <Box position="relative">
              <Avatar
                size="xl"
                name={fullName || "Usuario"}
                src={avatarUrl}
                border="4px solid white"
                bg="dominican.red"
              />
              {isEditing && (
                <IconButton
                  aria-label="Cambiar avatar"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                  position="absolute"
                  bottom="0"
                  right="0"
                  onClick={triggerFileInput}
                  isLoading={uploadingAvatar}
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </Box>

            <Flex mt={4}>
              {isEditing ? (
                <>
                  <IconButton
                    aria-label="Guardar cambios"
                    icon={<CheckIcon />}
                    colorScheme="green"
                    mr={2}
                    onClick={handleUpdateProfile}
                    isLoading={updating}
                  />
                  <IconButton
                    aria-label="Cancelar edición"
                    icon={<CloseIcon />}
                    colorScheme="red"
                    onClick={cancelEditing}
                  />
                </>
              ) : (
                <>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    mr={2}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar perfil
                  </Button>
                  <Button colorScheme="red" onClick={onOpen}>
                    Cerrar sesión
                  </Button>
                </>
              )}
            </Flex>
          </Flex>

          <Box mt={6}>
            {isEditing ? (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Biografía</FormLabel>
                  <Input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Cuéntanos sobre ti"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ubicación</FormLabel>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tu ubicación"
                  />
                </FormControl>
              </VStack>
            ) : (
              <Box>
                <Heading as="h1" size="xl" mb={2}>
                  {fullName || "Sin nombre"}
                </Heading>

                {bio && <Text mb={4}>{bio}</Text>}

                {location && (
                  <Flex align="center" mb={4}>
                    <Badge colorScheme="blue" mr={2}>
                      Ubicación
                    </Badge>
                    <Text>{location}</Text>
                  </Flex>
                )}

                <Flex align="center">
                  <Badge colorScheme="green" mr={2}>
                    Email
                  </Badge>
                  <Text>{user.email}</Text>
                </Flex>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Tabs colorScheme="blue" variant="enclosed" borderColor="gray.200">
        <TabList>
          <Tab>Favoritos</Tab>
          <Tab>Reseñas</Tab>
          <Tab>Actividad reciente</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Contenido de favoritos */}
            {loadingFavorites ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="200px" borderRadius="lg" />
                ))}
              </SimpleGrid>
            ) : favorites.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {favorites.map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/business/${favorite.place_id}`}
                    passHref
                  >
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md",
                      }}
                      transition="all 0.3s"
                      cursor="pointer"
                    >
                      <Box height="150px" overflow="hidden">
                        <Box
                          as="img"
                          src={favorite.place_image || "/placeholder-image.jpg"}
                          alt={favorite.place_name}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      </Box>
                      <Box p={4}>
                        <Heading as="h3" size="md" mb={2}>
                          {favorite.place_name}
                        </Heading>
                        <Text fontSize="sm" color="gray.500">
                          Añadido el{" "}
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                ))}
              </SimpleGrid>
            ) : (
              <Box
                textAlign="center"
                py={10}
                borderWidth="1px"
                borderRadius="lg"
                borderStyle="dashed"
              >
                <Text mb={4}>Aún no tienes lugares favoritos</Text>
                <Button as={Link} href="/search" colorScheme="blue">
                  Explorar lugares
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            {/* Contenido de reseñas */}
            <Box
              textAlign="center"
              py={10}
              borderWidth="1px"
              borderRadius="lg"
              borderStyle="dashed"
            >
              <Text mb={4}>Próximamente: Historial de reseñas</Text>
              <Button as={Link} href="/search" colorScheme="blue">
                Explorar lugares para reseñar
              </Button>
            </Box>
          </TabPanel>

          <TabPanel>
            {/* Contenido de actividad reciente */}
            <Box
              textAlign="center"
              py={10}
              borderWidth="1px"
              borderRadius="lg"
              borderStyle="dashed"
            >
              <Text mb={4}>Próximamente: Actividad reciente</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal de confirmación para cerrar sesión */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cerrar sesión</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Estás seguro de que deseas cerrar sesión?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
