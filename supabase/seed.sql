-- ============================================
-- GUÍA PYMES - SEED DATA (Datos de Prueba)
-- ============================================
-- Ejecutar DESPUÉS del schema.sql
-- NOTA: Reemplazar 'YOUR_USER_ID' con el UUID del usuario autenticado
-- Para obtener tu user_id después de registrarte, ejecuta:
-- SELECT id FROM auth.users LIMIT 1;
-- ============================================
-- INSTRUCCIONES DE USO:
-- 1. Primero regístrate en la aplicación
-- 2. Obtén tu user_id ejecutando: SELECT id FROM auth.users WHERE email = 'tu@email.com';
-- 3. Reemplaza todas las ocurrencias de 'YOUR_USER_ID' con tu UUID
-- 4. Ejecuta este script
-- ============================================
-- Variable para el user_id (reemplazar con el UUID real)
-- Ejemplo: DO $$ DECLARE user_uuid UUID := 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; BEGIN ... END $$;
DO $$
DECLARE user_uuid UUID;
cat_construccion UUID;
cat_arquitectos UUID;
cat_ingenieros UUID;
cat_tecnologia UUID;
cat_software UUID;
cat_hardware UUID;
cat_salud UUID;
cat_medicos UUID;
cat_comercio UUID;
cat_gastronomia UUID;
ent_constructora UUID;
ent_tech UUID;
ent_clinica UUID;
ent_restaurant UUID;
ent_consultor UUID;
BEGIN -- Obtener el primer usuario (o especificar uno)
SELECT id INTO user_uuid
FROM auth.users
LIMIT 1;
IF user_uuid IS NULL THEN RAISE NOTICE 'No hay usuarios registrados. Por favor, regístrate primero.';
RETURN;
END IF;
RAISE NOTICE 'Usando user_id: %',
user_uuid;
-- ============================================
-- CATEGORÍAS (con estructura jerárquica)
-- ============================================
-- Categorías principales (nivel 1)
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Construcción',
        'Empresas del sector construcción',
        'building',
        '#F59E0B',
        NULL,
        1
    )
RETURNING id INTO cat_construccion;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Tecnología',
        'Empresas de tecnología e informática',
        'laptop',
        '#3B82F6',
        NULL,
        2
    )
RETURNING id INTO cat_tecnologia;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Salud',
        'Profesionales y clínicas de salud',
        'heart-pulse',
        '#EF4444',
        NULL,
        3
    )
RETURNING id INTO cat_salud;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Comercio',
        'Comercios y retail',
        'shopping-bag',
        '#22C55E',
        NULL,
        4
    )
RETURNING id INTO cat_comercio;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Gastronomía',
        'Restaurantes, bares y catering',
        'utensils',
        '#A855F7',
        NULL,
        5
    )
RETURNING id INTO cat_gastronomia;
-- Subcategorías de Construcción
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Arquitectos',
        'Estudios de arquitectura',
        'drafting-compass',
        '#F59E0B',
        cat_construccion,
        1
    )
RETURNING id INTO cat_arquitectos;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Ingenieros Civiles',
        'Ingeniería civil y estructural',
        'hard-hat',
        '#F59E0B',
        cat_construccion,
        2
    )
RETURNING id INTO cat_ingenieros;
-- Subcategorías de Tecnología
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Software',
        'Desarrollo de software',
        'code',
        '#3B82F6',
        cat_tecnologia,
        1
    )
RETURNING id INTO cat_software;
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Hardware',
        'Venta y reparación de equipos',
        'cpu',
        '#3B82F6',
        cat_tecnologia,
        2
    )
RETURNING id INTO cat_hardware;
-- Subcategorías de Salud
INSERT INTO categorias (
        id,
        user_id,
        nombre,
        descripcion,
        icono,
        color,
        parent_id,
        orden
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'Médicos',
        'Profesionales médicos',
        'stethoscope',
        '#EF4444',
        cat_salud,
        1
    )
RETURNING id INTO cat_medicos;
-- ============================================
-- ENTIDADES (Empresas, Negocios, Profesionales)
-- ============================================
-- PYME: Constructora
INSERT INTO entidades (
        id,
        user_id,
        tipo,
        nombre_comercial,
        razon_social,
        cuit,
        descripcion,
        categoria_id,
        emails,
        telefonos,
        redes_sociales,
        direcciones,
        activo
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'PYME',
        'Constructora Del Sur S.A.',
        'Constructora Del Sur Sociedad Anónima',
        '30-12345678-9',
        'Empresa constructora con más de 20 años de experiencia en obras civiles y edificios residenciales.',
        cat_construccion,
        ARRAY ['info@constructoradelsur.com', 'ventas@constructoradelsur.com'],
        ARRAY ['+54 11 4555-1234', '+54 11 4555-5678'],
        '{"website": "https://constructoradelsur.com", "linkedin": "https://linkedin.com/company/constructoradelsur", "instagram": "@constructoradelsur"}',
        '[{"tipo": "fiscal", "calle": "Av. Rivadavia", "numero": "1234", "ciudad": "Buenos Aires", "provincia": "CABA", "cp": "C1033AAO"}, {"tipo": "obra", "calle": "Ruta 8 Km 45", "numero": "S/N", "ciudad": "Pilar", "provincia": "Buenos Aires", "cp": "1629"}]',
        true
    )
