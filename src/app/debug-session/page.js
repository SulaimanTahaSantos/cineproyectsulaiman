"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugSpecificSession() {
    const [sessionId, setSessionId] = useState('cs_test_a1RgsHLULzHQPH6CbEH0sgxCmdIVUbGKWkTym2XPgPvpDvpCdUx7lsqHKc');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const debugSession = async () => {
        setLoading(true);
        const debug = {};

        try {
            console.log('🔍 Buscando session_id:', sessionId);

            // 1. Buscar reservas con este session_id
            const { data: reservas, error: errorReservas } = await supabase
                .from('reservas')
                .select('*')
                .eq('stripe_session_id', sessionId);

            debug.reservasConSession = { data: reservas, error: errorReservas };

            // 2. Buscar pagos con este session_id
            const { data: pagos, error: errorPagos } = await supabase
                .from('pagos')
                .select('*')
                .eq('stripe_session_id', sessionId);

            debug.pagosConSession = { data: pagos, error: errorPagos };

            // 3. Ver todas las reservas recientes (últimas 20)
            const { data: reservasRecientes, error: errorRecientes } = await supabase
                .from('reservas')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            debug.reservasRecientes = { data: reservasRecientes, error: errorRecientes };

            // 4. Ver todos los pagos recientes (últimos 20)
            const { data: pagosRecientes, error: errorPagosRecientes } = await supabase
                .from('pagos')
                .select('*')
                .order('fecha_creacion', { ascending: false })
                .limit(20);

            debug.pagosRecientes = { data: pagosRecientes, error: errorPagosRecientes };

            // 5. Verificar el session con Stripe
            try {
                const stripeResponse = await fetch('/api/debug-verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId })
                });

                if (stripeResponse.ok) {
                    debug.stripeSession = await stripeResponse.json();
                } else {
                    debug.stripeSession = { error: await stripeResponse.text() };
                }
            } catch (stripeError) {
                debug.stripeSession = { error: stripeError.message };
            }

        } catch (error) {
            debug.errorGeneral = error.message;
        }

        setResults(debug);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Debug Session Específico</h1>
                
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Session ID a investigar:</h2>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            placeholder="Ingresa el session_id de Stripe"
                        />
                        <button
                            onClick={debugSession}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                        >
                            {loading ? '🔄 Investigando...' : '🔍 Debug Session'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-400">
                        Este es el session_id que falló en tu última reserva
                    </p>
                </div>

                {results && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">📊 Resultados del Debug</h2>
                            
                            {/* Reservas con este session */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    🎫 Reservas con este Session ID: {results.reservasConSession?.data?.length || 0}
                                </h3>
                                {results.reservasConSession?.data?.length > 0 ? (
                                    <div className="bg-green-900 p-3 rounded text-green-200">
                                        ✅ Encontradas reservas con este session_id
                                    </div>
                                ) : (
                                    <div className="bg-red-900 p-3 rounded text-red-200">
                                        ❌ NO se encontraron reservas con este session_id
                                    </div>
                                )}
                            </div>

                            {/* Pagos con este session */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    💳 Pagos con este Session ID: {results.pagosConSession?.data?.length || 0}
                                </h3>
                                {results.pagosConSession?.data?.length > 0 ? (
                                    <div className="bg-green-900 p-3 rounded text-green-200">
                                        ✅ Encontrados pagos con este session_id
                                    </div>
                                ) : (
                                    <div className="bg-red-900 p-3 rounded text-red-200">
                                        ❌ NO se encontraron pagos con este session_id
                                    </div>
                                )}
                            </div>

                            {/* Información de Stripe */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    🏪 Estado en Stripe
                                </h3>
                                {results.stripeSession?.payment_status ? (
                                    <div className="bg-blue-900 p-3 rounded text-blue-200">
                                        ✅ Session existe en Stripe - Estado: {results.stripeSession.payment_status}
                                    </div>
                                ) : (
                                    <div className="bg-red-900 p-3 rounded text-red-200">
                                        ❌ Error al obtener session de Stripe
                                    </div>
                                )}
                            </div>

                            <details className="bg-black p-4 rounded">
                                <summary className="cursor-pointer text-green-400 font-medium">
                                    📋 Ver datos completos (JSON)
                                </summary>
                                <pre className="text-green-400 text-xs mt-4 overflow-auto max-h-96">
                                    {JSON.stringify(results, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
