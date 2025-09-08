"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugPaymentsPage() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');

    const debugReservaCompleta = async () => {
        setLoading(true);
        const debug = {};

        try {
            // 1. Ver todas las reservas recientes
            const { data: todasReservas, error: errorReservas } = await supabase
                .from('reservas')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            debug.todasReservas = { data: todasReservas, error: errorReservas };

            // 2. Ver todos los pagos recientes
            const { data: todosPagos, error: errorPagos } = await supabase
                .from('pagos')
                .select('*')
                .order('fecha_creacion', { ascending: false })
                .limit(10);

            debug.todosPagos = { data: todosPagos, error: errorPagos };

            // 3. Si hay un session_id específico, buscar por él
            if (sessionId.trim()) {
                const { data: reservaPorSession, error: errorSession } = await supabase
                    .from('reservas')
                    .select('*')
                    .eq('stripe_session_id', sessionId.trim());

                debug.reservaPorSession = { data: reservaPorSession, error: errorSession };

                const { data: pagoPorSession, error: errorPagoSession } = await supabase
                    .from('pagos')
                    .select('*')
                    .eq('stripe_session_id', sessionId.trim());

                debug.pagoPorSession = { data: pagoPorSession, error: errorPagoSession };
            }

            // 4. Verificar estructura de las tablas
            const { data: columnasReservas, error: errorColReservas } = await supabase
                .rpc('get_table_columns', { table_name: 'reservas' })
                .catch(() => ({ data: null, error: 'RPC no disponible' }));

            debug.estructuraReservas = { data: columnasReservas, error: errorColReservas };

            const { data: columnasPagos, error: errorColPagos } = await supabase
                .rpc('get_table_columns', { table_name: 'pagos' })
                .catch(() => ({ data: null, error: 'RPC no disponible' }));

            debug.estructuraPagos = { data: columnasPagos, error: errorColPagos };

        } catch (error) {
            debug.errorGeneral = error.message;
        }

        setResults(debug);
        setLoading(false);
    };

    const testCrearReserva = async () => {
        setLoading(true);
        const debug = {};

        try {
            // Crear una reserva de prueba
            const reservaTest = {
                funcion_id: 1, // Asumiendo que existe
                user_id: '00000000-0000-0000-0000-000000000000', // UUID vacío para test
                asientos_seleccionados: ['A1', 'A2'],
                total_asientos: 2,
                precio_total: 20.00,
                estado: 'pendiente_pago',
                stripe_session_id: 'test_session_' + Date.now(),
                estado_pago: 'pendiente',
            };

            const { data: reservaCreada, error: errorCrear } = await supabase
                .from('reservas')
                .insert(reservaTest)
                .select()
                .single();

            debug.reservaTest = { data: reservaCreada, error: errorCrear };

            // Si se creó, intentar actualizarla
            if (reservaCreada) {
                const { data: reservaActualizada, error: errorActualizar } = await supabase
                    .from('reservas')
                    .update({
                        estado: 'confirmada',
                        estado_pago: 'pagado',
                    })
                    .eq('id', reservaCreada.id)
                    .select()
                    .single();

                debug.reservaActualizada = { data: reservaActualizada, error: errorActualizar };

                // Limpiar después del test
                await supabase
                    .from('reservas')
                    .delete()
                    .eq('id', reservaCreada.id);
            }

        } catch (error) {
            debug.errorTest = error.message;
        }

        setResults(debug);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Debug de Pagos y Reservas</h1>
                
                <div className="grid gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Buscar por Session ID</h2>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Ingresa el session_id de Stripe"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={debugReservaCompleta}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                        >
                            {loading ? '🔄 Analizando...' : '🔍 Debug Completo'}
                        </button>

                        <button
                            onClick={testCrearReserva}
                            disabled={loading}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                        >
                            {loading ? '🔄 Probando...' : '🧪 Test Crear Reserva'}
                        </button>
                    </div>
                </div>

                {results && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">📊 Resultados del Debug</h2>
                        <pre className="bg-black p-4 rounded text-green-400 text-sm overflow-auto max-h-96">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
