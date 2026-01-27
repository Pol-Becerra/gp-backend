-- Migration: Add parent_id to tareas table for nested tasks
ALTER TABLE tareas
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES tareas(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_tareas_parent ON tareas(parent_id);