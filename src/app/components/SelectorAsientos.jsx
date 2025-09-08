"use client";

import React, { useState, useEffect } from 'react';
import { User, X, Check, Armchair, Crown, Ban, CreditCard, Loader2 } from 'lucide-react';
import stripePaymentService from '../services/stripePaymentService';
import { useAuth } from '../../contexts/AuthContext';

export default function SelectorAsientos({ funcionData, onConfirm, onCancel }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatMap, setSeatMap] = useState([]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (funcionData) {
            generateSeatMap();
        }
    }, [funcionData]);

    const generateSeatMap = () => {
        const { sala, asientosOcupados } = funcionData;
        const rows = Math.ceil(sala.capacidad / 10); 
        const seatsPerRow = 10;
        const map = [];

        for (let row = 0; row < rows; row++) {
            const rowSeats = [];
            const rowLetter = String.fromCharCode(65 + row); 
            
            for (let seat = 1; seat <= seatsPerRow; seat++) {
                const seatId = `${rowLetter}${seat}`;
                const isOccupied = Math.random() < (asientosOcupados / sala.capacidad);
                
                rowSeats.push({
                    id: seatId,
                    row: rowLetter,
                    number: seat,
                    isOccupied,
                    isSelected: false,
                    isPremium: row < 3, 
                });
            }
            map.push(rowSeats);
        }
        setSeatMap(map);
    };

    const toggleSeat = (rowIndex, seatIndex) => {
        const seat = seatMap[rowIndex][seatIndex];
        if (seat.isOccupied) return;

        const newSeatMap = [...seatMap];
        const isCurrentlySelected = seat.isSelected;
        
        newSeatMap[rowIndex][seatIndex] = {
            ...seat,
            isSelected: !isCurrentlySelected
        };

        setSeatMap(newSeatMap);

        if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats(prev => [...prev, seat]);
        }
    };

    const getSeatPrice = (seat) => {
        const basePrice = funcionData.precio;
        return seat.isPremium ? basePrice + 50 : basePrice;
    };

    const getTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
    };

    const getSeatIcon = (seat) => {
        if (seat.isOccupied) return <Ban className="w-5 h-5" />;
        if (seat.isSelected) return <Check className="w-5 h-5" />;
        return seat.isPremium ? <Crown className="w-5 h-5" /> : <Armchair className="w-5 h-5" />;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePaymentProcess = async () => {
        if (!user) {
            setPaymentError('Debes iniciar sesión para realizar una reserva');
            return;
        }

        if (selectedSeats.length === 0) {
            setPaymentError('Debes seleccionar al menos un asiento');
            return;
        }

        setIsProcessingPayment(true);
        setPaymentError(null);

        try {
            console.log('🔄 Iniciando proceso de pago...');
            console.log('🎫 Función ID:', funcionData.id);
            console.log('👤 Usuario completo:', user);
            console.log('👤 Usuario ID:', user?.id);
            console.log('👤 Usuario email:', user?.email);
            console.log('👤 Usuario user_metadata:', user?.user_metadata);
            console.log('👤 Usuario app_metadata:', user?.app_metadata);
            console.log('💺 Asientos seleccionados:', selectedSeats.map(seat => seat.id));
            console.log('💰 Total:', getTotalPrice());
            
            if (!user || !user.id || !user.email) {
                throw new Error('Usuario no autenticado correctamente');
            }
            
            // Preparar datos de asientos con información de premium
            const asientosDetalle = selectedSeats.map(seat => ({
                id: seat.id,
                isPremium: seat.isPremium,
                precio: getSeatPrice(seat)
            }));
            
            console.log('💺 Detalle de asientos:', asientosDetalle);
            
            // Usar el método correcto que crea la reserva Y procesa el pago
            const result = await stripePaymentService.procesarReservaConPago(
                funcionData.id,
                asientosDetalle,
                user,
                getTotalPrice() // Pasar el precio total calculado
            );
            
            console.log('✅ Proceso de reserva iniciado:', result);
            
            // El método procesarReservaConPago ya redirige automáticamente a Stripe
            // No necesitamos hacer nada más aquí
            
        } catch (error) {
            console.error('❌ Error al procesar pago:', error);
            setPaymentError(error.message || 'Error al procesar el pago. Inténtalo de nuevo.');
            setIsProcessingPayment(false);
        }
    };

    if (!funcionData) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {funcionData.movie.title}
              </h2>
              <p className="text-gray-400">
                {funcionData.sala.nombre} • {formatDate(funcionData.fecha)} •{" "}
                {funcionData.horario}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-t-3xl p-2 mx-auto max-w-xs mb-2">
                <span className="text-white text-sm font-medium">PANTALLA</span>
              </div>
              <div className="text-xs text-gray-400">
                Mejor vista desde el centro
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                {seatMap.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center items-center mb-2"
                  >
                    <span className="text-gray-400 text-sm w-8 text-center">
                      {row[0]?.row}
                    </span>
                    <div className="flex gap-1 mx-4">
                      {row.map((seat, seatIndex) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(rowIndex, seatIndex)}
                          disabled={seat.isOccupied}
                          className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${
                            seat.isOccupied
                              ? "bg-red-600 cursor-not-allowed"
                              : seat.isSelected
                              ? "bg-green-600 text-white scale-110"
                              : seat.isPremium
                              ? "bg-yellow-600 hover:bg-yellow-500 text-black"
                              : "bg-gray-600 hover:bg-gray-500 text-white"
                          }`}
                          title={`Asiento ${seat.id} - €${getSeatPrice(seat)} ${
                            seat.isPremium ? "(Premium)" : ""
                          }`}
                        >
                          {getSeatIcon(seat)}
                        </button>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm w-8 text-center">
                      {row[0]?.row}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center">
                  <Armchair className="w-5 h-5" />
                </div>
                <span className="text-gray-300">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-600 rounded-md flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <span className="text-gray-300">Premium (+€50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-gray-300">Seleccionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
                <span className="text-gray-300">Ocupado</span>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">
                  Resumen de tu compra
                </h3>
                <div className="space-y-2">
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        Asiento {seat.id} {seat.isPremium ? "(Premium)" : ""}
                      </span>
                      <span className="text-green-400">
                        €{getSeatPrice(seat)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                    <span className="text-white">
                      Total ({selectedSeats.length} asientos)
                    </span>
                    <span className="text-green-400">€{getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg">
                <p className="text-red-400 text-sm">{paymentError}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onCancel}
                disabled={isProcessingPayment}
                className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePaymentProcess}
                disabled={selectedSeats.length === 0 || isProcessingPayment}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pagar €{getTotalPrice()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
