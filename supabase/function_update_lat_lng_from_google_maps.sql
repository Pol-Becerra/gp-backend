CREATE OR REPLACE FUNCTION public.update_lat_lng_from_google_maps() RETURNS void LANGUAGE plpgsql AS $$
DECLARE rec RECORD;
lat numeric;
lng numeric;
BEGIN FOR rec IN
SELECT id,
    google_maps_url
FROM "data-google-maps"
WHERE (
        latitude IS NULL
        OR longitude IS NULL
    )
    AND google_maps_url IS NOT NULL LOOP -- Extraer latitude (!3d-34.123!)
    lat := (
        regexp_match(rec.google_maps_url, '!3d(-?[0-9]+\.[0-9]+)')
    ) [1]::numeric;
-- Extraer longitude (!4d-58.456!)
lng := (
    regexp_match(rec.google_maps_url, '!4d(-?[0-9]+\.[0-9]+)')
) [1]::numeric;
-- Actualizar solo si ambos existen
IF lat IS NOT NULL
AND lng IS NOT NULL THEN
UPDATE "data-google-maps"
SET latitude = lat,
    longitude = lng
WHERE id = rec.id;
END IF;
END LOOP;
END;
$$;