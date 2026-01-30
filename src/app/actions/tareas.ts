'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { Tarea, TareaArea, TareaFormData, TareaAreaFormData } from '@/lib/types'

// --- AREAS ---

export async function getTareaAreas() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tareas_areas')
        .select('*')
        .order('nombre', { ascending: true })

    if (error) {
        console.error('Error fetching tarea areas:', error)
        return []
    }

    return data as TareaArea[]
}

export async function createTareaArea(formData: TareaAreaFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No autorizado' }

    const { data, error } = await supabase
        .from('tareas_areas')
        .insert({
            ...formData,
            user_id: user.id,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating tarea area:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'CREATE_TAREA_AREA',
        entityName: formData.nombre,
        details: { id: data.id },
    })

    revalidatePath('/dashboard/tareas')
    return { data }
}

export async function deleteTareaArea(id: string, nombre: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('tareas_areas').delete().eq('id', id)

    if (error) {
        console.error('Error deleting tarea area:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'DELETE_TAREA_AREA',
        entityName: nombre,
        details: { id },
    })

    revalidatePath('/dashboard/tareas')
    return { success: true }
}

// --- TAREAS ---

export async function getTareas(filters?: { area_id?: string; estado?: string; prioridad?: string }) {
    const supabase = await createClient()
    let query = supabase
        .from('tareas')
        .select('*, area:tareas_areas(*)')
        .order('created_at', { ascending: false })

    if (filters?.area_id) query = query.eq('area_id', filters.area_id)
    if (filters?.estado) query = query.eq('estado', filters.estado)
    if (filters?.prioridad) query = query.eq('prioridad', filters.prioridad)

    const { data, error } = await query

    if (error) {
        console.error('Error fetching tareas:', error)
        return []
    }

    return data as (Tarea & { area: TareaArea })[]
}

export async function createTarea(formData: TareaFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No autorizado' }

    // Clean dates and UUIDs
    const dataToInsert = {
        ...formData,
        user_id: user.id,
        fecha_limite: formData.fecha_limite || null,
        asignado_a: formData.asignado_a || null,
        area_id: formData.area_id || null,
        parent_id: formData.parent_id || null
    }

    const { data, error } = await supabase
        .from('tareas')
        .insert(dataToInsert)
        .select()
        .single()

    if (error) {
        console.error('Error creating tarea:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'CREATE_TAREA',
        entityName: formData.titulo,
        details: { id: data.id, asignado_a: formData.asignado_a, parent_id: formData.parent_id },
    })

    revalidatePath('/dashboard/tareas')
    return { data }
}

export async function updateTarea(id: string, formData: Partial<TareaFormData>) {
    const supabase = await createClient()

    // Clean data: convert empty strings to null
    const finalData = {
        ...formData,
        fecha_limite: formData.fecha_limite === '' ? null : formData.fecha_limite,
        asignado_a: formData.asignado_a === '' ? null : formData.asignado_a,
        area_id: formData.area_id === '' ? null : formData.area_id,
        parent_id: formData.parent_id === '' ? null : formData.parent_id
    }

    const { data, error } = await supabase
        .from('tareas')
        .update(finalData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating tarea:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'UPDATE_TAREA',
        entityName: data.titulo,
        details: { id, updates: formData },
    })

    revalidatePath('/dashboard/tareas')
    return { data }
}

export async function deleteTarea(id: string, titulo: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('tareas').delete().eq('id', id)

    if (error) {
        console.error('Error deleting tarea:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'DELETE_TAREA',
        entityName: titulo,
        details: { id },
    })

    revalidatePath('/dashboard/tareas')
    return { success: true }
}

export async function getTareaById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tareas')
        .select('*, area:tareas_areas(*)')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching tarea by id:', error)
        return null
    }

    return data as (Tarea & { area: TareaArea })
}

export async function getUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('perfiles')
        .select('id, email, nombre')
        .order('nombre', { ascending: true })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    return data
}
