"use client";

import { useEffect } from 'react';
import React from 'react';
import { X, Play } from 'lucide-react';


export default function TrailerModal({ isOpen, onClose, videoKey, movieTitle }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; 
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen || !videoKey) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative z-10 w-full max-w-4xl mx-4">
                <div className="flex justify-between items-center mb-4 text-white">
                    <div className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-red-500" />
                        <h2 className="text-xl font-bold">{movieTitle} - Trailer</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                    <div className="aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                            title={`${movieTitle} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </div>
                
                <div className="text-center mt-4 text-gray-400 text-sm">
                    Presiona ESC o haz clic fuera del video para cerrar
                </div>
            </div>
        </div>
    );
}
