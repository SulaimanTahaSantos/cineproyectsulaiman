// API Route para crear registros de pago con privilegios de servicio
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase con privilegios de servicio (bypassa RLS)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        console.log('📨 Recibida petición para crear registro de pago');
        
        const body = await request.json();
        console.log('📦 Datos del pago:', body);
        
        const { 
            reserva_id, 
            stripe_payment_intent_id, 
            stripe_session_id, 
            cantidad, 
            estado, 
            descripcion 
        } = body;

        // Validar campos requeridos
        if (!reserva_id || !cantidad || !estado) {
            console.error('❌ Campos requeridos faltantes');
            return NextResponse.json(
                { error: 'Campos requeridos: reserva_id, cantidad, estado' },
                { status: 400 }
            );
        }

        // Insertar registro de pago usando privilegios de servicio
        const { data: pago, error: pagoError } = await supabase
            .from('pagos')
            .insert({
                reserva_id,
                stripe_payment_intent_id,
                stripe_session_id,
                cantidad,
                estado,
                descripcion: descripcion || 'Pago de reserva de cine',
                fecha_creacion: new Date().toISOString(),
            })
            .select()
            .single();

        if (pagoError) {
            console.error('❌ Error al insertar pago:', pagoError);
            return NextResponse.json(
                { error: 'Error al crear registro de pago', details: pagoError.message },
                { status: 500 }
            );
        }

        console.log('✅ Registro de pago creado:', pago.id);

        return NextResponse.json({
            success: true,
            pago_id: pago.id,
            message: 'Registro de pago creado exitosamente'
        });

    } catch (error) {
        console.error('❌ Error al crear registro de pago:', error);
        return NextResponse.json(
            { 
                error: 'Error interno del servidor', 
                details: error.message 
            },
            { status: 500 }
        );
    }
}
