# 🎬 CineProyect - Integración con Stripe

## 📋 Configuración de Stripe para Pagos

### 1. Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com) y crea una cuenta
2. Una vez registrado, ve al [Dashboard de Stripe](https://dashboard.stripe.com)

### 2. Obtener las claves API

1. En el dashboard, ve a **Developers > API keys**
2. Copia las siguientes claves:
   - **Publishable key** (pk_test_...) - Para el frontend
   - **Secret key** (sk_test_...) - Para el backend

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Supabase Configuration (ya tienes estas)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Webhook (Opcional pero recomendado)

1. En Stripe Dashboard, ve a **Developers > Webhooks**
2. Haz clic en "Add endpoint"
3. URL del endpoint: `https://tu-dominio.com/api/stripe-webhook`
4. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copia el **Webhook signing secret** y agrégalo a tu `.env.local`

### 5. Ejecutar script de base de datos

Ejecuta el script SQL en Supabase para crear las tablas necesarias:

```sql
-- Ejecutar: database/stripe_integration_tables.sql
```

### 6. Instalar dependencias

```bash
npm install @stripe/stripe-js stripe
```

## 🚀 Funcionalidades Implementadas

### ✅ Procesamiento de Pagos
- Integración completa con Stripe Checkout
- Soporte para tarjetas de crédito/débito
- Pagos en euros (EUR)
- Confirmación automática de reservas

### ✅ Gestión de Reservas
- Reservas vinculadas a usuarios autenticados
- Estados de pago (pendiente, pagado, fallido, cancelado)
- Historial completo de transacciones

### ✅ Seguridad
- Row Level Security (RLS) en Supabase
- Webhooks para sincronización segura
- Validación de pagos del lado del servidor

### ✅ Experiencia de Usuario
- Interfaz intuitiva para selección de asientos
- Páginas de confirmación y error
- Gestión de reservas del usuario

## 📊 Estructura de Base de Datos

### Nuevas Tablas

1. **pagos**
   - Información detallada de cada transacción
   - Vinculada a Stripe Payment Intents
   - Estados de pago tracking

2. **metodos_pago**
   - Métodos de pago guardados (opcional)
   - Información segura de tarjetas

3. **reservas** (actualizada)
   - Columnas adicionales para Stripe
   - Estados de pago integrados

## 🔧 Flujo de Pago

1. **Selección de asientos**: Usuario elige película, función y asientos
2. **Inicio de pago**: Se crea una sesión de Stripe Checkout
3. **Procesamiento**: Usuario ingresa datos de tarjeta en Stripe
4. **Confirmación**: Webhook confirma el pago exitoso
5. **Finalización**: Reserva se marca como confirmada

## 🧪 Testing

### Tarjetas de prueba de Stripe:

- **Exitosa**: 4242 4242 4242 4242
- **Fallida**: 4000 0000 0000 0002
- **Requiere autenticación**: 4000 0025 0000 3155

Usa cualquier fecha futura para expiración y cualquier CVC.

## 🛠️ Comandos útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar configuración de Stripe
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Ver logs de Stripe
stripe logs tail
```

## 📱 Páginas Creadas

- `/reserva-exitosa` - Confirmación de pago exitoso
- `/reserva-cancelada` - Página cuando se cancela el pago
- `/mis-reservas` - Historial de reservas del usuario

## 🔐 Seguridad

- Las claves secretas nunca se exponen al frontend
- Los webhooks validan la firma de Stripe
- RLS protege los datos por usuario
- Payment Intents previenen manipulación de precios

## 📞 Soporte

Si tienes problemas:
1. Verifica las variables de entorno
2. Revisa los logs del navegador y servidor
3. Confirma que las tablas de Supabase estén creadas
4. Verifica que Stripe esté en modo test

¡Tu sistema de pagos con Stripe está listo! 🎉
