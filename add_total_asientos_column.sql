-- Script para agregar la columna total_asientos a la tabla reservas
-- Ejecuta este SQL en tu panel de Supabase

-- Agregar la columna total_asientos
ALTER TABLE reservas 
ADD COLUMN total_asientos INTEGER;

-- Opcional: Actualizar registros existentes para calcular total_asientos basado en asientos_seleccionados
UPDATE reservas 
SET total_asientos = CASE 
    WHEN asientos_seleccionados IS NOT NULL 
    THEN jsonb_array_length(asientos_seleccionados::jsonb)
    ELSE 1
END
WHERE total_asientos IS NULL;

-- Opcional: Hacer la columna NOT NULL si quieres que sea obligatoria
-- ALTER TABLE reservas ALTER COLUMN total_asientos SET NOT NULL;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;
