-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id TEXT NOT NULL,
    place_name TEXT NOT NULL,
    place_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Restricción única para evitar duplicados
    UNIQUE(user_id, place_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);

CREATE INDEX IF NOT EXISTS favorites_place_id_idx ON favorites(place_id);

-- Configurar RLS (Row Level Security)
ALTER TABLE
    favorites ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver solo sus propios favoritos
CREATE POLICY "Users can view their own favorites" ON favorites FOR
SELECT
    USING (auth.uid() = user_id);

-- Política para permitir a los usuarios insertar sus propios favoritos
CREATE POLICY "Users can insert their own favorites" ON favorites FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política para permitir a los usuarios eliminar sus propios favoritos
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);