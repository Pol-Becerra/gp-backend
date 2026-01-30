-- Migration: Convert postal codes to JSONB arrays
-- Target Tables: data-google-maps, entidades
-- 1. Update data-google-maps table
DO $$ BEGIN -- Only alter if postal_code is still text
IF (
    SELECT data_type
    FROM information_schema.columns
    WHERE table_name = 'data-google-maps'
        AND column_name = 'postal_code'
) = 'text' THEN -- Temporary column for the conversion
ALTER TABLE "data-google-maps"
ADD COLUMN postal_codes JSONB DEFAULT '[]';
-- Drop dependent view if exists (to allow column drop)
DROP VIEW IF EXISTS vw_data_google_maps;
-- Migrate data: string to json array
UPDATE "data-google-maps"
SET postal_codes = jsonb_build_array(postal_code)
WHERE postal_code IS NOT NULL
    AND postal_code <> '';
-- Drop old column
-- Drop old column
ALTER TABLE "data-google-maps" DROP COLUMN postal_code;
-- Recreate view
CREATE OR REPLACE VIEW vw_data_google_maps AS
SELECT *
FROM "data-google-maps";
END IF;
END $$;
-- 2. Update entidades table
DO $$ BEGIN -- Add codigos_postales JSONB column if it doesn't exist
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'entidades'
        AND column_name = 'codigos_postales'
) THEN -- Drop view before adding column since we use select * in view and it might need refresh
DROP VIEW IF EXISTS entidades_con_contactos;
ALTER TABLE entidades
ADD COLUMN codigos_postales JSONB DEFAULT '[]';
-- Recreate view (including new field if desired, but we keep it simple)
CREATE OR REPLACE VIEW entidades_con_contactos AS
SELECT e.*,
    (
        SELECT string_agg(cat->>'nombre', ', ')
        FROM jsonb_array_elements(e.categorias) AS cat
    ) as categoria_nombre,
    COALESCE(cont.total_contactos, 0) as total_contactos
FROM entidades e
    LEFT JOIN (
        SELECT entidad_id,
            COUNT(*) as total_contactos
        FROM contactos
        GROUP BY entidad_id
    ) cont ON e.id = cont.entidad_id;
ALTER VIEW entidades_con_contactos
SET (security_invoker = true);
END IF;
END $$;