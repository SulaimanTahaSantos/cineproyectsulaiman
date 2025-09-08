-- Script SQL para insertar funciones de las películas actuales de TMDB
-- Ejecutar en Supabase SQL Editor

-- Primero asegurar que tenemos las salas creadas
INSERT INTO salas (id, nombre, capacidad) VALUES 
(1, 'Sala 1 - Premium', 100),
(2, 'Sala 2 - Estándar', 80),
(3, 'Sala 3 - IMAX', 120),
(4, 'Sala 4 - VIP', 60),
(5, 'Sala 5 - 4DX', 90)
ON CONFLICT (id) DO NOTHING;

-- Insertar funciones para todas las películas actuales
-- Cada película tendrá múltiples horariorios en diferentes salas

-- ID: 755898 - La guerra de los mundos
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(755898, 1, CURRENT_DATE, '14:00', 8.50),
(755898, 1, CURRENT_DATE, '17:00', 9.50),
(755898, 2, CURRENT_DATE, '19:30', 10.50),
(755898, 3, CURRENT_DATE, '22:00', 12.00),
(755898, 1, CURRENT_DATE + 1, '15:30', 8.50),
(755898, 2, CURRENT_DATE + 1, '18:00', 9.50);

-- ID: 1007734 - Nadie 2
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1007734, 2, CURRENT_DATE, '16:00', 9.00),
(1007734, 3, CURRENT_DATE, '18:30', 11.50),
(1007734, 4, CURRENT_DATE, '21:00', 13.00),
(1007734, 1, CURRENT_DATE + 1, '14:30', 9.00),
(1007734, 2, CURRENT_DATE + 1, '17:30', 10.00),
(1007734, 5, CURRENT_DATE + 1, '20:30', 14.00);

-- ID: 1038392 - Expediente Warren: El último rito
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1038392, 1, CURRENT_DATE, '15:00', 8.00),
(1038392, 2, CURRENT_DATE, '18:00', 9.00),
(1038392, 3, CURRENT_DATE, '20:30', 11.00),
(1038392, 4, CURRENT_DATE, '23:00', 12.50),
(1038392, 2, CURRENT_DATE + 1, '16:00', 8.50),
(1038392, 3, CURRENT_DATE + 1, '19:00', 10.50);

-- ID: 1035259 - Agárralo como puedas
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1035259, 4, CURRENT_DATE, '14:30', 7.50),
(1035259, 1, CURRENT_DATE, '17:00', 8.50),
(1035259, 2, CURRENT_DATE, '19:30', 9.50),
(1035259, 3, CURRENT_DATE, '22:00', 10.50),
(1035259, 4, CURRENT_DATE + 1, '15:00', 7.50),
(1035259, 1, CURRENT_DATE + 1, '18:30', 9.00);

-- ID: 911430 - F1 la película
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(911430, 3, CURRENT_DATE, '15:30', 11.50),
(911430, 5, CURRENT_DATE, '18:00', 14.00),
(911430, 3, CURRENT_DATE, '20:30', 12.00),
(911430, 5, CURRENT_DATE, '23:00', 15.00),
(911430, 1, CURRENT_DATE + 1, '16:00', 10.50),
(911430, 3, CURRENT_DATE + 1, '19:30', 11.50);

-- ID: 1061474 - Superman
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1061474, 3, CURRENT_DATE, '14:00', 12.00),
(1061474, 5, CURRENT_DATE, '17:00', 15.00),
(1061474, 3, CURRENT_DATE, '20:00', 13.00),
(1061474, 5, CURRENT_DATE, '23:00', 16.00),
(1061474, 1, CURRENT_DATE + 1, '15:00', 11.00),
(1061474, 3, CURRENT_DATE + 1, '18:00', 12.50);

-- ID: 1311031 - Guardianes de la noche: Kimetsu no Yaiba La fortaleza infinita
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1311031, 2, CURRENT_DATE, '16:30', 9.50),
(1311031, 4, CURRENT_DATE, '19:00', 12.50),
(1311031, 2, CURRENT_DATE, '21:30', 10.50),
(1311031, 1, CURRENT_DATE + 1, '14:00', 9.00),
(1311031, 4, CURRENT_DATE + 1, '17:00', 12.00),
(1311031, 2, CURRENT_DATE + 1, '20:00', 10.00);

