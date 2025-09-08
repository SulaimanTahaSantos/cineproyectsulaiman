// API Route de debug para verificar pagos
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('🔍 DEBUG: Iniciando verificación de pago...');
    
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

        const { session_id } = body;

        if (!session_id) {
            console.error('❌ No se recibió session_id');
            return NextResponse.json(
                { error: 'session_id requerido' },
                { status: 400 }
            );
        }

        console.log('🔍 Obteniendo sesión de Stripe:', session_id);

        // Obtener la sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        console.log('✅ Sesión obtenida:', {
            id: session.id,
            payment_status: session.payment_status,
            payment_intent: session.payment_intent,
            customer_email: session.customer_details?.email,
            amount_total: session.amount_total,
            currency: session.currency,
        });

        // Respuesta simplificada para debug
        return NextResponse.json({
            success: session.payment_status === 'paid',
            payment_status: session.payment_status,
            session_id: session.id,
            total_pagado: session.amount_total ? session.amount_total / 100 : 0,
            customer_email: session.customer_details?.email,
            debug: true,
        });

    } catch (error) {
        console.error('❌ Error detallado en verificación:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error type:', error.type);
        
        return NextResponse.json(
            { 
                error: 'Error al verificar el pago', 
                details: error.message,
                type: error.type || 'unknown',
                debug: true,
            },
            { status: 500 }
        );
    }
}
