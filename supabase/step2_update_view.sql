-- PASO 2: Ejecutar este script DESPUÉS del Paso 1
-- Actualiza la vista de estadísticas para contar los Servicios.
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