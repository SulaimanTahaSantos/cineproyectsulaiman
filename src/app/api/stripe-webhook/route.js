// Webhook para manejar eventos de Stripe
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('❌ Error verificando webhook:', err.message);
            return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
        }

        console.log('📨 Evento de Stripe recibido:', event.type);

        // Manejar diferentes tipos de eventos
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;
            
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;
            
            case 'checkout.session.expired':
                await handleCheckoutExpired(event.data.object);
                break;
            
            default:
                console.log('📝 Evento no manejado:', event.type);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('❌ Error en webhook:', error);
        return NextResponse.json(
            { error: 'Error procesando webhook' },
            { status: 500 }
        );
    }
}

async function handlePaymentSuccess(paymentIntent) {
    console.log('✅ Pago exitoso:', paymentIntent.id);

    try {
        // Actualizar el estado del pago en la base de datos
        const { error } = await supabase
            .from('pagos')
            .update({
                estado: 'exitoso',
                fecha_actualizacion: new Date().toISOString(),
                metadata: {
                    ...paymentIntent,
                    updated_by: 'stripe_webhook'
                }
            })
            .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
            console.error('❌ Error actualizando pago:', error);
        }

        // También actualizar la reserva
        const { error: reservaError } = await supabase
            .from('reservas')
            .update({
                estado_pago: 'pagado',
                estado: 'confirmada',
            })
            .eq('stripe_payment_intent_id', paymentIntent.id);

        if (reservaError) {
            console.error('❌ Error actualizando reserva:', reservaError);
        }

    } catch (error) {
        console.error('❌ Error manejando pago exitoso:', error);
    }
}

async function handlePaymentFailed(paymentIntent) {
    console.log('❌ Pago fallido:', paymentIntent.id);

    try {
        // Actualizar el estado del pago
        const { error } = await supabase
            .from('pagos')
            .update({
                estado: 'fallido',
                fecha_actualizacion: new Date().toISOString(),
                metadata: {
                    ...paymentIntent,
                    updated_by: 'stripe_webhook'
                }
            })
            .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
            console.error('❌ Error actualizando pago fallido:', error);
        }

        // Actualizar la reserva como cancelada
        const { error: reservaError } = await supabase
            .from('reservas')
            .update({
                estado_pago: 'fallido',
                estado: 'cancelada',
            })
            .eq('stripe_payment_intent_id', paymentIntent.id);

        if (reservaError) {
            console.error('❌ Error cancelando reserva:', reservaError);
        }

    } catch (error) {
        console.error('❌ Error manejando pago fallido:', error);
    }
}

async function handleCheckoutCompleted(session) {
    console.log('✅ Checkout completado:', session.id);
    
    // El checkout completado indica que el proceso fue exitoso
    // La lógica principal ya se maneja en verify-payment
}

async function handleCheckoutExpired(session) {
    console.log('⏰ Checkout expirado:', session.id);

    try {
        // Marcar la reserva como expirada
        const { error } = await supabase
            .from('reservas')
            .update({
                estado: 'expirada',
                estado_pago: 'cancelado',
            })
            .eq('stripe_session_id', session.id);

        if (error) {
            console.error('❌ Error marcando reserva como expirada:', error);
        }

    } catch (error) {
        console.error('❌ Error manejando checkout expirado:', error);
    }
}
