-- PASO 1: Ejecutar este script PRIMERO
-- Agrega el valor 'SERVICIO' a la lista de tipos permitidos.
ALTER TYPE tipo_entidad
ADD VALUE IF NOT EXISTS 'SERVICIO';
-- Una vez que veas "Success" o "No rows returned", pasa al archivo step2_update_view.sql