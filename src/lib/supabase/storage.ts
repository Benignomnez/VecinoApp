import { supabase } from "./client";

/**
 * Sube un archivo de avatar al bucket de storage de Supabase
 * @param userId ID del usuario
 * @param file Archivo a subir
 * @returns Objeto con la URL del archivo subido o un error
 */
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

    return { data: { path: data.publicUrl }, error: null };
  } catch (error) {
    console.error("Error al subir el avatar:", error);
    return { data: null, error };
  }
};

/**
 * Elimina un archivo de avatar del bucket de storage de Supabase
 * @param filePath Ruta del archivo a eliminar
 * @returns Objeto con el resultado de la operación
 */
export const deleteAvatar = async (filePath: string) => {
  try {
    // Extraer el nombre del archivo de la URL
    const fileName = filePath.split("/").pop();

    if (!fileName) {
      throw new Error("Ruta de archivo inválida");
    }

    const { error } = await supabase.storage
      .from("profiles")
      .remove([`avatars/${fileName}`]);

    if (error) {
      throw error;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error("Error al eliminar el avatar:", error);
    return { data: null, error };
  }
};
