// API Route para verificar el estado del pago
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

export async function POST(request) {
    try {
        const { session_id } = await request.json();

        console.log('🔄 Verificando pago para sesión:', session_id);

        if (!session_id) {
            console.error('❌ Session ID no proporcionado');
            return NextResponse.json({
                success: false,
                error: 'Session ID es requerido'
            }, { status: 400 });
        }

        // Obtener la sesión de Stripe
        console.log('🔄 Obteniendo sesión de Stripe...');
        const session = await stripe.checkout.sessions.retrieve(session_id);

        console.log('📄 Estado de la sesión:', session.payment_status);
        console.log('📄 Sesión completa:', JSON.stringify(session, null, 2));

        // Actualizar la reserva en la base de datos
        if (session.payment_status === 'paid') {
            console.log('✅ Pago confirmado, actualizando reserva...');

            // Primero, buscar si existe la reserva
            const { data: reservaExistente, error: errorBusqueda } = await supabase
                .from('reservas')
                .select('*')
                .eq('stripe_session_id', session_id)
                .single();

            console.log('🔍 Reserva existente:', reservaExistente);
            console.log('🔍 Error de búsqueda:', errorBusqueda);

            if (errorBusqueda) {
                console.error('❌ No se encontró reserva con session_id:', session_id);
                return NextResponse.json({
                    success: false,
                    error: 'Reserva no encontrada',
                    session_id: session_id
                }, { status: 404 });
            }

            // Actualizar estado de reserva
            const { data: reserva, error: reservaError } = await supabase
                .from('reservas')
                .update({
                    estado: 'confirmada',
                    estado_pago: 'pagado',
                    fecha_pago: new Date().toISOString(),
                    total_pagado: session.amount_total / 100, // Convertir de centavos
                    metodo_pago: 'stripe_card',
                })
                .eq('stripe_session_id', session_id)
                .select()
                .single();

            if (reservaError) {
                console.error('❌ Error al actualizar reserva:', reservaError);
                throw reservaError;
            }

            // Actualizar estado del pago
            const { error: pagoError } = await supabase
                .from('pagos')
                .update({
                    estado: 'exitoso',
                    fecha_actualizacion: new Date().toISOString(),
                    metodo_pago: 'card',
                })
                .eq('stripe_session_id', session_id);

            if (pagoError) {
                console.error('❌ Error al actualizar pago:', pagoError);
            }

            // Marcar asientos como ocupados
            const { error: asientosError } = await supabase
                .from('funciones')
                .update({
                    asientos_ocupados: supabase.sql`
                        COALESCE(asientos_ocupados, '[]'::jsonb) || ${JSON.stringify(session.metadata.asientos ? JSON.parse(session.metadata.asientos) : [])}::jsonb
                    `
                })
                .eq('id', session.metadata.funcion_id);

            if (asientosError) {
                console.error('❌ Error al actualizar asientos ocupados:', asientosError);
            }

            console.log('✅ Reserva actualizada exitosamente:', reserva.id);

            return NextResponse.json({
                success: true,
                payment_status: session.payment_status,
                reserva_id: reserva.id,
                total_pagado: session.amount_total / 100,
                customer_email: session.customer_details?.email,
            });

        } else if (session.payment_status === 'unpaid') {
            console.log('❌ Pago no completado');

            // Actualizar estado como fallido
            await supabase
                .from('reservas')
                .update({
                    estado: 'cancelada',
                    estado_pago: 'fallido',
                })
                .eq('stripe_session_id', session_id);

            await supabase
                .from('pagos')
                .update({
                    estado: 'fallido',
                    fecha_actualizacion: new Date().toISOString(),
                })
                .eq('stripe_session_id', session_id);

            return NextResponse.json({
                success: false,
                payment_status: session.payment_status,
                error: 'Pago no completado',
            });
        }

        return NextResponse.json({
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email,
        });

    } catch (error) {
        console.error('❌ Error al verificar pago:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        
        return NextResponse.json(
            { 
                success: false,
                error: 'Error al verificar el pago', 
                details: error.message,
                errorType: error.name,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
