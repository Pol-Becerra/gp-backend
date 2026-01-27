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
    page?: number
    limit?: number
}

export async function getGoogleMapsData(options: GetGoogleMapsDataOptions = {}) {
    const {
        title,
        rubro,
        website,
        phone,
        page = 1,
        limit = 10
    } = options

    const supabase = createClient()

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
    const supabase = createClient()

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
    const supabase = createClient()
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
            postal_code: formData.postal_code,
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
    const supabase = createClient()
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
            postal_code: formData.postal_code,
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
    const supabase = createClient()
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
