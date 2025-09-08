"use client";

import React, { useState } from 'react';
import { Check, Download, Share2, Calendar, MapPin, Clock, CreditCard, User } from 'lucide-react';
import { crearReserva } from '../../services/reservasService';

export default function ConfirmacionReserva({ reservaData, onClose, onNewReservation }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        nombre: '',
        email: '',
        telefono: ''
    });

    const handleConfirmReservation = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validar datos del cliente
            if (!customerInfo.nombre || !customerInfo.email) {
                setError('Por favor completa todos los campos obligatorios');
                return;
            }

            // Preparar datos para Supabase
            const reservaParaDB = {
                nombreCliente: customerInfo.nombre,
                emailCliente: customerInfo.email,
                telefonoCliente: customerInfo.telefono,
                funcionId: reservaData.id,
                asientosSeleccionados: reservaData.asientosSeleccionados,
                precioTotal: reservaData.precioTotal
            };

            // Crear reserva en Supabase
            await crearReserva(reservaParaDB);
            
            setShowSuccess(true);
        } catch (err) {
            console.error('Error al crear reserva:', err);
            setError('Error al procesar la reserva. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const generateTicketNumber = () => {
        return `CPN-${Date.now().toString().slice(-6)}`;
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="bg-gray-900 rounded-lg max-w-md w-full mx-4 p-6 text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">¡Reserva Confirmada!</h2>
                    <p className="text-gray-400 mb-6">Tu boleto ha sido generado exitosamente</p>
                    
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-400">Número de boleto:</span>
                            <span className="text-white font-mono">{generateTicketNumber()}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Película:</span>
                                <span className="text-white">{reservaData.movie.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Asientos:</span>
                                <span className="text-white">
                                    {reservaData.asientosSeleccionados.map(s => s.id).join(', ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-green-400 font-semibold">€{reservaData.precioTotal}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => {/* Función para descargar */}}
                            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Descargar
                        </button>
                        <button
                            onClick={() => {/* Función para compartir */}}
                            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir
                        </button>
                    </div>
                    
                    <button
                        onClick={() => {
                            onClose();
                            onNewReservation();
                        }}
                        className="w-full mt-4 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Nueva Reserva
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Confirmar Reserva</h2>
                    
                    {/* Resumen de la función */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Detalles de la Función
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-400">Película:</span>
                                    <p className="text-white font-medium">{reservaData.movie.title}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-400">Sala:</span>
                                    <span className="text-white">{reservaData.sala.nombre} ({reservaData.sala.tipo})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-400">Horario:</span>
                                    <span className="text-white">{reservaData.horario}</span>
                                </div>
                            </div>
                            
                            <div>
                                <span className="text-gray-400">Fecha:</span>
                                <p className="text-white">{formatDate(reservaData.fecha)}</p>
                                <div className="mt-3">
                                    <span className="text-gray-400">Asientos seleccionados:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {reservaData.asientosSeleccionados.map((seat) => (
                                            <span
                                                key={seat.id}
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    seat.isPremium ? 'bg-yellow-600 text-black' : 'bg-blue-600 text-white'
                                                }`}
                                            >
                                                {seat.id} {seat.isPremium ? '👑' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desglose de precios */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Desglose de Precios
                        </h3>
                        
                        <div className="space-y-2 text-sm">
                            {reservaData.asientosSeleccionados.map((seat) => (
                                <div key={seat.id} className="flex justify-between">
                                    <span className="text-gray-300">
                                        Asiento {seat.id} {seat.isPremium ? '(Premium)' : '(Regular)'}
                                    </span>
                                    <span className="text-white">
                                        €{seat.isPremium ? reservaData.precio + 50 : reservaData.precio}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                                <span className="text-white">Total a pagar</span>
                                <span className="text-green-400 text-lg">€{reservaData.precioTotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Información del Cliente
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Nombre completo</label>
                                <input
                                    type="text"
                                    value={customerInfo.nombre}
                                    onChange={(e) => setCustomerInfo({...customerInfo, nombre: e.target.value})}
                                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={customerInfo.telefono}
                                    onChange={(e) => setCustomerInfo({...customerInfo, telefono: e.target.value})}
                                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="+34 123 456 789"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmReservation}
                            disabled={!customerInfo.nombre || !customerInfo.email || loading}
                            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Confirmar y Pagar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
