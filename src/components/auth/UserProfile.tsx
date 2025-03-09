"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  updateUserProfile,
  UserProfile as UserProfileType,
} from "@/lib/supabase/client";

interface UserProfileError {
  message: string;
}

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toast = useToast();

  if (!user || !profile) {
    return (
      <Box textAlign="center" p={8}>
        <Text>Debes iniciar sesión para ver tu perfil</Text>
        <Button as="a" href="/auth/login" colorScheme="blue" mt={4}>
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "El nombre es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<UserProfileType> = {
        full_name: fullName,
        bio,
        location,
      };

      const { error } = await updateUserProfile(user.id, updates);

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsEditing(false);
    } catch (err: unknown) {
      const profileError = err as UserProfileError;
      toast({
        title: "Error al actualizar el perfil",
        description:
          profileError.message ||
          "Ha ocurrido un error. Por favor, intenta de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="container.md"
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex direction={{ base: "column", md: "row" }} align="center" mb={6}>
        <Avatar
          size="xl"
          name={profile.full_name}
          src={profile.avatar_url || undefined}
          mr={{ base: 0, md: 6 }}
          mb={{ base: 4, md: 0 }}
        />

        <Box flex="1">
          <Heading as="h2" size="lg">
            {profile.full_name}
          </Heading>
          <Text color="gray.500">{user.email}</Text>
          <Text mt={2}>
            Miembro desde{" "}
            {profile.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "fecha desconocida"}
          </Text>
        </Box>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          colorScheme="blue"
          variant="outline"
          mr={2}
        >
          {isEditing ? "Cancelar" : "Editar perfil"}
        </Button>

        <Button onClick={signOut} colorScheme="red" variant="outline">
          Cerrar sesión
        </Button>
      </Flex>

      {isEditing ? (
        <Box as="form" onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.fullName} mb={4}>
            <FormLabel>Nombre completo</FormLabel>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
            />
            {errors.fullName && (
              <FormErrorMessage>{errors.fullName}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Biografía</FormLabel>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              resize="vertical"
              rows={4}
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Ubicación</FormLabel>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Tu ciudad o región"
            />
          </FormControl>

          <Flex justify="flex-end">
            <Button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFullName(profile.full_name || "");
                setBio(profile.bio || "");
                setLocation(profile.location || "");
              }}
              mr={2}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="Guardando..."
            >
              Guardar cambios
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box>
          {bio && (
            <Box mb={4}>
              <Heading as="h3" size="md" mb={2}>
                Biografía
              </Heading>
              <Text>{bio}</Text>
            </Box>
          )}

          {location && (
            <Box mb={4}>
              <Heading as="h3" size="md" mb={2}>
                Ubicación
              </Heading>
              <Text>{location}</Text>
            </Box>
          )}

          {!bio && !location && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                No hay información adicional en tu perfil
              </Text>
              <Button
                onClick={() => setIsEditing(true)}
                colorScheme="blue"
                mt={4}
              >
                Completar perfil
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
