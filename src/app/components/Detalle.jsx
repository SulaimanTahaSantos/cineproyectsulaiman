"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TrailerModal from './TrailerModal';

export default function Detalle({ movieId, onClose, onFavoritoAgregado }) {    
    const BASE_URL = "https://api.themoviedb.org/3"
    const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTEwNGFiNGJhOTMxOWZjZTNmNjE5MjUxOWUyYzU2MiIsIm5iZiI6MTc0Nzc2MDIwOC44MzcsInN1YiI6IjY4MmNiNDUwNTIxMWE5MTRmMjhjMGQ4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.neOHz3fEzVRWUHM25S9GXs6JyIbp3rULJuaV_fuPjmg"
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);    
    async function fetchDetalle() {
        try {
            const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=videos,credits`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la película');
            }

            const data = await response.json();
            setDetalle(data);
            
            const videos = data.videos?.results || [];
            const trailer = videos.find(video => 
                video.type === 'Trailer' && 
                video.site === 'YouTube'
            );
            
            if (trailer) {
                setTrailerKey(trailer.key);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }    
    useEffect(() => {
        if (movieId) {
            fetchDetalle();
        }
    }, [movieId]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setShowTrailer(false);
            }
        };

        if (showTrailer) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showTrailer]);

    const handleWatchTrailer = () => {
        if (trailerKey) {
            setShowTrailer(true);
        } else {
            alert('No hay trailer disponible para esta película');
        }
    };       
    const cast = detalle?.credits?.cast?.map(actor => ({
        name: actor.name,
        character: actor.character,
        image: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "vercel.svg"
    })) || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                    <p className="mt-4">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>                   
                     <button 
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!detalle) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>No se encontraron detalles de la película</p>
            </div>
        );
    }        const favoritos = () => {
        const peliculasFavoritas = JSON.parse(localStorage.getItem('favoritos')) || [];
        if (!peliculasFavoritas.some(fav => fav.id === detalle.id)) {
            peliculasFavoritas.push({
                id: detalle.id,
                title: detalle.title,
                poster_path: detalle.poster_path,
                backdrop_path: detalle.backdrop_path,
                overview: detalle.overview,
                release_date: detalle.release_date,
                vote_average: detalle.vote_average,
                genres: detalle.genres
            });
            localStorage.setItem('favoritos', JSON.stringify(peliculasFavoritas));
            alert("Película añadida a favoritos");
            if (onFavoritoAgregado) {
                onFavoritoAgregado();
            }
        } else {
            alert("Esta película ya está en favoritos");
        }
    }
    
    return (
        <>
            <div className="h-screen bg-black text-white overflow-y-auto relative">
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={onClose}
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                >
                  Cerrar
                </button>
              </div>          <div className="relative h-64 overflow-hidden">
                <Image 
                    src={detalle.backdrop_path ? `https://image.tmdb.org/t/p/w1280${detalle.backdrop_path}` : "vercel.svg"} 
                    alt={detalle.title || "Imagen de fondo"} 
                    fill 
                    className="object-cover" 
                    priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
               <div className="px-4 -mt-16 relative z-10">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-3">{detalle.title}</h1>
                  <div className="flex gap-2 mb-4">
                    <button onClick={favoritos} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors text-sm">
                      Añadir a Favoritos
                    </button>
                    <button 
                      onClick={handleWatchTrailer}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                        trailerKey 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!trailerKey}
                    >
                      {trailerKey ? 'Ver Trailer' : 'Sin Trailer'}
                    </button>
                  </div>
                </div>
        
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Sinopsis</h2>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {detalle.overview || "No hay sinopsis disponible"}
                  </p>
                </div>
        
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Géneros</h2>
                  <div className="flex gap-2 flex-wrap">
                    {detalle.genres?.map((genre, index) => (
                      <span key={index} className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
        
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Fecha de Estreno</h3>
                    <p className="text-gray-300 text-sm">{detalle.release_date || "No disponible"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Duración</h3>
                    <p className="text-gray-300 text-sm">{detalle.runtime || "No disponible"} min</p>
                  </div>
                </div>
            
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-4">Reparto</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {cast.map((actor, index) => (
                          <div key={index} className="text-center">
                            <div className="relative mb-2 overflow-hidden rounded-lg">
                              <Image
                                src={actor.image}
                                alt={actor.name}
                                width={200}
                                height={400}
                                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <p className="text-xs font-medium">{actor.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <TrailerModal
                  isOpen={showTrailer}
                  onClose={() => setShowTrailer(false)}
                  videoKey={trailerKey}
                  movieTitle={detalle?.title}
                />
        </>
    )
}