-- ID: 575265 - Misión: Imposible - Sentencia final
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(575265, 3, CURRENT_DATE, '15:00', 11.50),
(575265, 5, CURRENT_DATE, '18:00', 14.50),
(575265, 3, CURRENT_DATE, '21:00', 12.50),
(575265, 1, CURRENT_DATE + 1, '16:30', 10.50),
(575265, 5, CURRENT_DATE + 1, '19:30', 14.00),
(575265, 3, CURRENT_DATE + 1, '22:30', 13.00);

-- ID: 1367575 - En la linea de fuego
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1367575, 1, CURRENT_DATE, '14:30', 8.50),
(1367575, 2, CURRENT_DATE, '17:30', 9.50),
(1367575, 4, CURRENT_DATE, '20:00', 12.00),
(1367575, 1, CURRENT_DATE + 1, '15:30', 8.50),
(1367575, 2, CURRENT_DATE + 1, '18:30', 9.50),
(1367575, 4, CURRENT_DATE + 1, '21:30', 12.50);

-- ID: 1234821 - Jurassic World: El renacer
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1234821, 3, CURRENT_DATE, '14:00', 12.00),
(1234821, 5, CURRENT_DATE, '17:00', 15.50),
(1234821, 3, CURRENT_DATE, '20:00', 13.00),
(1234821, 5, CURRENT_DATE, '23:00', 16.50),
(1234821, 1, CURRENT_DATE + 1, '15:00', 11.00),
(1234821, 3, CURRENT_DATE + 1, '18:30', 12.50);

-- ID: 13494 - Red Sonja
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(13494, 2, CURRENT_DATE, '15:30', 8.50),
(13494, 4, CURRENT_DATE, '18:00', 12.00),
(13494, 2, CURRENT_DATE, '20:30', 9.50),
(13494, 1, CURRENT_DATE + 1, '16:00', 8.50),
(13494, 4, CURRENT_DATE + 1, '19:00', 11.50),
(13494, 2, CURRENT_DATE + 1, '22:00', 10.00);

-- ID: 660033 - Cómo me convertí en un gánster
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(660033, 1, CURRENT_DATE, '16:00', 8.00),
(660033, 2, CURRENT_DATE, '19:00', 9.00),
(660033, 4, CURRENT_DATE, '21:30', 11.50),
(660033, 1, CURRENT_DATE + 1, '17:00', 8.50),
(660033, 2, CURRENT_DATE + 1, '20:00', 9.50),
(660033, 4, CURRENT_DATE + 1, '22:30', 12.00);

-- ID: 1242011 - Together: Juntos hasta la muerte
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1242011, 4, CURRENT_DATE, '14:00', 11.50),
(1242011, 1, CURRENT_DATE, '17:00', 8.50),
(1242011, 2, CURRENT_DATE, '19:30', 9.50),
(1242011, 4, CURRENT_DATE + 1, '15:30', 11.50),
(1242011, 1, CURRENT_DATE + 1, '18:00', 8.50),
(1242011, 2, CURRENT_DATE + 1, '21:00', 10.00);

-- ID: 1151334 - La conductora
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1151334, 2, CURRENT_DATE, '16:30', 8.50),
(1151334, 3, CURRENT_DATE, '19:00', 10.50),
(1151334, 2, CURRENT_DATE, '21:30', 9.50),
(1151334, 1, CURRENT_DATE + 1, '15:00', 8.00),
(1151334, 3, CURRENT_DATE + 1, '18:00', 10.00),
(1151334, 2, CURRENT_DATE + 1, '20:30', 9.00);

-- ID: 1119878 - Ice Road: Venganza
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1119878, 1, CURRENT_DATE, '15:00', 8.50),
(1119878, 3, CURRENT_DATE, '18:00', 11.00),
(1119878, 1, CURRENT_DATE, '20:30', 9.50),
(1119878, 3, CURRENT_DATE, '23:00', 11.50),
(1119878, 2, CURRENT_DATE + 1, '16:00', 8.50),
(1119878, 1, CURRENT_DATE + 1, '19:00', 9.00);

