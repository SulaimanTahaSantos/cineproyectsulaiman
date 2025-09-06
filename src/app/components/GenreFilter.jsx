"use client";

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

export default function GenreFilter({ onGenreChange, selectedGenre }) {
    const [genres, setGenres] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTEwNGFiNGJhOTMxOWZjZTNmNjE5MjUxOWUyYzU2MiIsIm5iZiI6MTc0Nzc2MDIwOC44MzcsInN1YiI6IjY4MmNiNDUwNTIxMWE5MTRmMjhjMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.neOHz3fEzVRWUHM25S9GXs6JyIbp3rULJuaV_fuPjmg";
    const BASE_URL = "https://api.themoviedb.org/3";

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${BASE_URL}/genre/movie/list?language=es-ES`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener géneros');
            }

            const data = await response.json();
            setGenres(data.genres);
        } catch (error) {
            console.error("Error al cargar géneros:", error);
        }
    };

    const handleGenreSelect = (genreId) => {
        onGenreChange(genreId);
        setIsOpen(false);
    };

    const selectedGenreName = genres.find(g => g.id === selectedGenre)?.name || 'Todos los géneros';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
            >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{selectedGenreName}</span>
                <span className="sm:hidden">Filtrar</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <button
                        onClick={() => handleGenreSelect(null)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                            !selectedGenre ? 'bg-blue-600 text-white' : 'text-gray-300'
                        }`}
                    >
                        Todos los géneros
                    </button>
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => handleGenreSelect(genre.id)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                                selectedGenre === genre.id ? 'bg-blue-600 text-white' : 'text-gray-300'
                            }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
