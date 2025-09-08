# 🎬 Integración de Supabase con Autenticación - Instrucciones de Configuración

## 📋 **PASO 1: Configurar las Tablas en Supabase**

1. **Ve a tu proyecto de Supabase**: https://app.supabase.com/projects/eighyihhawsvhwksfaqv
2. **Accede al SQL Editor**: En el menú lateral, haz clic en "SQL Editor"
3. **Ejecuta el siguiente script** (copia y pega todo el contenido del archivo `database/schema.sql`):

```sql
-- Script SQL para crear las tablas del sistema de cine con autenticación
-- Ejecutar en Supabase SQL Editor

-- Tabla de salas de cine
CREATE TABLE IF NOT EXISTS salas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    capacidad INTEGER NOT NULL,
    tipo VARCHAR(20) DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de funciones de películas
CREATE TABLE IF NOT EXISTS funciones (
    id SERIAL PRIMARY KEY,
    tmdb_movie_id INTEGER NOT NULL, -- ID de la película en TMDB
    sala_id INTEGER REFERENCES salas(id),
    fecha DATE NOT NULL,
    horario TIME NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    asientos_ocupados INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(20),
    funcion_id INTEGER REFERENCES funciones(id),
    asientos_seleccionados JSONB NOT NULL, -- Array de asientos seleccionados
    precio_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de películas favoritas (con autenticación)
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    tmdb_movie_id INTEGER NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tmdb_movie_id, user_id)
);

-- Insertar salas de ejemplo
INSERT INTO salas (nombre, capacidad, tipo) VALUES
('Sala 1', 100, 'Standard'),
('Sala 2', 80, 'VIP'),
('Sala 3', 120, 'IMAX'),
('Sala 4', 60, 'Premium')
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_funciones_fecha ON funciones(fecha);
CREATE INDEX IF NOT EXISTS idx_funciones_tmdb_id ON funciones(tmdb_movie_id);
CREATE INDEX IF NOT EXISTS idx_reservas_funcion_id ON reservas(funcion_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id ON favoritos(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE funciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para permitir lectura pública
CREATE POLICY "Permitir lectura pública de salas" ON salas FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de funciones" ON funciones FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de reservas" ON reservas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura de reservas por email" ON reservas FOR SELECT USING (true);

-- Políticas de seguridad para favoritos (requiere autenticación)
CREATE POLICY "Los usuarios pueden ver sus propios favoritos" ON favoritos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden insertar sus propios favoritos" ON favoritos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden eliminar sus propios favoritos" ON favoritos FOR DELETE USING (auth.uid() = user_id);
```

## 🔐 **PASO 2: Configurar Autenticación**

1. **Ve a Authentication > Settings** en tu dashboard de Supabase
2. **Configura la URL del sitio**: `http://localhost:3000` (para desarrollo)
3. **Habilita proveedores** (si quieres):
   - Email/Password (ya habilitado por defecto)
   - Google, GitHub, etc. (opcional)

## ✅ **¿Qué Incluye el Sistema de Autenticación?**

### **🔑 Funcionalidades de Autenticación:**
- **✅ Registro de usuarios** con email y contraseña
- **✅ Inicio de sesión** con validación
- **✅ Cierre de sesión** 
- **✅ Protección de rutas** (favoritos requiere login)
- **✅ Persistencia de sesión** automática
- **✅ Validaciones de seguridad**

### **👤 Gestión de Usuario:**
- **✅ Perfil de usuario** en header
- **✅ Estado de autenticación** global
- **✅ Favoritos personales** por usuario
- **✅ Reservas asociadas** al email del usuario

### **🎬 Flujo de Usuario:**
1. **Sin autenticación**: Puede ver películas y hacer reservas
2. **Con autenticación**: Puede guardar favoritos y gestionar perfil
3. **Favoritos protegidos**: Solo usuarios autenticados pueden guardar/ver favoritos

¡Tu aplicación de cine ahora tiene un sistema completo de autenticación y base de datos! 🎬🔐✨
