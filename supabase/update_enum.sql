-- PASO 1: Ejecutar SOLO este bloque primero y confirmar éxito
-- Esto agrega el valor al enum.
ALTER TYPE tipo_entidad
ADD VALUE IF NOT EXISTS 'SERVICIO';
-- -----------------------------------------------------------------------
-- PAUSA: Asegúrate de que el comando anterior se haya ejecutado correctamente.
-- -----------------------------------------------------------------------
-- PASO 2: Ejecutar este bloque DESPUÉS de haber completado el Paso 1
-- Esto actualiza la vista para usar el nuevo valor.
DROP VIEW IF EXISTS user_stats;
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
    COUNT(*) FILTER (
        WHERE tipo = 'SERVICIO'
    ) as total_servicios,
    COUNT(*) as total_entidades,
    COUNT(*) FILTER (
        WHERE activo = true
    ) as entidades_activas,
    COUNT(*) FILTER (
        WHERE created_at > NOW() - INTERVAL '30 days'
    ) as nuevas_ultimo_mes
FROM entidades
GROUP BY user_id;
ALTER VIEW user_stats
SET (security_invoker = true);