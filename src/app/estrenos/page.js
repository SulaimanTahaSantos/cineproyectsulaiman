"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Star, Clock } from 'lucide-react';

export default function EstrenosPage() {
    const [estrenos, setEstrenos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTEwNGFiNGJhOTMxOWZjZTNmNjE5MjUxOWUyYzU2MiIsIm5iZiI6MTc0Nzc2MDIwOC44MzcsInN1YiI6IjY4MmNiNDUwNTIxMWE5MTRmMjhjMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.neOHz3fEzVRWUHM25S9GXs6JyIbp3rULJuaV_fuPjmg";
    const BASE_URL = "https://api.themoviedb.org/3";

    useEffect(() => {
        fetchEstrenos();
    }, []);

    const fetchEstrenos = async () => {
        try {
            const response = await fetch(`${BASE_URL}/movie/upcoming?language=es-ES&page=1`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener estrenos');
            }

            const data = await response.json();
            setEstrenos(data.results);
        } catch (error) {
            console.error("Error al cargar estrenos:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getDaysUntilRelease = (releaseDate) => {
        const today = new Date();
        const release = new Date(releaseDate);
        const diffTime = release - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Cargando próximos estrenos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p className="text-xl mb-4">Error al cargar los estrenos</p>
                    <p>{error}</p>
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
                            Próximos Estrenos
                        </h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                            Descubre las películas que próximamente llegarán a los cines
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid gap-8 md:gap-6">
                    {estrenos.map((movie) => {
                        const daysUntilRelease = getDaysUntilRelease(movie.release_date);
                        const isAlreadyReleased = daysUntilRelease < 0;
                        
                        return (
                            <div
                                key={movie.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                <div className="md:flex">
                                    {/* Poster */}
                                    <div className="md:w-64 md:flex-shrink-0">
                                        <div className="aspect-[2/3] md:h-80">
                                            <Image
                                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/vercel.svg'}
                                                alt={movie.title}
                                                width={500}
                                                height={750}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6 md:flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                {movie.title}
                                            </h2>
                                            <div className="flex items-center gap-1 bg-yellow-500 px-2 py-1 rounded-lg">
                                                <Star className="w-4 h-4 text-yellow-900" />
                                                <span className="text-yellow-900 font-semibold text-sm">
                                                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Calendar className="w-5 h-5" />
                                                <span className="font-medium">
                                                    {formatDate(movie.release_date)}
                                                </span>
                                            </div>
                                            
                                            {!isAlreadyReleased && (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <Clock className="w-5 h-5" />
                                                    <span className="font-medium">
                                                        {daysUntilRelease === 0 ? '¡Hoy!' : 
                                                         daysUntilRelease === 1 ? 'Mañana' : 
                                                         `${daysUntilRelease} días`}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {isAlreadyReleased && (
                                                <div className="bg-green-600 px-3 py-1 rounded-full">
                                                    <span className="text-white text-sm font-medium">
                                                        Ya en cines
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                            {movie.overview || 'Sin sinopsis disponible.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
