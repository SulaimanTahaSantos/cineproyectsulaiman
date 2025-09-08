import { supabase } from '../lib/supabase'

// Script para insertar funciones de ejemplo
// Ejecutar una vez para poblar la base de datos

const peliculasPopulares = [
    550988, // "Poppa's House"
    558449, // "Gladiator II"
    1184918, // "The Wild Robot"
    533535, // "Deadpool & Wolverine"
    1064213, // "Spellbound"
    1100782, // "Smile 2"
    698687, // "Transformers One"
    1035048, // "Red One"
    912649, // "Venom: The Last Dance"
    1226578, // "Longlegs"
]

const generateFunciones = () => {
    const funciones = []
    const today = new Date()
    
    // Generar funciones para los próximos 7 días
    for (let day = 0; day < 7; day++) {
        const fecha = new Date(today)
        fecha.setDate(today.getDate() + day)
        
        // Para cada película popular
        peliculasPopulares.forEach(movieId => {
            // 2-3 funciones por día por película
            const funcionesPorDia = Math.floor(Math.random() * 2) + 2
            
            for (let func = 0; func < funcionesPorDia; func++) {
                const horarios = ['14:00', '16:30', '19:00', '21:30', '00:00']
                const precios = [8.50, 10.50, 12.50, 15.00]
                const salas = [1, 2, 3, 4]
                
                funciones.push({
                    tmdb_movie_id: movieId,
                    sala_id: salas[Math.floor(Math.random() * salas.length)],
                    fecha: fecha.toISOString().split('T')[0],
                    horario: horarios[Math.floor(Math.random() * horarios.length)],
                    precio: precios[Math.floor(Math.random() * precios.length)],
                    asientos_ocupados: Math.floor(Math.random() * 20) // Entre 0 y 20 asientos ocupados
                })
            }
        })
    }
    
    return funciones
}

export async function insertarFuncionesEjemplo() {
    try {
        const funciones = generateFunciones()
        
        const { data, error } = await supabase
            .from('funciones')
            .insert(funciones)
            .select()

        if (error) throw error
        
        console.log(`Insertadas ${data.length} funciones de ejemplo`)
        return data
    } catch (error) {
        console.error('Error al insertar funciones:', error)
        throw error
    }
}

// Solo ejecutar en desarrollo
if (process.env.NODE_ENV === 'development') {
    // Ejecutar automáticamente solo si se importa directamente
    if (typeof window !== 'undefined') {
        console.log('Para insertar funciones de ejemplo, ejecuta: insertarFuncionesEjemplo()')
    }
}
