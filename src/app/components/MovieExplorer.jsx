"use client";
import { useState } from "react";
import { Peliculas } from "./Peliculas";
import Detalle from "./Detalle";

export default function MovieExplorer() {
    const [seleccionarIdPelicula, setseleccionarIdPelicula] = useState(null);
    const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
    const [actualizarFavoritos, setActualizarFavoritos] = useState(0);

    const handleMovieClick = (movieId) => {
        setseleccionarIdPelicula(movieId);
    };

    const handleCloseDetails = () => {
        setseleccionarIdPelicula(null);
    };

    const handleFavoritoAgregado = () => {
        // Forzar actualización de la lista de favoritos
        setActualizarFavoritos(prev => prev + 1);
    };return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Botones de navegación */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => setMostrarFavoritos(false)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            !mostrarFavoritos 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Películas Populares
                    </button>
                    <button
                        onClick={() => setMostrarFavoritos(true)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            mostrarFavoritos 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Mis Favoritos
                    </button>
                </div>
            </div>
            
            {/* Contenido principal */}
            <div className="flex flex-1">                <div className={`transition-all duration-300 ${seleccionarIdPelicula ? 'w-1/2' : 'w-full'}`}>
                    <Peliculas 
                        onMovieClick={handleMovieClick} 
                        isCompact={seleccionarIdPelicula !== null}
                        mostrarFavoritos={mostrarFavoritos}
                        key={`${mostrarFavoritos}-${actualizarFavoritos}`}
                    />
                </div>
                
                {seleccionarIdPelicula && (
                    <div className="w-1/2 border-l border-gray-700 transition-all duration-300">
                        <Detalle 
                            movieId={seleccionarIdPelicula} 
                            onClose={handleCloseDetails}
                            onFavoritoAgregado={handleFavoritoAgregado}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
  