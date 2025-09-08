"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DebugReservasStructure() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkReservasStructure = async () => {
        setLoading(true);
        const debug = {};

        try {
            // 1. Ver reservas existentes para entender la estructura
            const { data: reservasExistentes, error: errorExistentes } = await supabase
                .from('reservas')
                .select('*')
                .limit(5);

            debug.reservasExistentes = { data: reservasExistentes, error: errorExistentes };

            // 2. Intentar insertar con campos mínimos
            const testMinimal = {
                funcion_id: 1,
                user_id: '00000000-0000-0000-0000-000000000000',
                nombre_cliente: 'Test Cliente',
                estado: 'test'
            };

            const { data: insertMinimal, error: errorMinimal } = await supabase
                .from('reservas')
                .insert(testMinimal)
                .select();

            debug.testMinimal = { data: insertMinimal, error: errorMinimal };

            // Limpiar si se insertó
            if (insertMinimal?.[0]) {
                await supabase
                    .from('reservas')
                    .delete()
                    .eq('id', insertMinimal[0].id);
            }

            // 3. Intentar insertar con más campos
            const testCompleto = {
                funcion_id: 1,
                user_id: '00000000-0000-0000-0000-000000000000',
                nombre_cliente: 'Test Cliente Completo',
                asientos_seleccionados: ['A1', 'A2'],
                precio_total: 20.00,
                estado: 'test',
                estado_pago: 'pendiente'
            };

            const { data: insertCompleto, error: errorCompleto } = await supabase
                .from('reservas')
                .insert(testCompleto)
                .select();

            debug.testCompleto = { data: insertCompleto, error: errorCompleto };

            // Limpiar si se insertó
            if (insertCompleto?.[0]) {
                await supabase
                    .from('reservas')
                    .delete()
                    .eq('id', insertCompleto[0].id);
            }

            // 4. Ver estructura de tabla funciones para referencia
            const { data: funciones, error: errorFunciones } = await supabase
                .from('funciones')
                .select('*')
                .limit(3);

            debug.funcionesDisponibles = { data: funciones, error: errorFunciones };

        } catch (error) {
            debug.errorGeneral = error.message;
        }

        setResults(debug);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Debug Estructura Reservas</h1>
                
                <div className="mb-6">
                    <button
                        onClick={checkReservasStructure}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                        {loading ? '🔄 Analizando...' : '🔍 Verificar Estructura de Reservas'}
                    </button>
                </div>

                {results && (
                    <div className="space-y-6">
                        {/* Reservas existentes */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">📋 Reservas Existentes</h2>
                            {results.reservasExistentes?.data?.length > 0 ? (
                                <div>
                                    <p className="text-green-400 mb-2">✅ Encontradas {results.reservasExistentes.data.length} reservas</p>
                                    <div className="bg-black p-3 rounded text-green-400 text-sm">
                                        <p className="mb-2">Columnas disponibles:</p>
                                        <pre>{Object.keys(results.reservasExistentes.data[0]).join(', ')}</pre>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-yellow-400">⚠️ No se encontraron reservas existentes</p>
                            )}
                        </div>

                        {/* Test mínimo */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">🧪 Test Inserción Mínima</h2>
                            {results.testMinimal?.error ? (
                                <div className="bg-red-900 p-3 rounded text-red-200">
                                    <p className="mb-2">❌ Error en inserción mínima:</p>
                                    <pre className="text-xs">{JSON.stringify(results.testMinimal.error, null, 2)}</pre>
                                </div>
                            ) : (
                                <div className="bg-green-900 p-3 rounded text-green-200">
                                    ✅ Inserción mínima exitosa
                                </div>
                            )}
                        </div>

                        {/* Test completo */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">🧪 Test Inserción Completa</h2>
                            {results.testCompleto?.error ? (
                                <div className="bg-red-900 p-3 rounded text-red-200">
                                    <p className="mb-2">❌ Error en inserción completa:</p>
                                    <pre className="text-xs">{JSON.stringify(results.testCompleto.error, null, 2)}</pre>
                                </div>
                            ) : (
                                <div className="bg-green-900 p-3 rounded text-green-200">
                                    ✅ Inserción completa exitosa
                                </div>
                            )}
                        </div>

                        {/* Funciones disponibles */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">🎬 Funciones Disponibles</h2>
                            {results.funcionesDisponibles?.data?.length > 0 ? (
                                <div className="bg-blue-900 p-3 rounded text-blue-200">
                                    <p className="mb-2">✅ Funciones encontradas: {results.funcionesDisponibles.data.length}</p>
                                    <div className="text-xs">
                                        {results.funcionesDisponibles.data.map((funcion, index) => (
                                            <div key={index} className="mb-1">
                                                ID: {funcion.id} | Fecha: {funcion.fecha} | Hora: {funcion.hora}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-red-400">❌ No se encontraron funciones</p>
                            )}
                        </div>

                        <details className="bg-black p-4 rounded">
                            <summary className="cursor-pointer text-green-400 font-medium">
                                📋 Ver todos los datos (JSON)
                            </summary>
                            <pre className="text-green-400 text-xs mt-4 overflow-auto max-h-96">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
