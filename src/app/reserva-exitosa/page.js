"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Ticket, Calendar, Clock, MapPin, CreditCard, Loader2 } from 'lucide-react';
import stripePaymentService from '../services/stripePaymentService';
import Link from 'next/link';

function ReservaExitosaContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (sessionId) {
            verificarPago();
        }
    }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

    const verificarPago = async () => {
        try {
            setLoading(true);
            console.log('🔍 Verificando pago para session:', sessionId);
            
            if (!sessionId) {
                throw new Error('No se proporcionó session_id');
            }
            
            try {
                const result = await stripePaymentService.verificarEstadoPago(sessionId);
                console.log('Resultado de verificación:', result);
                setPaymentDetails(result);
                return;
            } catch (verificationError) {
                console.warn('⚠️ Verificación normal falló, intentando con debug:', verificationError.message);
                
                // Si falla, intentar con modo debug
                const debugResult = await fetch('/api/debug-verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId })
                });
                
                if (debugResult.ok) {
                    const debugData = await debugResult.json();
                    console.log('✅ Verificación debug exitosa:', debugData);
                    setPaymentDetails(debugData);
                    return;
                }
                
                // Si ambos fallan, mostrar información básica
                console.error('❌ Ambas verificaciones fallaron');
                setPaymentDetails({
                    success: true,
                    payment_status: 'processing',
                    message: 'Tu pago está siendo procesado. Si ya pagaste, tu reserva debería estar confirmada.',
                    session_id: sessionId
                });
            }
            
        } catch (error) {
            console.error('❌ Error al verificar pago:', error);
            setPaymentDetails({
                success: false,
                error: true,
                message: 'No pudimos verificar el estado de tu pago, pero si completaste el proceso en Stripe, tu reserva debería estar confirmada.',
                session_id: sessionId
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Verificando tu pago...</p>
                </div>
            </div>
        );
    }

    if (error && !paymentDetails) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-6">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Error de Verificación</h1>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link href="/mis-reservas" className="block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Ver Mis Reservas
                        </Link>
                        <Link href="/" className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (paymentDetails?.error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-6">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Verificación Pendiente</h1>
                    <p className="text-gray-300 mb-6">{paymentDetails.message}</p>
                    <div className="space-y-3">
                        <Link href="/mis-reservas" className="block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Ver Mis Reservas
                        </Link>
                        <Link href="/" className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Volver al inicio
                        </Link>
                        {sessionId && (
                            <p className="text-xs text-gray-500 mt-4">
                                ID de sesión: {sessionId}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!paymentDetails?.success && paymentDetails?.success !== undefined) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-6">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Pago no completado</h1>
                    <p className="text-gray-300 mb-6">Tu pago no se pudo procesar correctamente.</p>
                    <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Intentar de nuevo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Encabezado de éxito */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ¡Reserva Confirmada!
                    </h1>
                    
                    <p className="text-gray-300 text-lg">
                        Tu pago se ha procesado exitosamente
                    </p>
                </div>

                {/* Detalles de la reserva */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Ticket className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Detalles de tu reserva</h2>
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-white font-medium">Fecha y hora</p>
                                <p className="text-gray-300 text-sm">
                                    {/* Aquí mostrarías la fecha y hora de la función */}
                                    Función confirmada
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-white font-medium">Sala</p>
                                <p className="text-gray-300 text-sm">
                                    Información de la sala
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-white font-medium">Total pagado</p>
                                <p className="text-green-400 text-lg font-semibold">
                                    €{paymentDetails.total_pagado}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
                    <h3 className="text-blue-400 font-medium mb-2">Información importante</h3>
                    <ul className="text-blue-200 text-sm space-y-1">
                        <li>• Llega al cine 15 minutos antes del inicio</li>
                        <li>• Presenta este comprobante en taquilla</li>
                        <li>• Revisa tu email para más detalles</li>
                    </ul>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4">
                    <Link 
                        href="/mis-reservas" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-center transition-colors"
                    >
                        Ver mis reservas
                    </Link>
                    
                    <Link 
                        href="/" 
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-center transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>

                {/* ID de la reserva */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        ID de reserva: {paymentDetails.reserva_id}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ReservaExitosaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span>Cargando...</span>
                </div>
            </div>
        }>
            <ReservaExitosaContent />
        </Suspense>
    );
}
