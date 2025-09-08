"use client";

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { getFunciones } from '../../services/reservasService';

export default function HorariosPelicula({ movie, onSelectFunction }) {
    const [selectedDate, setSelectedDate] = useState(0);
    const [funciones, setFunciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (movie?.id) {
            loadFunciones();
        }
    }, [movie?.id]);

    const loadFunciones = async () => {
        try {
            setLoading(true);
            console.log('Cargando funciones para película ID:', movie.id);
            const data = await getFunciones(movie.id);
            console.log('Funciones recibidas:', data);
            setFunciones(data);
        } catch (err) {
            console.error('Error al cargar funciones:', err);
            setError('Error al cargar horarios');
        } finally {
            setLoading(false);
        }
    };

    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dates = generateDates();
    const selectedDateObj = dates[selectedDate];

    // Filtrar funciones por fecha seleccionada
    const funcionesPorFecha = funciones.filter(funcion => {
        const funcionFecha = new Date(funcion.fecha);
        return funcionFecha.toDateString() === selectedDateObj.toDateString();
    });

    // Agrupar funciones por sala
    const funcionesPorSala = funcionesPorFecha.reduce((acc, funcion) => {
        const salaId = funcion.salas.id;
        if (!acc[salaId]) {
            acc[salaId] = {
                sala: funcion.salas,
                funciones: []
            };
        }
        acc[salaId].funciones.push(funcion);
        return acc;
    }, {});

    const formatDate = (date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Hoy";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Mañana";
        } else {
            return date.toLocaleDateString('es-ES', { 
                weekday: 'short', 
                day: 'numeric',
                month: 'short'
            });
        }
    };

    const getDisponibilidad = (ocupados, capacidad) => {
        const porcentaje = (ocupados / capacidad) * 100;
        if (porcentaje < 30) return { text: "Disponible", color: "text-green-400" };
        if (porcentaje < 70) return { text: "Pocas plazas", color: "text-yellow-400" };
        if (porcentaje < 90) return { text: "Casi lleno", color: "text-orange-400" };
        return { text: "Agotado", color: "text-red-400" };
    };

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Horarios y Funciones</h3>
                <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Cargando horarios...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Horarios y Funciones</h3>
                <div className="text-center text-red-400 py-8">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Horarios y Funciones</h3>
            
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Selecciona una fecha:</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(index)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                                selectedDate === index
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="text-center">
                                <div className="font-medium">{formatDate(date)}</div>
                                <div className="text-xs opacity-80">
                                    {date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {Object.keys(funcionesPorSala).length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    No hay funciones disponibles para esta fecha
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.values(funcionesPorSala).map(({ sala, funciones: funcionesSala }) => (
                        <div key={sala.id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <h5 className="font-semibold text-white">{sala.nombre}</h5>
                                        <p className="text-sm text-gray-400">{sala.tipo} • {sala.capacidad} asientos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Users className="w-5 h-5 text-gray-400 inline mr-1" />
                                    <span className="text-sm text-gray-400">{sala.capacidad}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {funcionesSala.map((funcion) => {
                                    const disponibilidad = getDisponibilidad(funcion.asientos_ocupados, sala.capacidad);
                                    const asientosLibres = sala.capacidad - funcion.asientos_ocupados;
                                    
                                    return (
                                        <button
                                            key={funcion.id}
                                            onClick={() => onSelectFunction({
                                                id: funcion.id,
                                                movie,
                                                sala,
                                                fecha: selectedDateObj,
                                                horario: funcion.horario,
                                                precio: funcion.precio,
                                                asientosLibres,
                                                asientosOcupados: funcion.asientos_ocupados
                                            })}
                                            disabled={asientosLibres <= 0}
                                            className={`p-3 rounded-lg border transition-all text-left ${
                                                asientosLibres <= 0
                                                    ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
                                                    : 'bg-gray-800 border-gray-600 hover:border-blue-500 hover:bg-gray-750'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                                <span className="font-medium text-white">{funcion.horario}</span>
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-green-400 font-semibold">€{funcion.precio}</div>
                                                <div className={`${disponibilidad.color} text-xs`}>
                                                    {disponibilidad.text}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {asientosLibres} libres
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
