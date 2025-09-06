"use client";

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onClear }) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                onSearch(searchTerm.trim());
            } else {
                onClear();
            }
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [searchTerm, onSearch, onClear]);

    const handleClear = () => {
        setSearchTerm('');
        onClear();
    };

    return (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar películas..."
                        className="w-full px-4 py-3 pl-12 pr-12 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="text-center mt-2">
                        <span className="text-sm text-gray-400">
                            Buscando: "{searchTerm}"
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
