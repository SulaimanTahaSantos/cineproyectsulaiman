-- Script para insertar funciones para películas populares comunes
-- Ejecutar en Supabase SQL Editor

-- Limpiar funciones existentes
DELETE FROM funciones;

-- Lista de IDs de películas populares comunes en TMDB
-- Estos suelen ser los que aparecen frecuentemente en la lista popular

INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio, asientos_ocupados) VALUES

-- Set de películas populares comunes (actualizado 2024/2025)
-- Venom: The Last Dance
(912649, 1, CURRENT_DATE, '14:30', 12.50, 15),
(912649, 2, CURRENT_DATE, '17:00', 15.00, 8),
(912649, 3, CURRENT_DATE, '19:30', 18.50, 25),

-- Deadpool & Wolverine  
(533535, 1, CURRENT_DATE, '16:00', 12.50, 22),
(533535, 2, CURRENT_DATE, '18:30', 15.00, 18),
(533535, 3, CURRENT_DATE, '21:00', 18.50, 30),

-- The Wild Robot
(1184918, 1, CURRENT_DATE, '15:00', 12.50, 10),
(1184918, 2, CURRENT_DATE, '18:00', 15.00, 20),
(1184918, 4, CURRENT_DATE, '20:30', 20.00, 12),

-- Smile 2
(1100782, 2, CURRENT_DATE, '16:30', 15.00, 15),
(1100782, 3, CURRENT_DATE, '19:00', 18.50, 28),
(1100782, 4, CURRENT_DATE, '21:30', 20.00, 10),

-- Red One
(1035048, 1, CURRENT_DATE, '13:30', 12.50, 5),
(1035048, 3, CURRENT_DATE, '16:30', 18.50, 15),
(1035048, 4, CURRENT_DATE, '19:00', 20.00, 28),

-- Terrifier 3
(1034541, 2, CURRENT_DATE, '22:00', 15.00, 20),
(1034541, 3, CURRENT_DATE, '23:30', 18.50, 12),

-- We Live in Time
(1079091, 1, CURRENT_DATE, '15:30', 12.50, 8),
(1079091, 2, CURRENT_DATE, '18:30', 15.00, 15),

-- Anora
(1064213, 1, CURRENT_DATE, '14:00', 12.50, 12),
(1064213, 4, CURRENT_DATE, '17:30', 20.00, 8),

-- The Substance
(933260, 2, CURRENT_DATE, '20:00', 15.00, 25),
(933260, 3, CURRENT_DATE, '22:30', 18.50, 18),

-- Gladiator II
(558449, 1, CURRENT_DATE, '16:45', 12.50, 30),
(558449, 3, CURRENT_DATE, '20:15', 18.50, 22),
(558449, 4, CURRENT_DATE, '23:00', 20.00, 15),

-- Funciones para mañana (selección)
(912649, 1, CURRENT_DATE + 1, '14:30', 12.50, 8),
(912649, 2, CURRENT_DATE + 1, '17:00', 15.00, 12),
(533535, 3, CURRENT_DATE + 1, '19:30', 18.50, 20),
(533535, 4, CURRENT_DATE + 1, '21:30', 20.00, 3),
(1184918, 1, CURRENT_DATE + 1, '15:30', 12.50, 5),
(1184918, 2, CURRENT_DATE + 1, '18:30', 15.00, 15),
(1100782, 3, CURRENT_DATE + 1, '16:00', 18.50, 14),
(1100782, 4, CURRENT_DATE + 1, '20:00', 20.00, 6),
(558449, 1, CURRENT_DATE + 1, '13:00', 12.50, 10),
(558449, 2, CURRENT_DATE + 1, '16:30', 15.00, 18),

-- Funciones para pasado mañana (selección)
(912649, 1, CURRENT_DATE + 2, '15:30', 12.50, 18),
(533535, 2, CURRENT_DATE + 2, '18:30', 15.00, 22),
(1184918, 3, CURRENT_DATE + 2, '16:00', 18.50, 14),
(1100782, 4, CURRENT_DATE + 2, '21:00', 20.00, 6),
(558449, 1, CURRENT_DATE + 2, '14:00', 12.50, 12),
(558449, 3, CURRENT_DATE + 2, '19:00', 18.50, 25);

-- Verificar que se insertaron correctamente
SELECT 
    f.tmdb_movie_id,
    f.fecha,
    f.horario,
    s.nombre as sala_nombre,
    f.precio,
    f.asientos_ocupados
FROM funciones f 
JOIN salas s ON f.sala_id = s.id 
ORDER BY f.tmdb_movie_id, f.fecha, f.horario;
