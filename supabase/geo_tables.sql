-- Tabla de Provincias
CREATE TABLE IF NOT EXISTS provincias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Tabla de Partidos
CREATE TABLE IF NOT EXISTS partidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provincia_id UUID NOT NULL REFERENCES provincias(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provincia_id, nombre)
);
-- Tabla de Localidades
CREATE TABLE IF NOT EXISTS localidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partido_id UUID NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    cp TEXT,
    -- Código Postal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Índices para mejorar la performance
CREATE INDEX IF NOT EXISTS idx_partidos_provincia ON partidos(provincia_id);
CREATE INDEX IF NOT EXISTS idx_localidades_partido ON localidades(partido_id);
-- Habilitar RLS (Opcional, pero recomendado)
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE localidades ENABLE ROW LEVEL SECURITY;
-- Políticas de lectura pública (cualquiera puede ver)
CREATE POLICY "Accesible para todos" ON provincias FOR
SELECT USING (true);
CREATE POLICY "Accesible para todos" ON partidos FOR
SELECT USING (true);
CREATE POLICY "Accesible para todos" ON localidades FOR
SELECT USING (true);
-- Políticas de escritura (solo autenticados)
CREATE POLICY "Solo usuarios autenticados pueden insertar" ON provincias FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden actualizar" ON provincias FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden eliminar" ON provincias FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden insertar" ON partidos FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden actualizar" ON partidos FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden eliminar" ON partidos FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden insertar" ON localidades FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden actualizar" ON localidades FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Solo usuarios autenticados pueden eliminar" ON localidades FOR DELETE USING (auth.role() = 'authenticated');