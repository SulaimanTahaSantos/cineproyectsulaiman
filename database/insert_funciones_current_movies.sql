    -- Script para insertar funciones para las películas actualmente visibles en la aplicación
    -- Ejecutar este script en Supabase SQL Editor para generar horarios de cine

    -- Primero, verificar que tenemos salas
    INSERT INTO salas (id, nombre, capacidad) VALUES 
    (1, 'Sala 1', 100),
    (2, 'Sala 2', 80),
    (3, 'Sala 3', 120),
    (4, 'Sala 4', 60)
    ON CONFLICT (id) DO NOTHING;

    -- Insertar funciones para las películas más populares que aparecen en la app
    -- Usaremos los IDs de TMDB que aparecen en el frontend

    -- Película ID: 912649 (Venom: The Last Dance)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (912649, 1, CURRENT_DATE, '16:00', 8.50),
    (912649, 1, CURRENT_DATE, '19:30', 9.50),
    (912649, 1, CURRENT_DATE, '22:00', 10.50),
    (912649, 2, CURRENT_DATE + 1, '15:00', 8.50),
    (912649, 2, CURRENT_DATE + 1, '18:00', 9.50),
    (912649, 2, CURRENT_DATE + 1, '21:30', 10.50);

    -- Película ID: 533535 (Deadpool & Wolverine)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (533535, 2, CURRENT_DATE, '17:00', 9.00),
    (533535, 2, CURRENT_DATE, '20:00', 10.00),
    (533535, 3, CURRENT_DATE, '16:30', 9.00),
    (533535, 3, CURRENT_DATE, '19:30', 10.00),
    (533535, 3, CURRENT_DATE, '22:30', 11.00),
    (533535, 1, CURRENT_DATE + 1, '14:00', 9.00),
    (533535, 1, CURRENT_DATE + 1, '17:30', 10.00);

    -- Película ID: 1184918 (The Wild Robot)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio_euros) VALUES
    (1184918, 4, CURRENT_DATE, '14:00', 7.50),
    (1184918, 4, CURRENT_DATE, '16:30', 7.50),
    (1184918, 4, CURRENT_DATE, '19:00', 8.50),
    (1184918, 1, CURRENT_DATE + 1, '13:00', 7.50),
    (1184918, 1, CURRENT_DATE + 1, '15:30', 7.50),
    (1184918, 1, CURRENT_DATE + 1, '18:00', 8.50);

    -- Película ID: 945961 (Alien: Romulus)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (945961, 3, CURRENT_DATE, '18:00', 9.50),
    (945961, 3, CURRENT_DATE, '21:00', 10.50),
    (945961, 2, CURRENT_DATE + 1, '16:00', 9.50),
    (945961, 2, CURRENT_DATE + 1, '19:00', 10.50),
    (945961, 4, CURRENT_DATE + 1, '21:30', 10.50);

    -- Película ID: 1022789 (Inside Out 2)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (1022789, 4, CURRENT_DATE, '15:00', 8.00),
    (1022789, 4, CURRENT_DATE, '17:30', 8.00),
    (1022789, 1, CURRENT_DATE, '14:30', 8.00),
    (1022789, 2, CURRENT_DATE + 1, '13:30', 8.00),
    (1022789, 2, CURRENT_DATE + 1, '16:00', 8.00);

    -- Película ID: 558449 (Gladiator II)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (558449, 1, CURRENT_DATE, '20:30', 11.00),
    (558449, 3, CURRENT_DATE, '17:30', 10.00),
    (558449, 3, CURRENT_DATE, '20:30', 11.00),
    (558449, 2, CURRENT_DATE + 1, '17:00', 10.00),
    (558449, 2, CURRENT_DATE + 1, '20:00', 11.00);

    -- Película ID: 1100782 (Smile 2)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (1100782, 4, CURRENT_DATE, '20:00', 9.50),
    (1100782, 4, CURRENT_DATE, '22:30', 10.50),
    (1100782, 3, CURRENT_DATE + 1, '19:00', 9.50),
    (1100782, 3, CURRENT_DATE + 1, '22:00', 10.50);

    -- Película ID: 762441 (A Quiet Place: Day One)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (762441, 2, CURRENT_DATE, '15:30', 8.50),
    (762441, 2, CURRENT_DATE, '18:30', 9.50),
    (762441, 1, CURRENT_DATE + 1, '16:30', 8.50),
    (762441, 1, CURRENT_DATE + 1, '19:30', 9.50);

    -- Película ID: 1034541 (Terrifier 3)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (1034541, 4, CURRENT_DATE, '21:00', 10.00),
    (1034541, 4, CURRENT_DATE, '23:30', 11.00),
    (1034541, 3, CURRENT_DATE + 1, '21:30', 10.00),
    (1034541, 3, CURRENT_DATE + 1, '23:45', 11.00);

    -- Película ID: 889737 (Joker: Folie à Deux)
    INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio) VALUES
    (889737, 1, CURRENT_DATE, '17:00', 10.50),
    (889737, 2, CURRENT_DATE, '20:30', 11.50),
    (889737, 1, CURRENT_DATE + 1, '19:00', 10.50),
    (889737, 2, CURRENT_DATE + 1, '22:00', 11.50);

    -- Verificar que las funciones se insertaron correctamente
    SELECT 
        f.id,
        f.pelicula_id,
        s.nombre as sala,
        f.fecha,
        f.hora,
        f.precio
    FROM funciones f
    JOIN salas s ON f.sala_id = s.id
    ORDER BY f.pelicula_id, f.fecha, f.hora;
