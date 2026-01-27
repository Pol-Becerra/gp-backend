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