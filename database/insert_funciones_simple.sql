-- Script simplificado para insertar funciones de ejemplo
-- Ejecutar en Supabase SQL Editor después del schema principal

-- Primero, limpiar funciones existentes para evitar duplicados
DELETE FROM funciones;

-- Insertar funciones para películas populares actuales
-- Estos IDs corresponden a películas que aparecen en TMDB popular actualmente

-- Función para verificar si una película específica necesita funciones
-- Puedes cambiar estos IDs por los que veas en tu aplicación

INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio, asientos_ocupados) VALUES

-- Películas comunes que suelen aparecer (ajusta los IDs según lo que veas en tu app)
-- ID 558449 (ejemplo: película popular 1)
(558449, 1, CURRENT_DATE, '14:30', 12.50, 15),
(558449, 2, CURRENT_DATE, '17:00', 15.00, 8),
(558449, 3, CURRENT_DATE, '19:30', 18.50, 25),
(558449, 4, CURRENT_DATE, '21:30', 20.00, 12),

-- ID 533535 (ejemplo: película popular 2)  
(533535, 1, CURRENT_DATE, '16:00', 12.50, 22),
(533535, 2, CURRENT_DATE, '18:30', 15.00, 18),
(533535, 3, CURRENT_DATE, '21:00', 18.50, 30),
(533535, 4, CURRENT_DATE, '23:00', 20.00, 5),

-- ID 1184918 (ejemplo: película popular 3)
(1184918, 1, CURRENT_DATE, '15:00', 12.50, 10),
(1184918, 2, CURRENT_DATE, '18:00', 15.00, 20),
(1184918, 3, CURRENT_DATE, '20:30', 18.50, 12),
(1184918, 4, CURRENT_DATE, '22:30', 20.00, 8),

-- ID 912649 (ejemplo: película popular 4)
(912649, 1, CURRENT_DATE, '13:30', 12.50, 5),
(912649, 2, CURRENT_DATE, '16:30', 15.00, 15),
(912649, 3, CURRENT_DATE, '19:00', 18.50, 28),
(912649, 4, CURRENT_DATE, '21:30', 20.00, 10),

-- Funciones para mañana
(558449, 1, CURRENT_DATE + 1, '14:30', 12.50, 8),
(558449, 2, CURRENT_DATE + 1, '17:00', 15.00, 12),
(533535, 3, CURRENT_DATE + 1, '19:30', 18.50, 20),
(533535, 4, CURRENT_DATE + 1, '21:30', 20.00, 3),
(1184918, 1, CURRENT_DATE + 1, '15:30', 12.50, 5),
(1184918, 2, CURRENT_DATE + 1, '18:30', 15.00, 15),
(912649, 3, CURRENT_DATE + 1, '16:00', 18.50, 14),
(912649, 4, CURRENT_DATE + 1, '20:00', 20.00, 6),

-- Funciones para pasado mañana
(558449, 1, CURRENT_DATE + 2, '15:30', 12.50, 18),
(533535, 2, CURRENT_DATE + 2, '18:30', 15.00, 22),
(1184918, 3, CURRENT_DATE + 2, '16:00', 18.50, 14),
(912649, 4, CURRENT_DATE + 2, '21:00', 20.00, 6);

-- Verificar que se insertaron correctamente
SELECT f.*, s.nombre as sala_nombre 
FROM funciones f 
JOIN salas s ON f.sala_id = s.id 
ORDER BY f.tmdb_movie_id, f.fecha, f.horario;
