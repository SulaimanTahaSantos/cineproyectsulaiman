// Utilidad para crear clientes de Supabase en el servidor
import { createClient } from '@supabase/supabase-js';

/**
 * Crea un cliente de Supabase con la clave anónima
 * Se inicializa solo cuando se llama para evitar errores de build
 */
export function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }
    
    return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Crea un cliente de Supabase con privilegios de servicio (bypassa RLS)
 * Se inicializa solo cuando se llama para evitar errores de build
 */
export function createSupabaseServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase service environment variables');
    }
    
    return createClient(supabaseUrl, supabaseServiceKey);
}
