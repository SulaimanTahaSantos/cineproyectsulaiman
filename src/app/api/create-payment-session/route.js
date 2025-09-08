// API Route para crear sesión de pago con Stripe
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        console.log('📨 Recibida petición para crear sesión de pago');
        
        // Inicializar Stripe solo cuando se necesite
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
        
        const body = await request.json();
        console.log('📦 Body recibido:', JSON.stringify(body, null, 2));
        
        const { reserva, success_url, cancel_url } = body;

        if (!reserva) {
            console.error('❌ No se recibieron datos de reserva');
            return NextResponse.json(
                { error: 'Datos de reserva requeridos' },
                { status: 400 }
            );
        }

        console.log('🔄 Creando sesión de Stripe para reserva:', reserva);
        console.log('🔑 STRIPE_SECRET_KEY configurada:', !!process.env.STRIPE_SECRET_KEY);

        // Crear la sesión de checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            currency: 'eur',
            success_url: success_url,
            cancel_url: cancel_url,
            customer_email: reserva.email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `🎬 Entrada de Cine - ${reserva.sala_nombre}`,
                            description: `${reserva.total_asientos} asiento(s) para la función del ${reserva.fecha} a las ${reserva.hora}`,
                            images: ['https://images.unsplash.com/photo-1489599735754-3f85ba0e26c7?w=400'], // Imagen genérica de cine
                        },
                        unit_amount: Math.round(reserva.precio_total * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                funcion_id: reserva.funcion_id ? reserva.funcion_id.toString() : 'unknown',
                user_id: reserva.user_id || 'unknown',
                asientos: JSON.stringify(reserva.asientos_seleccionados || []),
                pelicula_id: reserva.pelicula_id ? reserva.pelicula_id.toString() : 'unknown',
            },
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['ES', 'FR', 'DE', 'IT', 'PT'], // Países europeos
            },
            payment_intent_data: {
                description: `Reserva de cine - ${reserva.total_asientos} asientos`,
                metadata: {
                    tipo: 'reserva_cine',
                    funcion_id: reserva.funcion_id ? reserva.funcion_id.toString() : 'unknown',
                    user_id: reserva.user_id || 'unknown',
                },
            },
        });

        console.log('✅ Sesión de Stripe creada:', session.id);

        return NextResponse.json({
            id: session.id,
            url: session.url,
            payment_intent: session.payment_intent,
        });

    } catch (error) {
        console.error('❌ Error al crear sesión de Stripe:', error);
        return NextResponse.json(
            { error: 'Error al crear la sesión de pago', details: error.message },
            { status: 500 }
        );
    }
}
