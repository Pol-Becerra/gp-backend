-- Migration to add etiquetas field for status tracking
-- Tables: data-google-maps and entidades
-- 1. Add column to data-google-maps
ALTER TABLE "data-google-maps"
ADD COLUMN IF NOT EXISTS etiquetas JSONB DEFAULT '[]';
-- 2. Add column to entidades
ALTER TABLE entidades
ADD COLUMN IF NOT EXISTS etiquetas JSONB DEFAULT '[]';
-- Add comments for documentation
COMMENT ON COLUMN "data-google-maps".etiquetas IS 'Lista de etiquetas de estado (revisado, ya no existe, contactado, rechazado, etc.)';
COMMENT ON COLUMN entidades.etiquetas IS 'Lista de etiquetas de estado (revisado, ya no existe, contactado, rechazado, etc.)';
-- Optional: Create a GIN index if you need to search by tag efficiently
CREATE INDEX IF NOT EXISTS idx_entidades_etiquetas ON entidades USING GIN (etiquetas);
CREATE INDEX IF NOT EXISTS idx_google_maps_etiquetas ON "data-google-maps" USING GIN (etiquetas);