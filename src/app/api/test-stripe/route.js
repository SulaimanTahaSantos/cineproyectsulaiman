// API Route para probar la configuración de Stripe
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('🔍 Probando configuración de Stripe...');
        
        // Verificar variables de entorno
        const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        const secretKey = process.env.STRIPE_SECRET_KEY;
        
        console.log('📝 Public Key presente:', !!publicKey);
        console.log('📝 Secret Key presente:', !!secretKey);
        console.log('📝 Public Key prefix:', publicKey?.substring(0, 10));
        console.log('📝 Secret Key prefix:', secretKey?.substring(0, 10));
        
        if (!secretKey) {
            return NextResponse.json({
                success: false,
                error: 'STRIPE_SECRET_KEY no está configurado'
            }, { status: 500 });
        }
        
        // Inicializar Stripe
        const stripe = new Stripe(secretKey, {
            apiVersion: '2023-10-16',
        });
        
        // Probar conexión haciendo una llamada simple
        const balance = await stripe.balance.retrieve();
        
        console.log('✅ Conexión con Stripe exitosa');
        console.log('💰 Balance:', balance);
        
        return NextResponse.json({
            success: true,
            message: 'Stripe configurado correctamente',
            hasPublicKey: !!publicKey,
            hasSecretKey: !!secretKey,
            balanceAvailable: balance.available,
            balancePending: balance.pending
        });
        
    } catch (error) {
        console.error('❌ Error al probar Stripe:', error);
        
        return NextResponse.json({
            success: false,
            error: 'Error al conectar con Stripe',
            details: error.message,
            errorType: error.type || error.name
        }, { status: 500 });
    }
}
