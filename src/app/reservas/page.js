"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, User, Ticket, Trash2, Mail } from 'lucide-react';
import { getReservasPorEmail, cancelarReserva } from '../../services/reservasService';

export default function ReservasPage() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [emailIngresado, setEmailIngresado] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verificar si hay un email guardado en sessionStorage
        const savedEmail = sessionStorage.getItem('reservas_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setEmailIngresado(true);
            loadReservas(savedEmail);
        } else {
            setLoading(false);
        }
    }, []); 

    const loadReservas = async (emailToUse = email) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getReservasPorEmail(emailToUse);
            setReservas(data);
            sessionStorage.setItem('reservas_email', emailToUse);
        } catch (err) {
            console.error('Error al cargar reservas:', err);
            setError('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setEmailIngresado(true);
            loadReservas();
        }
    };

    const deleteReserva = async (reservaId) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            try {
                await cancelarReserva(reservaId);
                setReservas(prev => prev.filter(r => r.id !== reservaId));
            } catch (err) {
                console.error('Error al cancelar reserva:', err);
                alert('Error al cancelar la reserva');
            }
        }
    };

    const changeEmail = () => {
        setEmailIngresado(false);
        setReservas([]);
        setEmail('');
        sessionStorage.removeItem('reservas_email');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReservaDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Cargando tus reservas...</p>
                </div>
            </div>
        );
    }

    if (!emailIngresado) {
        return (
            <div className="min-h-screen bg-gray-900">
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Mis Reservas
                            </h1>
                            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                                Ingresa tu email para ver tus reservas
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-md mx-auto px-4 py-12">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-center mb-6">
                            <Mail className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Buscar Reservas</h2>
                            <p className="text-gray-400">Ingresa el email que usaste para hacer la reserva</p>
                        </div>

                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-600 text-white p-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Buscar Reservas
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Mis Reservas
                        </h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                            {email} - <button onClick={changeEmail} className="text-blue-300 hover:text-white underline">Cambiar email</button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {reservas.length === 0 ? (
                    <div className="text-center py-12">
                        <Ticket className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No tienes reservas</h2>
                        <p className="text-gray-400 mb-6">¡Explora nuestras películas y haz tu primera reserva!</p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Ver Películas
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservas.map((reserva) => (
                            <div
                                key={reserva.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl"
                            >
                                <div className="md:flex">
                                    {/* Información de la función */}
                                    <div className="md:w-1/3 p-6">
                                        <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <Ticket className="w-16 h-16 mx-auto mb-2 text-blue-400" />
                                                <p className="text-sm">Película ID:</p>
                                                <p className="font-bold">{reserva.funciones.tmdb_movie_id}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            Reserva #{reserva.id}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            Reservado el {formatReservaDate(reserva.created_at)}
                                        </p>
                                    </div>

                                    {/* Detalles de la reserva */}
                                    <div className="md:w-2/3 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                                                    {reserva.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                                                </span>
                                                <h4 className="text-lg font-semibold text-white mb-2">
                                                    Número de reserva: CPN-{reserva.id.toString().slice(-6)}
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() => deleteReserva(reserva.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Cancelar reserva"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Información de la función */}
                                            <div className="space-y-4">
                                                <h5 className="text-white font-semibold mb-3">Detalles de la Función</h5>
                                                
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            {formatDate(reserva.funciones.fecha)}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">Fecha de la función</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-white font-medium">{reserva.funciones.horario}</p>
                                                        <p className="text-gray-400 text-sm">Hora de inicio</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            {reserva.funciones.salas.nombre} ({reserva.funciones.salas.tipo})
                                                        </p>
                                                        <p className="text-gray-400 text-sm">Sala y formato</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-white font-semibold mb-3">Información Personal</h5>
                                                
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-blue-400" />
                                                    <div>
                                                        <p className="text-white font-medium">{reserva.nombre_cliente}</p>
                                                        <p className="text-gray-400 text-sm">{reserva.email_cliente}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-white font-medium mb-2">Asientos reservados:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {reserva.asientos_seleccionados.map((seat, index) => (
                                                            <span
                                                                key={seat.id || index}
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    seat.isPremium 
                                                                        ? 'bg-yellow-600 text-black' 
                                                                        : 'bg-blue-600 text-white'
                                                                }`}
                                                            >
                                                                {seat.id} {seat.isPremium ? '👑' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-gray-700 rounded-lg p-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300">Total pagado:</span>
                                                        <span className="text-green-400 text-xl font-bold">
                                                            €{reserva.precio_total}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {reserva.asientos_seleccionados.length} asientos
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => deleteReserva(reserva.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Cancelar Reserva
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
