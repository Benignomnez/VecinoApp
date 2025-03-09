import { createClient } from "@supabase/supabase-js";

// Estas variables de entorno deben configurarse en un archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de Supabase
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdateData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  place_image?: string;
  created_at: string;
}

// Funciones de autenticación
export const signUp = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (data.user && !error) {
    // Crear perfil de usuario en la tabla profiles
    await createUserProfile(data.user.id, fullName);
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  return { data, error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Funciones para perfiles de usuario
export const createUserProfile = async (userId: string, fullName: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        full_name: fullName,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (
  userId: string,
  profileData: ProfileUpdateData
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select();

  return { data, error };
};

// Funciones para reseñas
export const createReview = async (
  userId: string,
  placeId: string,
  rating: number,
  comment: string
) => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        user_id: userId,
        place_id: placeId,
        rating,
        comment,
        created_at: now,
        updated_at: now,
      },
    ])
    .select();

  return { data, error };
};

export const getReviewsByPlace = async (placeId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `
    )
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getReviewsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  updates: Partial<Review>
) => {
  const { data, error } = await supabase
    .from("reviews")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("user_id", userId) // Asegurarse de que el usuario es el propietario de la reseña
    .select();

  return { data, error };
};

export const deleteReview = async (reviewId: string, userId: string) => {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", userId); // Asegurarse de que el usuario es el propietario de la reseña

  return { error };
};

// Funciones para favoritos
export const addFavorite = async (
  userId: string,
  placeId: string,
  placeName: string,
  placeImage?: string
) => {
  const { data, error } = await supabase
    .from("favorites")
    .insert([
      {
        user_id: userId,
        place_id: placeId,
        place_name: placeName,
        place_image: placeImage,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  return { data, error };
};

export const removeFavorite = async (userId: string, placeId: string) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("place_id", placeId);

  return { error };
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const isFavorite = async (userId: string, placeId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("place_id", placeId)
    .single();

  return { isFavorite: !!data, error };
};

// Función para subir un avatar
export const uploadAvatar = async (userId: string, file: File) => {
  try {
    // Generar un nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Subir el archivo al bucket de storage
    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Obtener la URL pública del archivo
    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

    // Actualizar el perfil del usuario con la nueva URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return { data: { path: data.publicUrl }, error: null };
  } catch (error) {
    console.error("Error al subir el avatar:", error);
    return { data: null, error };
  }
};
