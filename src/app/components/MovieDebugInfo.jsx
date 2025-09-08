"use client";

import React from 'react';

export default function MovieDebugInfo() {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const handleCheckConsole = () => {
        console.log('🔧 DEBUG: Revisa la consola para ver los logs de películas y funciones');
        alert('Revisa la consola del navegador (F12) para ver los logs de debug');
    };

    return (
        <div className="bg-blue-100 border border-blue-400 p-3 rounded mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-blue-800 text-sm">🔧 DEBUG MODE - Console Logs Active</h3>
                    <p className="text-xs text-blue-700">Los IDs de películas y funciones se están logueando en la consola</p>
                </div>
                <button 
                    onClick={handleCheckConsole}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                    Ver Consola
                </button>
            </div>
        </div>
    );
}
