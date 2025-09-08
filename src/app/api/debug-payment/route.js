// API Route simplificada para debug de Stripe
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('🔍 DEBUG: Iniciando creación de sesión de pago...');
    
    try {
        // Verificar variables de entorno
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ STRIPE_SECRET_KEY no está configurada');
            return NextResponse.json(
                { error: 'Configuración de Stripe incompleta' },
                { status: 500 }
            );
        }

        console.log('✅ STRIPE_SECRET_KEY está configurada');

        // Inicializar Stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });

        console.log('✅ Stripe inicializado correctamente');

        // Parsear el cuerpo de la petición
        const body = await request.json();
        console.log('📦 Body recibido:', JSON.stringify(body, null, 2));

        const { reserva } = body;

        if (!reserva) {
            console.error('❌ No se recibieron datos de reserva');
            return NextResponse.json(
                { error: 'Datos de reserva requeridos' },
                { status: 400 }
            );
        }

        // Crear sesión de prueba simplificada
        console.log('🔄 Creando sesión de Stripe...');
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            currency: 'eur',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reserva-exitosa?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reserva-cancelada`,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Entrada de Cine - Prueba',
                            description: 'Reserva de asiento(s) para función de cine',
                        },
                        unit_amount: Math.round((reserva.precio_total || 10) * 100), // Convertir a centavos
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                funcion_id: reserva.funcion_id?.toString() || 'test',
                user_id: reserva.user_id || 'test',
                tipo: 'reserva_cine_debug',
            },
        });

        console.log('✅ Sesión creada exitosamente:', session.id);

        return NextResponse.json({
            id: session.id,
            url: session.url,
            payment_intent: session.payment_intent,
        });

    } catch (error) {
        console.error('❌ Error detallado:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error message:', error.message);
        
        return NextResponse.json(
            { 
                error: 'Error al crear la sesión de pago', 
                details: error.message,
                type: error.type || 'unknown'
            },
            { status: 500 }
        );
    }
}
