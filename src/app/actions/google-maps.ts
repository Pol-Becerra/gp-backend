'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { GoogleMapsData, GoogleMapsFormData } from '@/lib/types'

export interface GetGoogleMapsDataOptions {
    title?: string
    rubro?: string
    website?: string
    phone?: string
    postalCode?: string
    etiqueta?: string
    page?: number
    limit?: number
}

export async function getGoogleMapsData(options: GetGoogleMapsDataOptions = {}) {
    const {
        title,
        rubro,
        website,
        phone,
        postalCode,
        etiqueta,
        page = 1,
        limit = 10
    } = options

    const supabase = await createClient()

    let query = supabase
        .from('data-google-maps')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (title) {
        query = query.ilike('title', `%${title}%`)
    }

    if (rubro) {
        query = query.ilike('rubro_buscado', `%${rubro}%`)
    }

    if (website) {
        query = query.ilike('website', `%${website}%`)
    }

    if (phone) {
        // Buscamos tanto en el teléfono formateado como en el original
        query = query.or(`phone.ilike.%${phone}%,phone_unformatted.ilike.%${phone}%`)
    }

    if (postalCode) {
        // search in jsonb array
        query = query.contains('postal_codes', [postalCode])
    }

    if (etiqueta) {
        query = query.contains('etiquetas', [etiqueta])
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching google maps data:', error)
        return { data: [], count: 0 }
    }

    return {
        data: (data as GoogleMapsData[]) || [],
        count: count || 0
    }
}

export async function getGoogleMapsEntryById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('data-google-maps')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching google maps entry:', error)
        return null
    }

    return data as GoogleMapsData
}