-- ID: 803796 - Las guerreras k-pop
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(803796, 4, CURRENT_DATE, '16:00', 11.50),
(803796, 2, CURRENT_DATE, '18:30', 9.00),
(803796, 4, CURRENT_DATE, '21:00', 12.00),
(803796, 2, CURRENT_DATE + 1, '15:30', 8.50),
(803796, 4, CURRENT_DATE + 1, '18:00', 11.50),
(803796, 2, CURRENT_DATE + 1, '20:30', 9.50);

-- ID: 1087192 - Cómo entrenar a tu dragón
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1087192, 5, CURRENT_DATE, '14:00', 13.50),
(1087192, 3, CURRENT_DATE, '16:30', 10.50),
(1087192, 5, CURRENT_DATE, '19:00', 14.00),
(1087192, 3, CURRENT_DATE, '21:30', 11.00),
(1087192, 1, CURRENT_DATE + 1, '15:00', 9.50),
(1087192, 5, CURRENT_DATE + 1, '17:30', 13.50);

-- ID: 1175942 - Los tipos malos 2
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1175942, 1, CURRENT_DATE, '14:30', 7.50),
(1175942, 2, CURRENT_DATE, '17:00', 8.50),
(1175942, 4, CURRENT_DATE, '19:30', 11.00),
(1175942, 1, CURRENT_DATE + 1, '16:00', 7.50),
(1175942, 2, CURRENT_DATE + 1, '18:30', 8.50),
(1175942, 4, CURRENT_DATE + 1, '21:00', 11.50);

-- ID: 1083433 - Sé lo que hicisteis el último verano
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1083433, 2, CURRENT_DATE, '15:30', 8.50),
(1083433, 3, CURRENT_DATE, '18:30', 10.50),
(1083433, 2, CURRENT_DATE, '21:00', 9.50),
(1083433, 3, CURRENT_DATE, '23:30', 11.00),
(1083433, 1, CURRENT_DATE + 1, '17:00', 8.50),
(1083433, 2, CURRENT_DATE + 1, '20:00', 9.00);

-- ID: 1382406 - Venganza implacable
INSERT INTO funciones (tmdb_movie_id, sala_id, fecha, horario, precio) VALUES
(1382406, 3, CURRENT_DATE, '16:00', 11.00),
(1382406, 4, CURRENT_DATE, '19:00', 12.50),
(1382406, 3, CURRENT_DATE, '21:30', 11.50),
(1382406, 1, CURRENT_DATE + 1, '15:30', 10.00),
(1382406, 4, CURRENT_DATE + 1, '18:30', 12.00),
(1382406, 3, CURRENT_DATE + 1, '22:00', 12.00);

-- Verificar que todas las funciones se insertaron correctamente
SELECT 
    COUNT(*) as total_funciones,
    COUNT(DISTINCT tmdb_movie_id) as peliculas_con_funciones,
    MIN(precio) as precio_minimo,
    MAX(precio) as precio_maximo
FROM funciones;

-- Ver todas las funciones por película (sin agrupar)
SELECT 
    f.tmdb_movie_id,
    s.nombre as sala,
    f.fecha,
    f.horario,
    f.precio
FROM funciones f
JOIN salas s ON f.sala_id = s.id
WHERE f.tmdb_movie_id IN (755898, 1007734, 1038392, 1035259, 911430, 1061474, 1311031, 575265, 1367575, 1234821, 13494, 660033, 1242011, 1151334, 1119878, 803796, 1087192, 1175942, 1083433, 1382406)
ORDER BY f.tmdb_movie_id, f.fecha, f.horario;

-- Ver resumen de funciones por película
SELECT 
    f.tmdb_movie_id,
    COUNT(*) as num_funciones,
    MIN(f.precio) as precio_minimo,
    MAX(f.precio) as precio_maximo
FROM funciones f
WHERE f.tmdb_movie_id IN (755898, 1007734, 1038392, 1035259, 911430, 1061474, 1311031, 575265, 1367575, 1234821, 13494, 660033, 1242011, 1151334, 1119878, 803796, 1087192, 1175942, 1083433, 1382406)
GROUP BY f.tmdb_movie_id
ORDER BY f.tmdb_movie_id;
