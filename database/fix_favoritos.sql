-- Script para corregir la tabla favoritos con autenticación
-- Ejecutar en Supabase SQL Editor

-- Primero, eliminar la tabla favoritos si existe (para recrearla correctamente)
DROP TABLE IF EXISTS favoritos CASCADE;

-- Recrear la tabla favoritos con la estructura correcta
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    tmdb_movie_id INTEGER NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tmdb_movie_id, user_id)
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX idx_favoritos_user_id ON favoritos(user_id);
CREATE INDEX idx_favoritos_tmdb_movie_id ON favoritos(tmdb_movie_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para favoritos
CREATE POLICY "Los usuarios pueden ver sus propios favoritos" 
ON favoritos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios favoritos" 
ON favoritos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios favoritos" 
ON favoritos FOR DELETE 
USING (auth.uid() = user_id);
