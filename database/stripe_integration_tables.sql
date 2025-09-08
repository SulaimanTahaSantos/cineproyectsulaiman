-- Script para actualizar las tablas de Supabase para integración con Stripe
-- Ejecutar en Supabase SQL Editor

-- Actualizar tabla de reservas para incluir información de pago y usuario
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS estado_pago TEXT DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'fallido', 'cancelado')),
ADD COLUMN IF NOT EXISTS metodo_pago TEXT,
ADD COLUMN IF NOT EXISTS fecha_pago TIMESTAMP,
ADD COLUMN IF NOT EXISTS total_pagado DECIMAL(10,2);

-- Crear tabla para almacenar información de pagos detallada
CREATE TABLE IF NOT EXISTS pagos (
    id BIGSERIAL PRIMARY KEY,
    reserva_id BIGINT REFERENCES reservas(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    stripe_session_id TEXT,
    cantidad DECIMAL(10,2) NOT NULL,
    moneda TEXT DEFAULT 'eur',
    estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'procesando', 'exitoso', 'fallido', 'cancelado')),
    metodo_pago TEXT, -- 'card', 'paypal', etc.
    descripcion TEXT,
    metadata JSONB,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla para almacenar detalles de tarjetas (información mínima por seguridad)
CREATE TABLE IF NOT EXISTS metodos_pago (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    tipo TEXT NOT NULL, -- 'card'
    marca TEXT, -- 'visa', 'mastercard', etc.
    ultimos_4_digitos TEXT,
    mes_expiracion INTEGER,
    año_expiracion INTEGER,
    es_predeterminado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_pagos_reserva_id ON pagos(reserva_id);
CREATE INDEX IF NOT EXISTS idx_pagos_stripe_intent ON pagos(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_user_id ON metodos_pago(user_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado_pago ON reservas(estado_pago);
CREATE INDEX IF NOT EXISTS idx_reservas_user_id ON reservas(user_id);

-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_pagos_updated_at ON pagos;
CREATE TRIGGER update_pagos_updated_at
    BEFORE UPDATE ON pagos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_metodos_pago_updated_at ON metodos_pago;
CREATE TRIGGER update_metodos_pago_updated_at
    BEFORE UPDATE ON metodos_pago
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;

-- Política para reservas: los usuarios solo pueden ver sus propias reservas
CREATE POLICY "Usuarios pueden ver sus propias reservas" ON reservas
    FOR ALL USING (user_id = auth.uid());

-- Política para pagos: los usuarios solo pueden ver sus propios pagos
CREATE POLICY "Usuarios pueden ver sus propios pagos" ON pagos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reservas r 
            WHERE r.id = pagos.reserva_id 
            AND r.user_id = auth.uid()
        )
    );

-- Política para métodos de pago: los usuarios solo pueden ver sus propios métodos
CREATE POLICY "Usuarios pueden ver sus propios métodos de pago" ON metodos_pago
    FOR ALL USING (user_id = auth.uid());

-- Los datos de métodos de pago se crearán automáticamente cuando los usuarios agreguen tarjetas reales
-- No insertamos datos de ejemplo porque requieren usuarios reales de auth.users

-- Verificar las nuevas tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('pagos', 'metodos_pago', 'reservas')
ORDER BY table_name, ordinal_position;
