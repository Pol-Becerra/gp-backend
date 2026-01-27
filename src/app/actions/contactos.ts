'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { ContactoFormData } from '@/lib/types'

export async function getContactos(search?: string) {
    const supabase = createClient()

    let query = supabase
        .from('contactos')
        .select(`
      *,
      entidades (id, nombre_comercial, tipo)
    `)
        .order('created_at', { ascending: false })

    if (search) {
        query = query.or(`nombre_completo.ilike.%${search}%,cargo.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching contactos:', error)
        return []
    }

    return data?.map(c => ({
        ...c,
        entidad: c.entidades,
    })) || []
}

export async function getContactosByEntidad(entidadId: string, search?: string) {
    const supabase = createClient()

    let query = supabase
        .from('contactos')
        .select('*')
        .eq('entidad_id', entidadId)
        .order('es_principal', { ascending: false })
        .order('created_at', { ascending: false })

    if (search) {
        query = query.or(`nombre_completo.ilike.%${search}%,cargo.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching contactos:', error)
        return []
    }

    return data || []
}

export async function getContactoById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('contactos')
        .select(`
      *,
      entidades (id, nombre_comercial)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching contacto:', error)
        return null
    }

    return {
        ...data,
        entidad: data.entidades,
    }
}

export async function createContacto(formData: ContactoFormData) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('contactos')
        .insert({
            entidad_id: formData.entidad_id,
            nombre_completo: formData.nombre_completo,
            cargo: formData.cargo || null,
            rol: formData.rol,
            telefonos: formData.telefonos.filter(Boolean),
            emails: formData.emails.filter(Boolean),
            redes_sociales: formData.redes_sociales || {},
            es_principal: formData.es_principal,
            notas: formData.notas || null,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating contacto:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'CREATE_CONTACTO',
        entityName: formData.nombre_completo,
        details: { entidad_id: formData.entidad_id, rol: formData.rol },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/contactos')
    revalidatePath(`/dashboard/entidades/${formData.entidad_id}`)

    return { data }
}

export async function updateContacto(id: string, formData: ContactoFormData) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('contactos')
        .update({
            nombre_completo: formData.nombre_completo,
            cargo: formData.cargo || null,
            rol: formData.rol,
            telefonos: formData.telefonos.filter(Boolean),
            emails: formData.emails.filter(Boolean),
            redes_sociales: formData.redes_sociales || {},
            es_principal: formData.es_principal,
            notas: formData.notas || null,
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating contacto:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'UPDATE_CONTACTO',
        entityName: formData.nombre_completo,
        details: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/contactos')
    revalidatePath(`/dashboard/entidades/${formData.entidad_id}`)

    return { data }
}

export async function deleteContacto(id: string, nombre: string, entidadId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('contactos')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting contacto:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'DELETE_CONTACTO',
        entityName: nombre,
        details: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/contactos')
    revalidatePath(`/dashboard/entidades/${entidadId}`)

    return { success: true }
}
