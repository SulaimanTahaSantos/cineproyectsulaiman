"use client";

import React, { useState, useEffect } from 'react';
export function Peliculas({ onMovieClick, isCompact = false, mostrarFavoritos = false, searchTerm = '', selectedGenre = null }) {

    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const BASE_URL = "https://api.themoviedb.org/3/"
    const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTEwNGFiNGJhOTMxOWZjZTNmNjE5MjUxOWUyYzU2MiIsIm5iZiI6MTc0Nzc2MDIwOC44MzcsInN1YiI6IjY4MmNiNDUwNTIxMWE5MTRmMjhjMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.neOHz3fEzVRWUHM25S9GXs6JyIbp3rULJuaV_fuPjmg"
    
    async function fetchPeliculas() {
        try {
            let url;
            
            if (searchTerm) {
                // Búsqueda de películas
                url = `${BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&language=es-ES&page=${page}`;
            } else if (selectedGenre) {
                // Filtrar por género
                url = `${BASE_URL}/discover/movie?with_genres=${selectedGenre}&language=es-ES&page=${page}&sort_by=popularity.desc`;
            } else {
                // Películas populares por defecto
                url = `${BASE_URL}/movie/popular?language=es-ES&page=${page}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }

            const data = await response.json();
            console.log(data);
            setPeliculas(data.results);
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function cargarFavoritos() {
        try {
            const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            setPeliculas(favoritos);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
            setError("Error al cargar las películas favoritas");
            setLoading(false);
        }
    }


    useEffect(() => {
        setLoading(true);
        setPage(1); // Reset page when search/filter changes
        if (mostrarFavoritos) {
            cargarFavoritos();
        } else {
            fetchPeliculas();
        }
    }, [mostrarFavoritos, searchTerm, selectedGenre]);    return (
        <div className="h-full bg-gray-900 p-4 overflow-y-auto">
            <div className="max-w-full">
                <h1 className="text-white text-2xl font-bold mb-6 text-center">
                    {mostrarFavoritos ? 'Mis Películas Favoritas' : 
                     searchTerm ? `Resultados para: "${searchTerm}"` :
                     selectedGenre ? 'Películas por Género' :
                     'Películas Populares'}
                </h1>
                
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                    </div>
                )}
                
                {error && (
                    <div className="text-center text-red-500 p-8">
                        <p>Error: {error}</p>
                    </div>
                )}
                
                {!loading && !error && peliculas.length === 0 && mostrarFavoritos && (
                    <div className="text-center text-gray-400 p-8">
                        <p>No tienes películas favoritas aún.</p>
                        <p>¡Agrega algunas desde los detalles de las películas!</p>
                    </div>
                )}
                
                {!loading && !error && peliculas.length === 0 && (searchTerm || selectedGenre) && !mostrarFavoritos && (
                    <div className="text-center text-gray-400 p-8">
                        <p>No se encontraron películas para tu búsqueda.</p>
                        <p>Intenta con otros términos o filtros.</p>
                    </div>
                )}
                
                {!loading && !error && peliculas.length > 0 && (
                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
                        {peliculas.map((movie) => (
                        <div
                            key={movie.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform cursor-pointer"
                            onClick={() => onMovieClick(movie.id)}
                        >                            <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-600 relative">
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/vercel.svg'}
                                    alt={movie.title || 'Imagen de película'}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div><div className="p-3">
                                <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2">{movie.title}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="text-yellow-400 text-xs font-medium">
                                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                    </span>
                                    <span className="text-gray-500 text-xs">({movie.release_date || 'N/A'})</span>
                                </div>
                            </div>
                        </div>                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}