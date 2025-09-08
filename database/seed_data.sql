-- Script adicional para insertar datos de prueba después de crear las tablas
-- Ejecutar después del schema principal

-- Insertar funciones de ejemplo para películas populares
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio, asientos_ocupados) VALUES
-- Película 550988 (Poppa's House)
(550988, 1, CURRENT_DATE, '14:30', 12.50, 15),
(550988, 2, CURRENT_DATE, '17:00', 15.00, 8),
(550988, 3, CURRENT_DATE, '19:30', 18.50, 25),
-- Película 558449 (Gladiator II)  
(558449, 1, CURRENT_DATE, '16:00', 12.50, 22),
(558449, 4, CURRENT_DATE, '21:30', 20.00, 5),
-- Película 533535 (Deadpool & Wolverine)
(533535, 2, CURRENT_DATE, '15:30', 15.00, 18),
(533535, 3, CURRENT_DATE, '20:00', 18.50, 30),
-- Película 1184918 (The Wild Robot)
(1184918, 1, CURRENT_DATE, '15:00', 12.50, 10),
(1184918, 2, CURRENT_DATE, '18:00', 15.00, 20),
-- Película 1064213 (Spellbound)
(1064213, 3, CURRENT_DATE, '16:30', 18.50, 12),
(1064213, 4, CURRENT_DATE, '19:00', 20.00, 8),

-- Funciones para mañana
(550988, 1, CURRENT_DATE + 1, '14:30', 12.50, 8),
(550988, 2, CURRENT_DATE + 1, '17:00', 15.00, 12),
(558449, 3, CURRENT_DATE + 1, '19:30', 18.50, 20),
(533535, 4, CURRENT_DATE + 1, '21:30', 20.00, 3),
(1184918, 1, CURRENT_DATE + 1, '13:00', 12.50, 5),
(1064213, 2, CURRENT_DATE + 1, '20:30', 15.00, 15),

-- Funciones para pasado mañana
(550988, 3, CURRENT_DATE + 2, '15:30', 18.50, 18),
(558449, 1, CURRENT_DATE + 2, '14:00', 12.50, 25),
(533535, 2, CURRENT_DATE + 2, '18:30', 15.00, 22),
(1184918, 4, CURRENT_DATE + 2, '21:00', 20.00, 6),
(1064213, 3, CURRENT_DATE + 2, '16:00', 18.50, 14);
