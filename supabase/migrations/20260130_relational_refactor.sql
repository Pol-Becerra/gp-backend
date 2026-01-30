-- 1. Categorías (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.entidad_categorias (
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (entidad_id, categoria_id)
);
CREATE INDEX IF NOT EXISTS idx_entidad_categorias_entidad ON public.entidad_categorias(entidad_id);
CREATE INDEX IF NOT EXISTS idx_entidad_categorias_categoria ON public.entidad_categorias(categoria_id);
-- 2. Cobertura por Código Postal
CREATE TABLE IF NOT EXISTS public.entidad_cobertura (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    cp TEXT NOT NULL,
    localidad_id TEXT REFERENCES public.localidades(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cobertura_entidad ON public.entidad_cobertura(entidad_id);
CREATE INDEX IF NOT EXISTS idx_cobertura_cp ON public.entidad_cobertura(cp);
-- 3. Sucursales
CREATE TABLE IF NOT EXISTS public.sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    nombre TEXT,
    es_principal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sucursales_entidad ON public.sucursales(entidad_id);
-- 4. Direcciones (Vinculadas a Sucursales)
CREATE TABLE IF NOT EXISTS public.direcciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID REFERENCES public.sucursales(id) ON DELETE CASCADE,
    calle TEXT,
    localidad_id TEXT REFERENCES public.localidades(id),
    cp TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_direcciones_cp ON public.direcciones(cp);
CREATE INDEX IF NOT EXISTS idx_direcciones_localidad ON public.direcciones(localidad_id);
-- 5. Emails y Teléfonos
CREATE TABLE IF NOT EXISTS public.entidad_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    tipo TEXT DEFAULT 'general'
);
CREATE INDEX IF NOT EXISTS idx_entidad_emails_entidad ON public.entidad_emails(entidad_id);
CREATE TABLE IF NOT EXISTS public.entidad_telefonos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    telefono TEXT NOT NULL,
    whatsapp BOOLEAN DEFAULT false,
    tipo TEXT DEFAULT 'general'
);
CREATE INDEX IF NOT EXISTS idx_entidad_telefonos_entidad ON public.entidad_telefonos(entidad_id);
-- 6. Redes Sociales
CREATE TABLE IF NOT EXISTS public.redes_sociales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS public.entidad_redes (
    entidad_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    red_social_id UUID REFERENCES public.redes_sociales(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    PRIMARY KEY (entidad_id, red_social_id)
);