export async function createGoogleMapsEntry(formData: GoogleMapsFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Nota: La tabla tiene RLS que permite inserciones públicas según el esquema dado,
    // pero guardamos el log de auditoría si el usuario está autenticado.

    const { data, error } = await supabase
        .from('data-google-maps')
        .insert({
            rubro_buscado: formData.rubro_buscado,
            title: formData.title,
            phone: formData.phone,
            phone_unformatted: formData.phone_unformatted,
            website: formData.website,
            address: formData.address,
            street: formData.street,
            city: formData.city,
            postal_codes: formData.postal_codes || [],
            state: formData.state,
            country_code: formData.country_code || 'AR',
            latitude: formData.latitude,
            longitude: formData.longitude,
            plus_code: formData.plus_code,
            category_name: formData.category_name,
            categories: formData.categories,
            total_score: formData.total_score,
            reviews_count: formData.reviews_count,
            opening_hours: formData.opening_hours,
            open_now: formData.open_now,
            price_level: formData.price_level,
            description: formData.description,
            images: formData.images || [],
            attributes: formData.attributes || [],
            service_options: formData.service_options || [],
            menu_link: formData.menu_link,
            reservation_link: formData.reservation_link,
            order_link: formData.order_link,
            google_maps_url: formData.google_maps_url,
            etiquetas: formData.etiquetas || [],
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating google maps entry:', error)
        return { error: error.message }
    }

    if (user) {
        await logAction({
            action: 'CREATE_GOOGLE_MAPS_ENTRY',
            entityName: formData.title || 'Sin Título',
            details: { rubro: formData.rubro_buscado },
        })
    }

    revalidatePath('/dashboard/google-maps')

    return { data }
}

export async function updateGoogleMapsEntry(id: string, formData: GoogleMapsFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('data-google-maps')
        .update({
            rubro_buscado: formData.rubro_buscado,
            title: formData.title,
            phone: formData.phone,
            phone_unformatted: formData.phone_unformatted,
            website: formData.website,
            address: formData.address,
            street: formData.street,
            city: formData.city,
            postal_codes: formData.postal_codes || [],
            state: formData.state,
            country_code: formData.country_code,
            latitude: formData.latitude,
            longitude: formData.longitude,
            plus_code: formData.plus_code,
            category_name: formData.category_name,
            categories: formData.categories,
            total_score: formData.total_score,
            reviews_count: formData.reviews_count,
            opening_hours: formData.opening_hours,
            open_now: formData.open_now,
            price_level: formData.price_level,
            description: formData.description,
            images: formData.images,
            attributes: formData.attributes,
            service_options: formData.service_options,
            menu_link: formData.menu_link,
            reservation_link: formData.reservation_link,
            order_link: formData.order_link,
            google_maps_url: formData.google_maps_url,
            etiquetas: formData.etiquetas || [],
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating google maps entry:', error)
        return { error: error.message }
    }

    if (user) {
        await logAction({
            action: 'UPDATE_GOOGLE_MAPS_ENTRY',
            entityName: formData.title || 'Sin Título',
            details: { id },
        })
    }

    revalidatePath('/dashboard/google-maps')
    revalidatePath(`/dashboard/google-maps/${id}`)

    return { data }
}

export async function deleteGoogleMapsEntry(id: string, title?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('data-google-maps')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting google maps entry:', error)
        return { error: error.message }
    }

    if (user) {
        await logAction({
            action: 'DELETE_GOOGLE_MAPS_ENTRY',
            entityName: title || 'Sin Título',
            details: { id },
        })
    }

    revalidatePath('/dashboard/google-maps')

    return { success: true }
}

export async function passToEntidades(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No autorizado' }

    // 1. Obtener datos de Google Maps
    const { data: gmaps, error: fetchError } = await supabase
        .from('data-google-maps')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !gmaps) {
        return { error: 'No se encontró el registro de Google Maps' }
    }

    // 2. Mapear datos a Entidad
    const nuevaEntidad = {
        user_id: user.id,
        tipo: 'NEGOCIO', // Por defecto negocio, se puede ajustar
        nombre_comercial: gmaps.title || 'Sin Nombre',
        razon_social: null,
        cuit: null,
        descripcion: gmaps.description || gmaps.category_name,
        categorias: [], // Se podría mapear si existe correspondencia
        emails: [],
        telefonos: gmaps.phone ? [gmaps.phone] : [],
        redes_sociales: {
            website: gmaps.website || gmaps.google_maps_url,
        },
        direcciones: [
            {
                id: crypto.randomUUID(),
                tipo: 'comercial',
                calle: gmaps.street || gmaps.address || '',
                numero: '',
                ciudad: gmaps.city || '',
                provincia: gmaps.state || '',
                cp: (gmaps.postal_codes && gmaps.postal_codes.length > 0) ? gmaps.postal_codes[0] : '',
            }
        ],
        activo: true,
        codigos_postales: gmaps.postal_codes || [],
        notas: `Registro importado de Google Maps. Rubro: ${gmaps.rubro_buscado}`,
        etiquetas: ['importado', 'google maps']
    }

    // 3. Crear Entidad
    const { data: entidad, error: createError } = await supabase
        .from('entidades')
        .insert(nuevaEntidad)
        .select()
        .single()

    if (createError) {
        console.error('Error creating entidad from gmaps:', createError)
        return { error: 'Error al crear la entidad: ' + createError.message }
    }

    // 4. Actualizar registro de Google Maps con etiqueta "Pasado"
    const etiquetasActuales = gmaps.etiquetas || []
    if (!etiquetasActuales.includes('Pasado')) {
        await supabase
            .from('data-google-maps')
            .update({
                etiquetas: [...etiquetasActuales, 'Pasado']
            })
            .eq('id', id)
    }

    await logAction({
        action: 'CONVERT_GMAPS_TO_ENTIDAD',
        entityName: gmaps.title,
        details: { gmaps_id: id, entidad_id: entidad.id },
    })

    revalidatePath('/dashboard/google-maps')
    revalidatePath('/dashboard/entidades')

    return { success: true, entidadId: entidad.id }
}
