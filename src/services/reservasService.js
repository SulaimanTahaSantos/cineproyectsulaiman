import { supabase } from '../lib/supabase'

export async function getSalas() {
    try {
        const { data, error } = await supabase
            .from('salas')
            .select('*')
            .order('id')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al obtener salas:', error)
        throw error
    }
}

export async function getFunciones(tmdbMovieId) {
    try {
        const { data, error } = await supabase
            .from('funciones')
            .select(`
                *,
                salas (
                    id,
                    nombre,
                    capacidad,
                    tipo
                )
            `)
            .eq('tmdb_movie_id', tmdbMovieId)
            .order('fecha')
            .order('horario')

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al obtener funciones:', error)
        throw error
    }
}

export async function crearReserva(reservaData) {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .insert([{
                nombre_cliente: reservaData.nombreCliente,
                email_cliente: reservaData.emailCliente,
                telefono_cliente: reservaData.telefonoCliente,
                funcion_id: reservaData.funcionId,
                asientos_seleccionados: reservaData.asientosSeleccionados,
                precio_total: reservaData.precioTotal,
                estado: 'confirmada'
            }])
            .select()

        if (error) throw error

        // Actualizar asientos ocupados en la función
        const { data: funcionActual, error: getFunctionError } = await supabase
            .from('funciones')
            .select('asientos_ocupados')
            .eq('id', reservaData.funcionId)
            .single()

        if (getFunctionError) throw getFunctionError

        const nuevosAsientosOcupados = funcionActual.asientos_ocupados + reservaData.asientosSeleccionados.length

        const { error: updateError } = await supabase
            .from('funciones')
            .update({ 
                asientos_ocupados: nuevosAsientosOcupados
            })
            .eq('id', reservaData.funcionId)

        if (updateError) throw updateError

        return data[0]
    } catch (error) {
        console.error('Error al crear reserva:', error)
        throw error
    }
}

export async function getReservasPorEmail(email) {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select(`
                *,
                funciones (
                    *,
                    salas (
                        nombre,
                        tipo
                    )
                )
            `)
            .eq('email_cliente', email)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error al obtener reservas:', error)
        throw error
    }
}
export async function cancelarReserva(reservaId) {
    try {
        const { data: reserva, error: getError } = await supabase
            .from('reservas')
            .select('funcion_id, asientos_seleccionados')
            .eq('id', reservaId)
            .single()

        if (getError) throw getError

        const { error: cancelError } = await supabase
            .from('reservas')
            .update({ estado: 'cancelada' })
            .eq('id', reservaId)

        if (cancelError) throw cancelError

        // Liberar los asientos en la función
        const { data: funcionActual, error: getFunctionError } = await supabase
            .from('funciones')
            .select('asientos_ocupados')
            .eq('id', reserva.funcion_id)
            .single()

        if (getFunctionError) throw getFunctionError

        const nuevosAsientosOcupados = Math.max(0, funcionActual.asientos_ocupados - reserva.asientos_seleccionados.length)

        const { error: updateError } = await supabase
            .from('funciones')
            .update({ 
                asientos_ocupados: nuevosAsientosOcupados
            })
            .eq('id', reserva.funcion_id)

        if (updateError) throw updateError

        return true
    } catch (error) {
        console.error('Error al cancelar reserva:', error)
        throw error
    }
}
