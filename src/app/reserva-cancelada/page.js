"use client";

import React from 'react';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function ReservaCanceladaPage() {
    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="max-w-md mx-auto px-4 text-center">
                {/* Icono de cancelación */}
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-white" />
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    Reserva Cancelada
                </h1>

                {/* Descripción */}
                <p className="text-gray-300 text-lg mb-8">
                    Tu reserva ha sido cancelada. No se ha realizado ningún cargo a tu tarjeta.
                </p>

                {/* Información adicional */}
                <div className="bg-gray-800 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <p className="text-white font-medium">¿Qué pasó?</p>
                    </div>
                    <div className="text-gray-300 text-sm text-left space-y-2">
                        <p>• Cancelaste el proceso de pago</p>
                        <p>• Los asientos que seleccionaste están nuevamente disponibles</p>
                        <p>• No se realizó ningún cargo</p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                    <Link 
                        href="/" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a seleccionar película
                    </Link>

                    <Link 
                        href="/contacto" 
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg inline-block transition-colors"
                    >
                        ¿Necesitas ayuda?
                    </Link>
                </div>

                {/* Mensaje adicional */}
                <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                        💡 <strong>Tip:</strong> Las entradas populares se agotan rápido. 
                        ¡Completa tu reserva pronto para asegurar tus asientos!
                    </p>
                </div>
            </div>
        </div>
    );
}
