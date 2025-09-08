"use client";
import { useState } from "react";
import { Peliculas } from "./Peliculas";
import Detalle from "./Detalle";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";
import MovieDebugInfo from "./MovieDebugInfo";

export default function MovieExplorer() {
    const [seleccionarIdPelicula, setseleccionarIdPelicula] = useState(null);
    const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
    const [actualizarFavoritos, setActualizarFavoritos] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);

    const handleMovieClick = (movieId) => {
        setseleccionarIdPelicula(movieId);
    };

    const handleCloseDetails = () => {
        setseleccionarIdPelicula(null);
    };

    const handleFavoritoAgregado = () => {
        setActualizarFavoritos(prev => prev + 1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setMostrarFavoritos(false);
        setSelectedGenre(null);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        setMostrarFavoritos(false);
        setSearchTerm('');
        if (genreId !== selectedGenre) {
            setseleccionarIdPelicula(null);
        }
    };

    const handleShowFavorites = () => {
        setMostrarFavoritos(true);
        setSearchTerm('');
        setSelectedGenre(null);
        setseleccionarIdPelicula(null);
    };

    const handleShowPopular = () => {
        setMostrarFavoritos(false);
        setSearchTerm('');
        setSelectedGenre(null);
        setseleccionarIdPelicula(null);
    };return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {!mostrarFavoritos && <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />}
            
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={handleShowPopular}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                !mostrarFavoritos && !searchTerm && !selectedGenre
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Películas Populares
                        </button>
                        <button
                            onClick={handleShowFavorites}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                mostrarFavoritos 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Mis Favoritos
                        </button>
                    </div>
                    
                    {!mostrarFavoritos && (
                        <GenreFilter 
                            onGenreChange={handleGenreChange} 
                            selectedGenre={selectedGenre}
                        />
                    )}
                </div>
            </div>
            
            <div className="flex flex-1">               
                <div className={`transition-all duration-300 ${seleccionarIdPelicula ? 'w-1/2' : 'w-full'}`}>
                    <MovieDebugInfo />
                    <Peliculas 
                        onMovieClick={handleMovieClick} 
                        isCompact={seleccionarIdPelicula !== null}
                        mostrarFavoritos={mostrarFavoritos}
                        searchTerm={searchTerm}
                        selectedGenre={selectedGenre}
                        key={`${mostrarFavoritos}-${actualizarFavoritos}-${searchTerm}-${selectedGenre}`}
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
  