RETURNING id INTO ent_constructora;
-- PYME: Tech Solutions
INSERT INTO entidades (
        id,
        user_id,
        tipo,
        nombre_comercial,
        razon_social,
        cuit,
        descripcion,
        categoria_id,
        emails,
        telefonos,
        redes_sociales,
        direcciones,
        activo
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'PYME',
        'Tech Solutions Argentina',
        'Tech Solutions Argentina S.R.L.',
        '30-98765432-1',
        'Desarrollo de software a medida, aplicaciones web y móviles. Especialistas en transformación digital.',
        cat_software,
        ARRAY ['contacto@techsolutions.com.ar', 'soporte@techsolutions.com.ar'],
        ARRAY ['+54 11 5555-9999'],
        '{"website": "https://techsolutions.com.ar", "github": "https://github.com/techsolutions-ar", "twitter": "@techsolutionsar"}',
        '[{"tipo": "fiscal", "calle": "Av. Córdoba", "numero": "5678", "piso": "10", "oficina": "A", "ciudad": "Buenos Aires", "provincia": "CABA", "cp": "C1414AAP"}]',
        true
    )
RETURNING id INTO ent_tech;
-- NEGOCIO: Clínica
INSERT INTO entidades (
        id,
        user_id,
        tipo,
        nombre_comercial,
        razon_social,
        cuit,
        descripcion,
        categoria_id,
        emails,
        telefonos,
        redes_sociales,
        direcciones,
        activo
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'NEGOCIO',
        'Clínica Médica Integral',
        'CMI Salud S.A.',
        '30-11223344-5',
        'Centro médico con especialidades en medicina general, pediatría, cardiología y traumatología.',
        cat_medicos,
        ARRAY ['turnos@clinicaintegral.com', 'administracion@clinicaintegral.com'],
        ARRAY ['+54 11 4111-2222', '+54 11 4111-3333', '+54 11 15-5555-6666'],
        '{"website": "https://clinicaintegral.com", "facebook": "https://facebook.com/clinicaintegral", "instagram": "@clinicaintegral"}',
        '[{"tipo": "principal", "calle": "Av. Santa Fe", "numero": "3456", "ciudad": "Buenos Aires", "provincia": "CABA", "cp": "C1425BGO"}]',
        true
    )
RETURNING id INTO ent_clinica;
-- NEGOCIO: Restaurante
INSERT INTO entidades (
        id,
        user_id,
        tipo,
        nombre_comercial,
        razon_social,
        cuit,
        descripcion,
        categoria_id,
        emails,
        telefonos,
        redes_sociales,
        direcciones,
        activo
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'NEGOCIO',
        'La Parrilla de Juan',
        'Juan García Gastronomía',
        '20-33445566-7',
        'Restaurante tradicional argentino especializado en carnes a la parrilla y empanadas caseras.',
        cat_gastronomia,
        ARRAY ['reservas@laparrilladejuan.com'],
        ARRAY ['+54 11 4777-8888'],
        '{"instagram": "@laparrilladejuan", "facebook": "https://facebook.com/laparrilladejuan"}',
        '[{"tipo": "local", "calle": "Defensa", "numero": "999", "ciudad": "Buenos Aires", "provincia": "CABA", "cp": "C1065AAD"}]',
        true
    )
RETURNING id INTO ent_restaurant;
-- PROFESIONAL: Arquitecto
INSERT INTO entidades (
        id,
        user_id,
        tipo,
        nombre_comercial,
        razon_social,
        cuit,
        descripcion,
        categoria_id,
        emails,
        telefonos,
        redes_sociales,
        direcciones,
        activo
    )
VALUES (
        uuid_generate_v4(),
        user_uuid,
        'PROFESIONAL',
        'Arq. María González',
        'María Laura González',
        '27-22334455-8',
        'Arquitecta especializada en diseño sustentable y remodelaciones. Miembro del CAM.',
        cat_arquitectos,
        ARRAY ['arq.mariagonzalez@gmail.com'],
        ARRAY ['+54 11 15-4444-5555'],
        '{"linkedin": "https://linkedin.com/in/mariagonzalezarq", "instagram": "@arq.mariagonzalez", "website": "https://mariagonzalezarq.com"}',
        '[{"tipo": "estudio", "calle": "Av. Callao", "numero": "1234", "piso": "5", "oficina": "B", "ciudad": "Buenos Aires", "provincia": "CABA", "cp": "C1023AAR"}]',
        true
    )
RETURNING id INTO ent_consultor;
-- ============================================
-- CONTACTOS
-- ============================================
-- Contactos de Constructora Del Sur
INSERT INTO contactos (
        entidad_id,
        nombre_completo,
        cargo,
        rol,
        telefonos,
        emails,
        es_principal
    )
