"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Ticket, CreditCard, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function MisReservasPage() {
    const { user } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            cargarReservas();
        }
    }, [user]);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            console.log('🔄 Cargando reservas para usuario:', user.id);
            
            // Primero, hacer una consulta simple sin JOINs
            const { data: reservasBasicas, error: errorBasico } = await supabase
                .from('reservas')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (errorBasico) {
                console.error('❌ Error al cargar reservas básicas:', errorBasico);
                throw errorBasico;
            }

            console.log('✅ Reservas básicas cargadas:', reservasBasicas?.length || 0);

            // Si tenemos reservas, intentar enriquecer con datos adicionales
            if (reservasBasicas && reservasBasicas.length > 0) {
                const reservasEnriquecidas = await Promise.all(
                    reservasBasicas.map(async (reserva) => {
                        try {
                            // Intentar obtener datos de la función
                            if (reserva.funcion_id) {
                                const { data: funcionData } = await supabase
                                    .from('funciones')
                                    .select('fecha, hora, precio, pelicula_id, sala_id')
                                    .eq('id', reserva.funcion_id)
                                    .single();

                                if (funcionData?.sala_id) {
                                    const { data: salaData } = await supabase
                                        .from('salas')
                                        .select('nombre, capacidad')
                                        .eq('id', funcionData.sala_id)
                                        .single();

                                    funcionData.salas = salaData;
                                }

                                reserva.funciones = funcionData;
                            }

                            // Intentar obtener datos del pago
                            const { data: pagoData } = await supabase
                                .from('pagos')
                                .select('estado, cantidad, fecha_creacion')
                                .eq('reserva_id', reserva.id)
                                .single();

                            if (pagoData) {
                                reserva.pagos = [pagoData]; // Mantener como array para compatibilidad
                            }

                            return reserva;
                        } catch (enrichError) {
                            console.warn('⚠️ Error enriqueciendo reserva:', reserva.id, enrichError);
                            return reserva; // Devolver reserva básica si falla el enriquecimiento
                        }
                    })
                );

                setReservas(reservasEnriquecidas);
            } else {
                setReservas([]);
            }

        } catch (error) {
            console.error('❌ Error al cargar reservas:', error);
            setError(`Error al cargar tus reservas: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'confirmada':
                return 'text-green-400 bg-green-900/30 border-green-600';
            case 'pendiente_pago':
                return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
            case 'cancelada':
                return 'text-red-400 bg-red-900/30 border-red-600';
            case 'expirada':
                return 'text-gray-400 bg-gray-900/30 border-gray-600';
            default:
                return 'text-gray-400 bg-gray-900/30 border-gray-600';
        }
    };

    const getEstadoPagoIcon = (estado) => {
        switch (estado) {
            case 'pagado':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'pendiente':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            case 'fallido':
                return <X className="w-5 h-5 text-red-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
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
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Cargando tus reservas...</p>
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
                        onClick={cargarReservas}
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
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Mis Reservas</h1>
                    <p className="text-gray-300">Gestiona tus reservas de cine</p>
                </div>

                {reservas.length === 0 ? (
                    <div className="text-center py-12">
                        <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">No tienes reservas</h2>
                        <p className="text-gray-400 mb-6">¡Reserva tu primera entrada de cine!</p>
                        <Link 
                            href="/" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Explorar películas
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservas.map((reserva) => (
                            <div key={reserva.id} className="bg-gray-800 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">
                                            Reserva #{reserva.id}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            Creada el {new Date(reserva.created_at).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm border ${getEstadoColor(reserva.estado)}`}>
                                            {reserva.estado.replace('_', ' ')}
                                        </span>
                                        {getEstadoPagoIcon(reserva.estado_pago)}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Información de la función */}
                                    <div>
                                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-blue-400" />
                                            Detalles de la función
                                        </h4>
                                        
                                        {reserva.funciones && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-300">
                                                        {new Date(reserva.funciones.fecha).toLocaleDateString('es-ES')} a las {reserva.funciones.hora}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-300">
                                                        {reserva.funciones.salas?.nombre || 'Sala no especificada'}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-300">
                                                        {reserva.total_asientos} asiento(s): {reserva.asientos_seleccionados?.join(', ') || 'No especificados'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del pago */}
                                    <div>
                                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-green-400" />
                                            Información de pago
                                        </h4>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Estado:</span>
                                                <span className={`font-medium ${
                                                    reserva.estado_pago === 'pagado' ? 'text-green-400' :
                                                    reserva.estado_pago === 'pendiente' ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {reserva.estado_pago}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total:</span>
                                                <span className="text-white font-semibold">
                                                    €{reserva.precio_total || (reserva.total_pagado || '0.00')}
                                                </span>
                                            </div>
                                            
                                            {reserva.metodo_pago && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Método:</span>
                                                    <span className="text-gray-300">{reserva.metodo_pago}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                {reserva.estado === 'confirmada' && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <div className="flex gap-3">
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                                Ver detalles
                                            </button>
                                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                                Descargar ticket
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón para volver */}
                <div className="mt-8 text-center">
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
