/**
 * Utilidades comunes para la aplicación
 */

/**
 * Obtiene la URL base de la aplicación
 * En el servidor, usa la variable de entorno
 * En el cliente, usa window.location.origin
 * @param {Request} request - Request object (opcional, para server-side)
 * @returns {string} URL base
 */
export function getBaseUrl(request = null) {
    // Si estamos en el cliente
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    // Si estamos en el servidor
    if (request) {
        const url = new URL(request.url);
        return url.origin;
    }
    
    // Variables de entorno como fallback
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    
    // Vercel provides these automatically
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    // Fallback para desarrollo
    return 'http://localhost:3000';
}

/**
 * Crea URLs de éxito y cancelación para Stripe
 * @param {Request} request - Request object
 * @returns {Object} URLs de éxito y cancelación
 */
export function getStripeUrls(request) {
    const baseUrl = getBaseUrl(request);
    return {
        success_url: `${baseUrl}/reserva-exitosa?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/reserva-cancelada`
    };
}
