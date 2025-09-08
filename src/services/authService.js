import { supabase } from '../lib/supabase'

// Registrar nuevo usuario
export async function signUp(email, password, fullName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        throw error
    }
}

// Iniciar sesión
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        throw error
    }
}

// Cerrar sesión
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw error
    }
}

// Obtener usuario actual
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error al obtener usuario actual:', error)
        return null
    }
}

// Obtener sesión actual
export async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    } catch (error) {
        console.error('Error al obtener sesión actual:', error)
        return null
    }
}

// Listener para cambios de autenticación
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
    })
}

// Resetear contraseña
export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) throw error
    } catch (error) {
        console.error('Error al resetear contraseña:', error)
        throw error
    }
}
