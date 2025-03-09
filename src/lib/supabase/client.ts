import { createClient } from "@supabase/supabase-js";

// Estas variables de entorno deben configurarse en un archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de Supabase
export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdateData {
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
  try {
    console.log("Signing up user with email:", email);

    // Registrar al usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error);
      return { data, error };
    }

    if (data.user) {
      console.log("User signed up successfully, creating profile");

      // Crear perfil de usuario en la tabla profiles
      const { error: profileError } = await createUserProfile(
        data.user.id,
        email
      );

      if (profileError) {
        console.error("Error creating profile during signup:", profileError);
        // No devolvemos este error para no interrumpir el flujo de registro
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Exception in signUp:", error);
    return { data: { user: null, session: null }, error };
  }
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
export const createUserProfile = async (userId: string, email: string = "") => {
  try {
    console.log("Creating profile for user:", userId, "with email:", email);

    // Generar un nombre predeterminado basado en el email o el ID del usuario
    const defaultName = email
      ? email.split("@")[0]
      : `Usuario_${userId.substring(0, 6)}`;

    // Insertar el nuevo perfil - asegurándose de que full_name siempre tenga un valor
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: defaultName, // Siempre proporcionamos un valor para full_name
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }

    console.log("Profile created successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Exception in createUserProfile:", error);
    return { data: null, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    console.log("Getting profile for user:", userId);

    // Intentar obtener el perfil existente
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    // Si no hay datos pero tampoco hay error, significa que no existe el perfil
    if (!data && !error) {
      console.log("No profile found, will create one");

      // Obtener información del usuario
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email || "";

      // Intentar crear un nuevo perfil
      const createResult = await createUserProfile(userId, email);

      if (createResult.error) {
        console.error("Error creating profile:", createResult.error);
        return createResult;
      }

      data = createResult.data;
      console.log("New profile created and returned:", data);
    } else if (error) {
      console.error("Error fetching profile:", error);

      // Si el error es específicamente que no se encontró el perfil
      if (error.code === "PGRST116") {
        console.log("PGRST116 error, will create profile");

        // Obtener información del usuario
        const { data: authData } = await supabase.auth.getUser();
        const email = authData?.user?.email || "";

        // Intentar crear un nuevo perfil
        const createResult = await createUserProfile(userId, email);

        if (createResult.error) {
          console.error(
            "Error creating profile after PGRST116:",
            createResult.error
          );
          return createResult;
        }

        data = createResult.data;
        error = null;
        console.log("New profile created after PGRST116:", data);
      }
    }

    return { data, error };
  } catch (error) {
    console.error("Exception in getUserProfile:", error);
    return { data: null, error };
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: ProfileUpdateData
) => {
  try {
    // Asegurarse de que full_name nunca sea null o vacío
    if (profileData.full_name === null || profileData.full_name === "") {
      return {
        data: null,
        error: new Error("El nombre completo no puede estar vacío"),
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating profile:", error);
    }

    return { data, error };
  } catch (error) {
    console.error("Exception in updateUserProfile:", error);
    return { data: null, error };
  }
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
