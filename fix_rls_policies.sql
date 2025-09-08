-- Script para arreglar las políticas de Row Level Security (RLS) para la tabla pagos
-- Ejecuta este SQL en tu panel de Supabase

-- 1. Ver las políticas actuales de la tabla pagos
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'pagos';

-- 2. Eliminar todas las políticas existentes de pagos (si las hay)
DROP POLICY IF EXISTS "Users can insert their own payments" ON pagos;
DROP POLICY IF EXISTS "Users can view their own payments" ON pagos;
DROP POLICY IF EXISTS "Users can update their own payments" ON pagos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pagos;
DROP POLICY IF EXISTS "Enable read access for all users" ON pagos;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON pagos;

-- 3. Crear nuevas políticas más permisivas para pagos
-- Política para INSERT: permitir a usuarios autenticados insertar pagos
CREATE POLICY "Enable insert payments for authenticated users" ON pagos
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Política para SELECT: permitir a usuarios ver sus propios pagos
CREATE POLICY "Enable select payments for users" ON pagos
    FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM reservas 
            WHERE reservas.id = pagos.reserva_id 
            AND reservas.user_id = auth.uid()
        )
    );

-- Política para UPDATE: permitir actualizar pagos relacionados con sus reservas
CREATE POLICY "Enable update payments for users" ON pagos
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM reservas 
            WHERE reservas.id = pagos.reserva_id 
            AND reservas.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM reservas 
            WHERE reservas.id = pagos.reserva_id 
            AND reservas.user_id = auth.uid()
        )
    );

-- 4. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'pagos';

-- 5. También verificar las políticas de la tabla reservas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reservas';
