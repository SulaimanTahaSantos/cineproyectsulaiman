import { supabase } from '../lib/supabase'
import { getCurrentUser } from './authService'

// Obtener favoritos del usuario autenticado
export async function getFavoritos() {
    try {
        const user = await getCurrentUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('favoritos')
            .select('tmdb_movie_id')
            .eq('user_id', user.id)

        if (error) throw error
        return data.map(item => item.tmdb_movie_id)
    } catch (error) {
        console.error('Error al obtener favoritos:', error)
        return []
    }
}

// Agregar película a favoritos
export async function agregarFavorito(tmdbMovieId) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Usuario no autenticado')

        const { data, error } = await supabase
            .from('favoritos')
            .upsert([{
                tmdb_movie_id: tmdbMovieId,
                user_id: user.id
            }])
            .select()

        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Error al agregar favorito:', error)
        throw error
    }
}
// Quitar película de favoritos
export async function quitarFavorito(tmdbMovieId) {
    try {
        const user = await getCurrentUser()
        if (!user) throw new Error('Usuario no autenticado')

        const { error } = await supabase
            .from('favoritos')
            .delete()
            .eq('tmdb_movie_id', tmdbMovieId)
            .eq('user_id', user.id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error al quitar favorito:', error)
        throw error
    }
}

// Verificar si una película es favorita
export async function esFavorito(tmdbMovieId) {
    try {
        const user = await getCurrentUser()
        if (!user) return false

        const { data, error } = await supabase
            .from('favoritos')
            .select('id')
            .eq('tmdb_movie_id', tmdbMovieId)
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return !!data
    } catch (error) {
        console.error('Error al verificar favorito:', error)
        return false
    }
}
