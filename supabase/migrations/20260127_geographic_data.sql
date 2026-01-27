-- migration for geographic data (Argentina)
-- 1. Create Provincias Table
CREATE TABLE IF NOT EXISTS provincias (
    id TEXT PRIMARY KEY,
    -- Using Georef IDs (e.g., '02', '06')
    nombre TEXT NOT NULL
);
-- 2. Create Partidos Table
CREATE TABLE IF NOT EXISTS partidos (
    id TEXT PRIMARY KEY,
    -- Using Georef IDs (e.g., '06007')
    nombre TEXT NOT NULL,
    provincia_id TEXT NOT NULL REFERENCES provincias(id) ON DELETE CASCADE
);
-- 3. Create Localidades Table
CREATE TABLE IF NOT EXISTS localidades (
    id TEXT PRIMARY KEY,
    -- Using Georef IDs
    nombre TEXT NOT NULL,
    partido_id TEXT NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    cp TEXT -- Postal code
);
-- 4. Enable RLS
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE localidades ENABLE ROW LEVEL SECURITY;
-- 5. Create Public Read Policies
CREATE POLICY "Allow public read access on provincias" ON provincias FOR
SELECT USING (true);
CREATE POLICY "Allow public read access on partidos" ON partidos FOR
SELECT USING (true);
CREATE POLICY "Allow public read access on localidades" ON localidades FOR
SELECT USING (true);
-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_partidos_provincia ON partidos(provincia_id);
CREATE INDEX IF NOT EXISTS idx_localidades_partido ON localidades(partido_id);
CREATE INDEX IF NOT EXISTS idx_localidades_cp ON localidades(cp);