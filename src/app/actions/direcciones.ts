'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { Direccion } from '@/lib/types'
import { randomUUID } from 'crypto'

export async function addDireccion(entidadId: string, direccionData: Omit<Direccion, 'id'>) {
    const supabase = createClient()

    // 1. Obtener entidad actual
    const { data: entidad, error: fetchError } = await supabase
        .from('entidades')
        .select('direcciones, nombre_comercial')
        .eq('id', entidadId)
        .single()

    if (fetchError || !entidad) {
        console.error('Error fetching entidad:', fetchError)
        return { error: 'No se pudo encontrar la entidad' }
    }

    // 2. Crear nueva dirección con ID
    const nuevaDireccion: Direccion = {
        ...direccionData,
        id: randomUUID(),
    }

    const direccionesActuales = (entidad.direcciones as Direccion[]) || []
    const nuevasDirecciones = [...direccionesActuales, nuevaDireccion]

    // 3. Actualizar entidad
    const { error: updateError } = await supabase
        .from('entidades')
        .update({ direcciones: nuevasDirecciones })
        .eq('id', entidadId)

    if (updateError) {
        console.error('Error updating direcciones:', updateError)
        return { error: 'Error al guardar la dirección' }
    }

    await logAction({
        action: 'UPDATE_ENTIDAD',
        entityName: entidad.nombre_comercial,
        details: {
            id: entidadId,
            sub_action: 'ADD_DIRECCION',
            direccion: nuevaDireccion
        },
    })

    revalidatePath(`/dashboard/entidades/${entidadId}`)
    return { success: true }
}

export async function updateDireccion(entidadId: string, direccion: Direccion) {
    const supabase = createClient()

    // 1. Obtener entidad actual
    const { data: entidad, error: fetchError } = await supabase
        .from('entidades')
        .select('direcciones, nombre_comercial')
        .eq('id', entidadId)
        .single()

    if (fetchError || !entidad) {
        return { error: 'No se pudo encontrar la entidad' }
    }

    const direccionesActuales = (entidad.direcciones as Direccion[]) || []

    // 2. Buscar y actualizar
    const index = direccionesActuales.findIndex(d => d.id === direccion.id)
    if (index === -1) {
        return { error: 'Dirección no encontrada' }
    }

    const nuevasDirecciones = [...direccionesActuales]
    nuevasDirecciones[index] = direccion

    // 3. Guardar cambios
    const { error: updateError } = await supabase
        .from('entidades')
        .update({ direcciones: nuevasDirecciones })
        .eq('id', entidadId)

    if (updateError) {
        console.error('Error updating direcciones:', updateError)
        return { error: 'Error al actualizar la dirección' }
    }

    await logAction({
        action: 'UPDATE_ENTIDAD',
        entityName: entidad.nombre_comercial,
        details: {
            id: entidadId,
            sub_action: 'UPDATE_DIRECCION',
            direccion_id: direccion.id
        },
    })

    revalidatePath(`/dashboard/entidades/${entidadId}`)
    return { success: true }
}

export async function deleteDireccion(entidadId: string, direccionId: string) {
    const supabase = createClient()

    // 1. Obtener entidad actual
    const { data: entidad, error: fetchError } = await supabase
        .from('entidades')
        .select('direcciones, nombre_comercial')
        .eq('id', entidadId)
        .single()

    if (fetchError || !entidad) {
        return { error: 'No se pudo encontrar la entidad' }
    }

    const direccionesActuales = (entidad.direcciones as Direccion[]) || []

    // 2. Filtrar
    const nuevasDirecciones = direccionesActuales.filter(d => d.id !== direccionId)

    // 3. Guardar cambios
    const { error: updateError } = await supabase
        .from('entidades')
        .update({ direcciones: nuevasDirecciones })
        .eq('id', entidadId)

    if (updateError) {
        console.error('Error updating direcciones:', updateError)
        return { error: 'Error al eliminar la dirección' }
    }

    await logAction({
        action: 'UPDATE_ENTIDAD',
        entityName: entidad.nombre_comercial,
        details: {
            id: entidadId,
            sub_action: 'DELETE_DIRECCION',
            direccion_id: direccionId
        },
    })

    revalidatePath(`/dashboard/entidades/${entidadId}`)
    return { success: true }
}

export async function getDireccion(entidadId: string, direccionId: string) {
    const supabase = createClient()

    const { data: entidad, error } = await supabase
        .from('entidades')
        .select('direcciones')
        .eq('id', entidadId)
        .single()

    if (error || !entidad) {
        return null
    }

    const direcciones = (entidad.direcciones as Direccion[]) || []
    return direcciones.find(d => d.id === direccionId) || null
}
