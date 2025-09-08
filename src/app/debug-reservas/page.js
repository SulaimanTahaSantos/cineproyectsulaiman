"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function DebugReservasPage() {
    const { user } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            debugCargarReservas();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const debugCargarReservas = async () => {
        try {
            setLoading(true);
            console.log('🔍 DEBUG: Cargando reservas para usuario:', user.id);
            
            // 1. Primero, ver qué reservas básicas tenemos
            console.log('📋 Paso 1: Consulta básica de reservas');
            const { data: reservasBasicas, error: errorBasico } = await supabase
                .from('reservas')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (errorBasico) {
                console.error('❌ Error en consulta básica:', errorBasico);
                throw errorBasico;
            }

            console.log('✅ Reservas básicas encontradas:', reservasBasicas?.length || 0);
            console.log('📊 Datos básicos:', reservasBasicas);

            // 2. Ver qué funciones existen
            console.log('📋 Paso 2: Verificar funciones');
            const { data: funcionesData, error: funcionesError } = await supabase
                .from('funciones')
                .select('*')
                .limit(5);

            if (funcionesError) {
                console.error('❌ Error al consultar funciones:', funcionesError);
            } else {
                console.log('✅ Funciones disponibles:', funcionesData?.length || 0);
                console.log('📊 Estructura de funciones:', funcionesData?.[0]);
            }

            // 3. Ver qué salas existen
            console.log('📋 Paso 3: Verificar salas');
            const { data: salasData, error: salasError } = await supabase
                .from('salas')
                .select('*')
                .limit(5);

            if (salasError) {
                console.error('❌ Error al consultar salas:', salasError);
            } else {
                console.log('✅ Salas disponibles:', salasData?.length || 0);
                console.log('📊 Estructura de salas:', salasData?.[0]);
            }

            // 4. Ver qué pagos existen
            console.log('📋 Paso 4: Verificar pagos');
            const { data: pagosData, error: pagosError } = await supabase
                .from('pagos')
                .select('*')
                .limit(5);

            if (pagosError) {
                console.error('❌ Error al consultar pagos:', pagosError);
            } else {
                console.log('✅ Pagos disponibles:', pagosData?.length || 0);
                console.log('📊 Estructura de pagos:', pagosData?.[0]);
            }

            // Guardar datos para mostrar en la UI
            setRawData({
                reservasBasicas,
                funcionesData,
                salasData,
                pagosData,
            });

            setReservas(reservasBasicas || []);

        } catch (error) {
            console.error('❌ Error completo:', error);
            setError(`Error al cargar reservas: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-lg mb-4">Debes iniciar sesión para ver tus reservas</p>
                    <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Debuggeando reservas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button 
                        onClick={debugCargarReservas}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🔍 Debug - Mis Reservas</h1>
                    <p className="text-gray-300">Información de debug para troubleshooting</p>
                </div>

                {/* Información de debug */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">📊 Datos Encontrados</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-300">
                                <span className="text-green-400">Reservas:</span> {reservas.length}
                            </p>
                            <p className="text-gray-300">
                                <span className="text-green-400">Funciones:</span> {rawData?.funcionesData?.length || 0}
                            </p>
                            <p className="text-gray-300">
                                <span className="text-green-400">Salas:</span> {rawData?.salasData?.length || 0}
                            </p>
                            <p className="text-gray-300">
                                <span className="text-green-400">Pagos:</span> {rawData?.pagosData?.length || 0}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">👤 Usuario Actual</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-300">
                                <span className="text-blue-400">ID:</span> {user.id}
                            </p>
                            <p className="text-gray-300">
                                <span className="text-blue-400">Email:</span> {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de reservas */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">📋 Reservas Encontradas</h3>
                    
                    {reservas.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No se encontraron reservas</p>
                            <Link 
                                href="/" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Hacer primera reserva
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reservas.map((reserva) => (
                                <div key={reserva.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-medium">Reserva #{reserva.id}</h4>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            reserva.estado === 'confirmada' ? 'bg-green-600' :
                                            reserva.estado === 'pendiente_pago' ? 'bg-yellow-600' :
                                            'bg-red-600'
                                        }`}>
                                            {reserva.estado}
                                        </span>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Función ID:</span> {reserva.funcion_id}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Asientos:</span> {reserva.total_asientos}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Total:</span> €{reserva.precio_total}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Estado Pago:</span> {reserva.estado_pago}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Creada:</span> {new Date(reserva.created_at).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>

                                    {reserva.asientos_seleccionados && (
                                        <div className="mt-2">
                                            <p className="text-gray-300 text-xs">
                                                <span className="text-gray-400">Asientos:</span> {
                                                    Array.isArray(reserva.asientos_seleccionados) 
                                                        ? reserva.asientos_seleccionados.join(', ')
                                                        : reserva.asientos_seleccionados
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botones de navegación */}
                <div className="mt-8 flex gap-4">
                    <Link 
                        href="/mis-reservas" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Ir a Mis Reservas Normal
                    </Link>
                    <Link 
                        href="/" 
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
