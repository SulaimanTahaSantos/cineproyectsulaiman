"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugTablesPage() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkTableStructure = async () => {
        setLoading(true);
        const debug = {};

        try {
            // 1. Intentar insertar un registro de prueba para ver qué columnas faltan
            const testReserva = {
                funcion_id: 1,
                user_id: '00000000-0000-0000-0000-000000000000',
                asientos_seleccionados: ['A1'],
                precio_total: 10.00,
                estado: 'test'
            };

            const { data: insertTest, error: insertError } = await supabase
                .from('reservas')
                .insert(testReserva)
                .select();

            debug.insertTest = { data: insertTest, error: insertError };

            // 2. Si el insert falló, intentar con menos campos
            if (insertError) {
                const minimalReserva = {
                    funcion_id: 1,
                    user_id: '00000000-0000-0000-0000-000000000000',
                    estado: 'test'
                };

                const { data: minimalTest, error: minimalError } = await supabase
                    .from('reservas')
                    .insert(minimalReserva)
                    .select();

                debug.minimalTest = { data: minimalTest, error: minimalError };

                // Limpiar si se insertó
                if (minimalTest?.[0]) {
                    await supabase
                        .from('reservas')
                        .delete()
                        .eq('id', minimalTest[0].id);
                }
            } else if (insertTest?.[0]) {
                // Limpiar si se insertó
                await supabase
                    .from('reservas')
                    .delete()
                    .eq('id', insertTest[0].id);
            }

            // 3. Ver estructura actual de reservas existentes
            const { data: reservasExistentes, error: errorExistentes } = await supabase
                .from('reservas')
                .select('*')
                .limit(1);

            debug.estructuraActual = { data: reservasExistentes, error: errorExistentes };

            // 4. Ver estructura de funciones
            const { data: funcionesEstructura, error: errorFunciones } = await supabase
                .from('funciones')
                .select('*')
                .limit(1);

            debug.estructuraFunciones = { data: funcionesEstructura, error: errorFunciones };

            // 5. Ver estructura de pagos
            const { data: pagosEstructura, error: errorPagos } = await supabase
                .from('pagos')
                .select('*')
                .limit(1);

            debug.estructuraPagos = { data: pagosEstructura, error: errorPagos };

        } catch (error) {
            debug.errorGeneral = error.message;
        }

        setResults(debug);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Debug Estructura de Tablas</h1>
                
                <div className="mb-6">
                    <button
                        onClick={checkTableStructure}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                        {loading ? '🔄 Analizando...' : '🔍 Verificar Estructura de Tablas'}
                    </button>
                </div>

                {results && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">📊 Resultados del Análisis</h2>
                            
                            {/* Test de inserción */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    🧪 Test de Inserción Completa
                                </h3>
                                {results.insertTest?.error ? (
                                    <div className="bg-red-900 p-3 rounded text-red-200">
                                        ❌ Error: {results.insertTest.error.message}
                                    </div>
                                ) : (
                                    <div className="bg-green-900 p-3 rounded text-green-200">
                                        ✅ Inserción completa exitosa
                                    </div>
                                )}
                            </div>

                            {/* Test minimal */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    🧪 Test de Inserción Mínima
                                </h3>
                                {results.minimalTest?.error ? (
                                    <div className="bg-red-900 p-3 rounded text-red-200">
                                        ❌ Error: {results.minimalTest.error.message}
                                    </div>
                                ) : (
                                    <div className="bg-green-900 p-3 rounded text-green-200">
                                        ✅ Inserción mínima exitosa
                                    </div>
                                )}
                            </div>

                            {/* Estructura actual */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-yellow-400">
                                    📋 Estructura Actual de Reservas
                                </h3>
                                {results.estructuraActual?.data?.[0] ? (
                                    <div className="bg-blue-900 p-3 rounded text-blue-200">
                                        <p className="mb-2">✅ Columnas disponibles:</p>
                                        <pre className="text-xs bg-black p-2 rounded">
                                            {Object.keys(results.estructuraActual.data[0]).join(', ')}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-900 p-3 rounded text-yellow-200">
                                        ⚠️ No hay reservas existentes para verificar estructura
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
