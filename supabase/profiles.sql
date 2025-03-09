-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    bio TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Configurar RLS (Row Level Security)
ALTER TABLE
    profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver todos los perfiles
CREATE POLICY "Cualquiera puede ver los perfiles" ON profiles FOR
SELECT
    USING (true);

-- Política para permitir a los usuarios actualizar solo su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles FOR
UPDATE
    USING (auth.uid() = id);

-- Función para crear automáticamente un perfil cuando se registra un usuario
CREATE
OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $ $ BEGIN
INSERT INTO
    public.profiles (id, email)
VALUES
    (NEW.id, NEW.email);

RETURN NEW;

END;

$ $ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un nuevo usuario
CREATE
OR REPLACE TRIGGER on_auth_user_created
AFTER
INSERT
    ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();