-- ============================================
-- GUÍA PYMES - SUPABASE DATABASE SCHEMA
-- ============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 2. Tipos ENUM personalizados
CREATE TYPE tipo_entidad AS ENUM ('PYME', 'NEGOCIO', 'PROFESIONAL');
CREATE TYPE rol_contacto AS ENUM (
    'Administrativo',
    'Dueño',
    'Contador',
    'Ventas',
    'Otro'
);
-- 3. Tabla de Categorías (Anidadas/Self-referencing para clusters)
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    icono TEXT DEFAULT 'folder',
    color TEXT DEFAULT '#39FF14',
    parent_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Tabla Principal: Entidades (Empresas, Negocios, Profesionales)
CREATE TABLE entidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tipo tipo_entidad NOT NULL DEFAULT 'PYME',
    nombre_comercial TEXT NOT NULL,
    razon_social TEXT,
    cuit TEXT,
    descripcion TEXT,
    categoria_id UUID REFERENCES categorias(id) ON DELETE
    SET NULL,
        emails TEXT [] DEFAULT '{}',
        telefonos TEXT [] DEFAULT '{}',
        redes_sociales JSONB DEFAULT '{}',
        -- Estructura: { "twitter": "@handle", "linkedin": "url", "instagram": "@handle", "facebook": "url", "website": "url" }
        direcciones JSONB DEFAULT '[]',
        -- Estructura: [{ "tipo": "fiscal", "calle": "", "numero": "", "ciudad": "", "provincia": "", "cp": "" }]
        logo_url TEXT,
        activo BOOLEAN DEFAULT true,
        notas TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 5. Tabla de Contactos (asociados a Entidades)
CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE NOT NULL,
    nombre_completo TEXT NOT NULL,
    cargo TEXT,
    rol rol_contacto NOT NULL DEFAULT 'Otro',
    telefonos TEXT [] DEFAULT '{}',
    emails TEXT [] DEFAULT '{}',
    redes_sociales JSONB DEFAULT '{}',
    es_principal BOOLEAN DEFAULT false,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 6. Tabla de Auditoría (Log de Tareas/Acciones)
CREATE TABLE auditoria_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        accion TEXT NOT NULL,
        entidad_afectada TEXT,
        detalles JSONB DEFAULT '{}',
        ip_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 7. Índices para mejorar Performance
CREATE INDEX idx_entidades_user ON entidades(user_id);
CREATE INDEX idx_entidades_categoria ON entidades(categoria_id);
CREATE INDEX idx_entidades_tipo ON entidades(tipo);
CREATE INDEX idx_entidades_activo ON entidades(activo);
CREATE INDEX idx_entidades_nombre ON entidades USING gin(to_tsvector('spanish', nombre_comercial));
CREATE INDEX idx_contactos_entidad ON contactos(entidad_id);
CREATE INDEX idx_categorias_parent ON categorias(parent_id);
CREATE INDEX idx_categorias_user ON categorias(user_id);
CREATE INDEX idx_auditoria_user ON auditoria_logs(user_id);
CREATE INDEX idx_auditoria_fecha ON auditoria_logs(created_at DESC);
-- 8. Funciones de actualización automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Triggers para updated_at
CREATE TRIGGER update_entidades_updated_at BEFORE
UPDATE ON entidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contactos_updated_at BEFORE
UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE
UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_logs ENABLE ROW LEVEL SECURITY;
-- Políticas para CATEGORIAS
CREATE POLICY "Users can view their own categories" ON categorias FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own categories" ON categorias FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON categorias FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON categorias FOR DELETE USING (auth.uid() = user_id);
-- Políticas para ENTIDADES
CREATE POLICY "Users can view their own entities" ON entidades FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own entities" ON entidades FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own entities" ON entidades FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own entities" ON entidades FOR DELETE USING (auth.uid() = user_id);
-- Políticas para CONTACTOS (a través de la entidad del usuario)
CREATE POLICY "Users can view contacts of their entities" ON contactos FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM entidades
            WHERE entidades.id = contactos.entidad_id
                AND entidades.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can create contacts for their entities" ON contactos FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM entidades
            WHERE entidades.id = contactos.entidad_id
                AND entidades.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update contacts of their entities" ON contactos FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM entidades
            WHERE entidades.id = contactos.entidad_id
                AND entidades.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete contacts of their entities" ON contactos FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM entidades
        WHERE entidades.id = contactos.entidad_id
            AND entidades.user_id = auth.uid()
    )
);
-- Políticas para AUDITORIA_LOGS
CREATE POLICY "Users can view their own audit logs" ON auditoria_logs FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create audit logs" ON auditoria_logs FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- ============================================
-- VISTAS ÚTILES PARA EL DASHBOARD
-- ============================================
-- Vista de estadísticas por usuario
CREATE OR REPLACE VIEW user_stats AS
SELECT user_id,
    COUNT(*) FILTER (
        WHERE tipo = 'PYME'
    ) as total_pymes,
    COUNT(*) FILTER (
        WHERE tipo = 'NEGOCIO'
    ) as total_negocios,
    COUNT(*) FILTER (
        WHERE tipo = 'PROFESIONAL'
    ) as total_profesionales,
    COUNT(*) as total_entidades,
    COUNT(*) FILTER (
        WHERE activo = true
    ) as entidades_activas,
    COUNT(*) FILTER (
        WHERE created_at > NOW() - INTERVAL '30 days'
    ) as nuevas_ultimo_mes
FROM entidades
GROUP BY user_id;
-- Vista de entidades con conteo de contactos
CREATE OR REPLACE VIEW entidades_con_contactos AS
SELECT e.*,
    c.nombre as categoria_nombre,
    COALESCE(cont.total_contactos, 0) as total_contactos
FROM entidades e
    LEFT JOIN categorias c ON e.categoria_id = c.id
    LEFT JOIN (
        SELECT entidad_id,
            COUNT(*) as total_contactos
        FROM contactos
        GROUP BY entidad_id
    ) cont ON e.id = cont.entidad_id;
-- Habilitar RLS en las vistas
ALTER VIEW user_stats
SET (security_invoker = true);
ALTER VIEW entidades_con_contactos
SET (security_invoker = true);
-- Crear la tabla data-google-maps
create table if not exists "data-google-maps" (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    -- Información básica
    rubro_buscado text,
    title text,
    phone text,
    phone_unformatted text,
    website text,
    address text,
    street text,
    city text,
    postal_code text,
    state text,
    country_code text default 'AR',
    -- Ubicación
    latitude numeric,
    longitude numeric,
    plus_code text,
    -- Detalles del negocio
    category_name text,
    categories text,
    total_score numeric,
    reviews_count integer,
    opening_hours text,
    open_now text,
    price_level text,
    description text,
    -- Datos complejos (Arrays/Listas)
    images jsonb,
    attributes jsonb,
    service_options jsonb,
    -- Enlaces
    menu_link text,
    reservation_link text,
    order_link text,
    google_maps_url text
);
-- Habilitar RLS (opcional)
alter table "data-google-maps" enable row level security;
-- Crear una política para permitir inserciones públicas (si es necesario para n8n)
create policy "Allow public inserts" on "data-google-maps" for
insert with check (true);
-- Crear una política para permitir lectura pública
create policy "Allow public read access" on "data-google-maps" for
select using (true);