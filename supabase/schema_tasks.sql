-- ============================================
-- TASKS MANAGEMENT SCHEMA (Idempotent & Upgrade-Safe)
-- ============================================
-- 1. Custom ENUM Types
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'prioridad_tarea'
) THEN CREATE TYPE prioridad_tarea AS ENUM ('Baja', 'Media', 'Alta', 'Crítica');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'estado_tarea'
) THEN CREATE TYPE estado_tarea AS ENUM (
    'Pendiente',
    'En Progreso',
    'En Revisión',
    'Completada',
    'Cancelada'
);
END IF;
END $$;
-- 2. Task Areas Table
CREATE TABLE IF NOT EXISTS tareas_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nombre TEXT NOT NULL,
    color TEXT DEFAULT '#39FF14',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3.1. Ensure all columns exist (Upgrade Path)
DO $$ BEGIN -- Column: area_id
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'area_id'
) THEN
ALTER TABLE tareas
ADD COLUMN area_id UUID REFERENCES tareas_areas(id) ON DELETE
SET NULL;
END IF;
-- Column: parent_id
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'parent_id'
) THEN
ALTER TABLE tareas
ADD COLUMN parent_id UUID REFERENCES tareas(id) ON DELETE CASCADE;
END IF;
-- Column: descripcion
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'descripcion'
) THEN
ALTER TABLE tareas
ADD COLUMN descripcion TEXT;
END IF;
-- Column: prioridad
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'prioridad'
) THEN
ALTER TABLE tareas
ADD COLUMN prioridad prioridad_tarea DEFAULT 'Media';
END IF;
-- Column: estado
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'estado'
) THEN
ALTER TABLE tareas
ADD COLUMN estado estado_tarea DEFAULT 'Pendiente';
END IF;
-- Column: asignado_a
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'asignado_a'
) THEN
ALTER TABLE tareas
ADD COLUMN asignado_a UUID REFERENCES auth.users(id) ON DELETE
SET NULL;
END IF;
-- Column: fecha_limite
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tareas'
        AND column_name = 'fecha_limite'
) THEN
ALTER TABLE tareas
ADD COLUMN fecha_limite TIMESTAMP WITH TIME ZONE;
END IF;
END $$;
-- 4. Enable RLS
ALTER TABLE tareas_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
-- 5. RLS Policies for Areas
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view areas they created or are assigned to tasks in" ON tareas_areas;
DROP POLICY IF EXISTS "Users can create their own areas" ON tareas_areas;
DROP POLICY IF EXISTS "Users can update their own areas" ON tareas_areas;
DROP POLICY IF EXISTS "Users can delete their own areas" ON tareas_areas;
END $$;
CREATE POLICY "Users can view areas they created or are assigned to tasks in" ON tareas_areas FOR
SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1
            FROM tareas
            WHERE tareas.area_id = tareas_areas.id
                AND (
                    tareas.user_id = auth.uid()
                    OR tareas.asignado_a = auth.uid()
                )
        )
    );
CREATE POLICY "Users can create their own areas" ON tareas_areas FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own areas" ON tareas_areas FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own areas" ON tareas_areas FOR DELETE USING (auth.uid() = user_id);
-- 6. RLS Policies for Tasks
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view tasks they created or are assigned to" ON tareas;
DROP POLICY IF EXISTS "Users can create tasks" ON tareas;
DROP POLICY IF EXISTS "Users can update tasks they created or are assigned to" ON tareas;
DROP POLICY IF EXISTS "Users can delete tasks they created" ON tareas;
END $$;
CREATE POLICY "Users can view tasks they created or are assigned to" ON tareas FOR
SELECT USING (
        auth.uid() = user_id
        OR auth.uid() = asignado_a
    );
CREATE POLICY "Users can create tasks" ON tareas FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update tasks they created or are assigned to" ON tareas FOR
UPDATE USING (
        auth.uid() = user_id
        OR auth.uid() = asignado_a
    );
CREATE POLICY "Users can delete tasks they created" ON tareas FOR DELETE USING (auth.uid() = user_id);
-- 7. Triggers for updated_at
DROP TRIGGER IF EXISTS update_tareas_areas_updated_at ON tareas_areas;
CREATE TRIGGER update_tareas_areas_updated_at BEFORE
UPDATE ON tareas_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_tareas_updated_at ON tareas;
CREATE TRIGGER update_tareas_updated_at BEFORE
UPDATE ON tareas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_tareas_user ON tareas(user_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignado ON tareas(asignado_a);
CREATE INDEX IF NOT EXISTS idx_tareas_area ON tareas(area_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_prioridad ON tareas(prioridad);
CREATE INDEX IF NOT EXISTS idx_tareas_parent ON tareas(parent_id);