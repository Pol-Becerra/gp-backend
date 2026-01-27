'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { EntidadFormData, TipoEntidad } from '@/lib/types'

export async function getEntidades(search?: string, tipo?: TipoEntidad, categoriaId?: string) {
    const supabase = createClient()

    let query = supabase
        .from('entidades')
        .select(`
      *,
      categorias (id, nombre, color),
      contactos (id)
    `)
        .order('created_at', { ascending: false })

    if (search) {
        query = query.ilike('nombre_comercial', `%${search}%`)
    }

    if (tipo) {
        query = query.eq('tipo', tipo)
    }

    if (categoriaId) {
        query = query.eq('categoria_id', categoriaId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching entidades:', error)
        return []
    }

    return data?.map(e => ({
        ...e,
        categoria: e.categorias,
        _count: { contactos: e.contactos?.length || 0 },
    })) || []
}

export async function getEntidadById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('entidades')
        .select(`
      *,
      categorias (id, nombre, color),
      contactos (*)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching entidad:', error)
        return null
    }

    return {
        ...data,
        categoria: data.categorias,
        contactos: data.contactos || [],
    }
}

export async function createEntidad(formData: EntidadFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    const { data, error } = await supabase
        .from('entidades')
        .insert({
            user_id: user.id,
            tipo: formData.tipo,
            nombre_comercial: formData.nombre_comercial,
            razon_social: formData.razon_social || null,
            cuit: formData.cuit || null,
            descripcion: formData.descripcion || null,
            categoria_id: formData.categoria_id || null,
            emails: formData.emails.filter(Boolean),
            telefonos: formData.telefonos.filter(Boolean),
            redes_sociales: formData.redes_sociales,
            direcciones: formData.direcciones,
            activo: formData.activo,
            notas: formData.notas || null,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating entidad:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'CREATE_ENTIDAD',
        entityName: formData.nombre_comercial,
        details: { tipo: formData.tipo, categoria_id: formData.categoria_id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/entidades')

    return { data }
}

export async function updateEntidad(id: string, formData: EntidadFormData) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('entidades')
        .update({
            tipo: formData.tipo,
            nombre_comercial: formData.nombre_comercial,
            razon_social: formData.razon_social || null,
            cuit: formData.cuit || null,
            descripcion: formData.descripcion || null,
            categoria_id: formData.categoria_id || null,
            emails: formData.emails.filter(Boolean),
            telefonos: formData.telefonos.filter(Boolean),
            redes_sociales: formData.redes_sociales,
            direcciones: formData.direcciones,
            activo: formData.activo,
            notas: formData.notas || null,
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating entidad:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'UPDATE_ENTIDAD',
        entityName: formData.nombre_comercial,
        details: { id, campos_actualizados: Object.keys(formData) },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/entidades')
    revalidatePath(`/dashboard/entidades/${id}`)

    return { data }
}

export async function deleteEntidad(id: string, nombre: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('entidades')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting entidad:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'DELETE_ENTIDAD',
        entityName: nombre,
        details: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/entidades')

    return { success: true }
}
