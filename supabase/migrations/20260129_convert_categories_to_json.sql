-- Migration: Convert categories to JSONB
-- Target Tables: data-google-maps, entidades
-- 1. Update data-google-maps table
DO $$ BEGIN -- Only alter if categories is still text
IF (
    SELECT data_type
    FROM information_schema.columns
    WHERE table_name = 'data-google-maps'
        AND column_name = 'categories'
) = 'text' THEN -- Temporary column for the conversion
ALTER TABLE "data-google-maps"
ADD COLUMN categories_new JSONB DEFAULT '[]';
-- Migrate data: string to json array
-- Handles formats like "Cat1, Cat2" or just "Cat1"
UPDATE "data-google-maps"
SET categories_new = (
        SELECT jsonb_agg(trim(val))
        FROM unnest(string_to_array(categories, ',')) AS val
        WHERE val IS NOT NULL
            AND trim(val) <> ''
    )
WHERE categories IS NOT NULL
    AND categories <> '';
-- Drop old, rename new
ALTER TABLE "data-google-maps" DROP COLUMN categories;
ALTER TABLE "data-google-maps"
    RENAME COLUMN categories_new TO categories;
END IF;
END $$;
-- 2. Update entidades table
DO $$ BEGIN -- Add categorias JSONB column if it doesn't exist
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'entidades'
        AND column_name = 'categorias'
) THEN -- Drop view that depends on categoria_id before altering column
DROP VIEW IF EXISTS entidades_con_contactos;
ALTER TABLE entidades
ADD COLUMN categorias JSONB DEFAULT '[]';
-- Migrate existing categoria_id to the new JSONB column
-- Format: [{"id": "uuid", "nombre": "name", "color": "hex"}]
UPDATE entidades e
SET categorias = jsonb_build_array(
        jsonb_build_object(
            'id',
            c.id,
            'nombre',
            c.nombre,
            'color',
            c.color
        )
    )
FROM categorias c
WHERE e.categoria_id = c.id;
-- Drop the old column and foreign key constraint
ALTER TABLE entidades DROP COLUMN categoria_id;
-- Recreate view with multiple categories support
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