VALUES (
        ent_constructora,
        'Roberto Martínez',
        'Gerente General',
        'Dueño',
        ARRAY ['+54 11 15-1111-2222'],
        ARRAY ['rmartinez@constructoradelsur.com'],
        true
    ),
    (
        ent_constructora,
        'Laura Sánchez',
        'Jefa de Administración',
        'Administrativo',
        ARRAY ['+54 11 15-2222-3333'],
        ARRAY ['lsanchez@constructoradelsur.com'],
        false
    ),
    (
        ent_constructora,
        'Carlos Fernández',
        'Contador',
        'Contador',
        ARRAY ['+54 11 15-3333-4444'],
        ARRAY ['cfernandez@constructoradelsur.com'],
        false
    );
-- Contactos de Tech Solutions
INSERT INTO contactos (
        entidad_id,
        nombre_completo,
        cargo,
        rol,
        telefonos,
        emails,
        es_principal,
        redes_sociales
    )
VALUES (
        ent_tech,
        'Alejandro López',
        'CEO & Founder',
        'Dueño',
        ARRAY ['+54 11 15-5555-6666'],
        ARRAY ['alopez@techsolutions.com.ar'],
        true,
        '{"linkedin": "https://linkedin.com/in/alejandrolopez"}'
    ),
    (
        ent_tech,
        'Sofía Ramírez',
        'CTO',
        'Otro',
        ARRAY ['+54 11 15-6666-7777'],
        ARRAY ['sramirez@techsolutions.com.ar'],
        false,
        '{"github": "https://github.com/sofiaramirez"}'
    ),
    (
        ent_tech,
        'Diego Torres',
        'Ejecutivo de Ventas',
        'Ventas',
        ARRAY ['+54 11 15-7777-8888'],
        ARRAY ['dtorres@techsolutions.com.ar'],
        false,
        NULL
    );
-- Contactos de Clínica
INSERT INTO contactos (
        entidad_id,
        nombre_completo,
        cargo,
        rol,
        telefonos,
        emails,
        es_principal
    )
VALUES (
        ent_clinica,
        'Dr. Pablo Méndez',
        'Director Médico',
        'Dueño',
        ARRAY ['+54 11 15-8888-9999'],
        ARRAY ['pmendez@clinicaintegral.com'],
        true
    ),
    (
        ent_clinica,
        'Ana María Ruiz',
        'Coordinadora de Turnos',
        'Administrativo',
        ARRAY ['+54 11 15-9999-0000'],
        ARRAY ['aruiz@clinicaintegral.com'],
        false
    );
-- Contactos de Restaurante
INSERT INTO contactos (
        entidad_id,
        nombre_completo,
        cargo,
        rol,
        telefonos,
        emails,
        es_principal
    )
VALUES (
        ent_restaurant,
        'Juan García',
        'Propietario',
        'Dueño',
        ARRAY ['+54 11 15-1234-5678'],
        ARRAY ['juan@laparrilladejuan.com'],
        true
    );
-- Contacto de Arquitecta
INSERT INTO contactos (
        entidad_id,
        nombre_completo,
        cargo,
        rol,
        telefonos,
        emails,
        es_principal
    )
VALUES (
        ent_consultor,
        'María González',
        'Arquitecta Principal',
        'Dueño',
        ARRAY ['+54 11 15-4444-5555'],
        ARRAY ['arq.mariagonzalez@gmail.com'],
        true
    );
-- ============================================
-- AUDITORÍA (Logs de ejemplo)
-- ============================================
INSERT INTO auditoria_logs (
        user_id,
        accion,
        entidad_afectada,
        detalles,
        ip_address
    )
VALUES (
        user_uuid,
        'CREATE_ENTIDAD',
        'Constructora Del Sur S.A.',
        '{"tipo": "PYME", "categoria": "Construcción"}',
        '192.168.1.1'
    ),
    (
        user_uuid,
        'CREATE_ENTIDAD',
        'Tech Solutions Argentina',
        '{"tipo": "PYME", "categoria": "Software"}',
        '192.168.1.1'
    ),
    (
        user_uuid,
        'CREATE_ENTIDAD',
        'Clínica Médica Integral',
        '{"tipo": "NEGOCIO", "categoria": "Médicos"}',
        '192.168.1.1'
    ),
    (
        user_uuid,
        'CREATE_CONTACTO',
        'Roberto Martínez',
        '{"entidad": "Constructora Del Sur S.A.", "rol": "Dueño"}',
        '192.168.1.1'
    ),
    (
        user_uuid,
        'UPDATE_ENTIDAD',
        'Tech Solutions Argentina',
        '{"campo": "descripcion", "accion": "actualizado"}',
        '192.168.1.1'
    ),
    (
        user_uuid,
        'CREATE_CATEGORIA',
        'Construcción > Arquitectos',
        '{"parent": "Construcción"}',
        '192.168.1.1'
    );
RAISE NOTICE 'Seed completado exitosamente!';
RAISE NOTICE 'Categorías creadas: 10';
RAISE NOTICE 'Entidades creadas: 5';
RAISE NOTICE 'Contactos creados: 9';
RAISE NOTICE 'Logs de auditoría: 6';
END $$;