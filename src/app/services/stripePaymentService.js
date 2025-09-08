import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../../lib/supabase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

class StripePaymentService {
    constructor() {
        this.stripe = null;
        this.initialize();
    }

    async initialize() {
        this.stripe = await stripePromise;
    }

    async crearSesionPago(reservaData) {
        try {
            const response = await fetch('/api/create-payment-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reserva: reservaData,
                    success_url: `${window.location.origin}/reserva-exitosa?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.location.origin}/reserva-cancelada`,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la sesión de pago');
            }

            const session = await response.json();

            return session;
        } catch (error) {
            console.error('❌ Error al crear sesión de pago:', error);
            throw error;
        }
    }

    async redirigirACheckout(sessionId) {
        try {
            if (!this.stripe) {
                await this.initialize();
            }

            const { error } = await this.stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (error) {
                console.error('Error al redirigir a checkout:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error en redirección a checkout:', error);
            throw error;
        }
    }

    async procesarReservaConPago(funcionId, asientos, userData, precioTotalCalculado = null) {
        try {
            const { data: funcion, error: funcionError } = await supabase
                .from('funciones')
                .select(`
                    *,
                    salas (nombre, capacidad)
                `)
                .eq('id', funcionId)
                .single();

            if (funcionError) throw funcionError;

            const totalAsientos = asientos.length;
            const precioTotal = precioTotalCalculado || (funcion.precio * totalAsientos);
            const asientosIds = asientos.map(asiento => 
                typeof asiento === 'object' && asiento.id ? asiento.id : asiento
            );
            
            const reservaData = {
                funcion_id: funcionId,
                user_id: userData.id,
                asientos_seleccionados: asientosIds,
                total_asientos: totalAsientos,
                precio_total: precioTotal,
                estado: 'pendiente_pago',
                pelicula_id: funcion.pelicula_id,
                sala_nombre: funcion.salas?.nombre || 'Sala desconocida',
                fecha: funcion.fecha,
                hora: funcion.hora,
                email: userData.email,
                nombre: userData.user_metadata?.full_name || userData.email,
            };

            const session = await this.crearSesionPago(reservaData);

            const nombreCliente = userData.user_metadata?.full_name || 
                                 userData.user_metadata?.name || 
                                 userData.email?.split('@')[0] || 
                                 'Cliente';
            
            
            const { data: reserva, error: reservaError } = await supabase
                .from('reservas')
                .insert({
                    funcion_id: funcionId,
                    user_id: userData.id,
                    nombre_cliente: nombreCliente,
                    email_cliente: userData.email,
                    asientos_seleccionados: asientosIds,
                    total_asientos: totalAsientos,
                    precio_total: precioTotal,
                    estado: 'pendiente_pago',
                    stripe_session_id: session.id,
                    estado_pago: 'pendiente',
                })
                .select()
                .single();

            if (reservaError) throw reservaError;


            try {
                const pagoResponse = await fetch('/api/create-payment-record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reserva_id: reserva.id,
                        stripe_payment_intent_id: session.payment_intent,
                        stripe_session_id: session.id,
                        cantidad: precioTotal,
                        estado: 'pendiente',
                        descripcion: `Reserva para ${funcion.salas?.nombre || 'Sala'} - ${totalAsientos} asientos`,
                    }),
                });

                if (!pagoResponse.ok) {
                    const errorText = await pagoResponse.text();
                    console.error(' Error al crear registro de pago:', errorText);
                    console.warn(' Reserva creada pero sin registro de pago detallado');
                }
            } catch (pagoError) {
                console.error('Error al crear registro de pago:', pagoError);
                console.warn(' Reserva creada pero sin registro de pago detallado');
            }

            await this.redirigirACheckout(session.id);

            return {
                reserva_id: reserva.id,
                session_id: session.id,
                total: precioTotal,
            };

        } catch (error) {
            console.error('❌ Error al procesar reserva con pago:', error);
            throw error;
        }
    }

    async verificarEstadoPago(sessionId) {
        try {

            const response = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session_id: sessionId }),
            });

            if (!response.ok) {
                throw new Error('Error al verificar el pago');
            }

            const result = await response.json();

            return result;
        } catch (error) {
            console.error('❌ Error al verificar pago:', error);
            throw error;
        }
    }

    async obtenerMetodosPago(userId) {
        try {
            const { data, error } = await supabase
                .from('metodos_pago')
                .select('*')
                .eq('user_id', userId)
                .eq('activo', true)
                .order('es_predeterminado', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('❌ Error al obtener métodos de pago:', error);
            throw error;
        }
    }

    formatearPrecio(precio, moneda = 'EUR') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: moneda,
            minimumFractionDigits: 2,
        }).format(precio);
    }
}

const stripePaymentService = new StripePaymentService();
export default stripePaymentService;
