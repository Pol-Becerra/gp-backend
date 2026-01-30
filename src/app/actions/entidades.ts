'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { EntidadFormData, TipoEntidad } from '@/lib/types'

export async function getEntidades(search?: string, tipo?: TipoEntidad, categoriaId?: string, postalCode?: string, etiqueta?: string) {
    const supabase = await createClient()

    // Construct Select: Use !inner only if filtering is active to avoid excluding data
    let selectString = `
        *,
        contactos (id),
        sucursales (
            id, nombre, es_principal,
            direcciones (id, calle, cp, localidad_id)
        ),
        entidad_categorias${categoriaId ? '!inner' : ''} (
            categoria:categorias (id, nombre, color)
        ),
        entidad_cobertura (cp, localidad_id),
        entidad_emails (email, tipo),
        entidad_telefonos (telefono, tipo),
        entidad_redes (
            url,
            red_social:redes_sociales (nombre)
        )
    `

    let query = supabase.from('entidades').select(selectString).order('created_at', { ascending: false })

    if (search) {
        query = query.ilike('nombre_comercial', `%${search}%`)
    }

    if (tipo) {
        query = query.eq('tipo', tipo)
    }

    if (categoriaId) {
        query = query.eq('entidad_categorias.categoria_id', categoriaId)
    }

    if (postalCode) {
        // Fallback or use relational filter if we added coverage !inner
        // Using JSONB for simple search if still populated, OR text search on coverage?
        // Let's rely on JSONB for now as it's safe until full migration
        query = query.contains('codigos_postales', [postalCode])
    }

    if (etiqueta) {
        query = query.contains('etiquetas', [etiqueta])
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching entidades:', error)
        return []
    }

    // Map relational data to flat UI structure
    return data?.map((e: any) => ({
        ...e,
        // Computed/Mapped fields with JSONB Fallback
        categorias: (e.entidad_categorias?.length > 0)
            ? e.entidad_categorias.map((rel: any) => rel.categoria)
            : (e.categorias || []),

        emails: (e.entidad_emails?.length > 0)
            ? e.entidad_emails.map((rel: any) => rel.email)
            : (e.emails || []),

        telefonos: (e.entidad_telefonos?.length > 0)
            ? e.entidad_telefonos.map((rel: any) => rel.telefono)
            : (e.telefonos || []),

        codigos_postales: (e.entidad_cobertura?.length > 0)
            ? e.entidad_cobertura.map((rel: any) => rel.cp)
            : (e.codigos_postales || []),

        // Redes Sociales: Fallback logic
        redes_sociales: (e.entidad_redes?.length > 0)
            ? e.entidad_redes.reduce((acc: any, curr: any) => {
                if (curr.red_social?.nombre) {
                    acc[curr.red_social.nombre.toLowerCase()] = curr.url
                }
                return acc
            }, {})
            : (e.redes_sociales || {}),

        // Direcciones: flattened from sucursales OR fallback (if we had a JSONB addresses column, but we didn't strictly have one named 'direcciones' as JSONB in the original Type definition? 
        // Original definition shows 'direcciones: Direccion[]'. 
        // In Supabase schema it was jsonb 'direcciones'.
        direcciones: (e.sucursales?.length > 0)
            ? e.sucursales.flatMap((suc: any) =>
                suc.direcciones?.map((dir: any) => ({
                    ...dir,
                    sucursal_id: suc.id
                }))
            )
            : (e.direcciones || []),

        _count: { contactos: e.contactos?.length || 0 },
    })) || []
}

export async function getEntidadById(id: string) {
    const supabase = await createClient()

    // Same select logic as list but single
    const selectString = `
        *,
        contactos (*),
        sucursales (
            id, nombre, es_principal,
            direcciones (id, calle, cp, localidad_id)
        ),
        entidad_categorias (
            categoria:categorias (id, nombre, color)
        ),
        entidad_cobertura (cp, localidad_id),
        entidad_emails (email, tipo),
        entidad_telefonos (telefono, tipo),
        entidad_redes (
            url,
            red_social:redes_sociales (nombre)
        )
    `

    const { data, error } = await supabase
        .from('entidades')
        .select(selectString)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching entidad:', error)
        return null
    }

    // Map relational data to flat UI structure
    const mapped = {
        ...data,
        categorias: (data.entidad_categorias?.length > 0)
            ? data.entidad_categorias.map((rel: any) => rel.categoria)
            : (data.categorias || []),

        emails: (data.entidad_emails?.length > 0)
            ? data.entidad_emails.map((rel: any) => rel.email)
            : (data.emails || []),

        telefonos: (data.entidad_telefonos?.length > 0)
            ? data.entidad_telefonos.map((rel: any) => rel.telefono)
            : (data.telefonos || []),

        codigos_postales: (data.entidad_cobertura?.length > 0)
            ? data.entidad_cobertura.map((rel: any) => rel.cp)
            : (data.codigos_postales || []),

        redes_sociales: (data.entidad_redes?.length > 0)
            ? data.entidad_redes.reduce((acc: any, curr: any) => {
                if (curr.red_social?.nombre) {
                    acc[curr.red_social.nombre.toLowerCase()] = curr.url
                }
                return acc
            }, {})
            : (data.redes_sociales || {}),

        direcciones: (data.sucursales?.length > 0)
            ? data.sucursales.flatMap((suc: any) =>
                suc.direcciones?.map((dir: any) => ({
                    ...dir,
                    sucursal_id: suc.id
                }))
            )
            : (data.direcciones || []),

        contactos: data.contactos || [],
    }

    return mapped
}

// CREATE ENTIDAD RELATIONAL LOGIC
export async function createEntidad(formData: EntidadFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No autorizado' }

    // 1. Insert Entity
    const { data: entity, error } = await supabase
        .from('entidades')
        .insert({
            user_id: user.id,
            tipo: formData.tipo,
            nombre_comercial: formData.nombre_comercial,
            razon_social: formData.razon_social || null,
            cuit: formData.cuit || null,
            descripcion: formData.descripcion || null,
            // JSONB kept for backup/sync until frontend fully updated or migration done
            categorias: formData.categorias,
            activo: formData.activo,
            notas: formData.notas || null,
            codigos_postales: formData.codigos_postales || [],
            etiquetas: formData.etiquetas || [],
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating entidad:', error)
        return { error: error.message }
    }

    const entidadId = entity.id

    // 2. Insert Relations
    const promises = []

    // Categories
    if (formData.categorias?.length) {
        const catInserts = formData.categorias.map(c => ({ entidad_id: entidadId, categoria_id: c.id }))
        promises.push(supabase.from('entidad_categorias').insert(catInserts))
    }

    // Emails
    if (formData.emails?.length) {
        const emailInserts = formData.emails.filter(Boolean).map(e => ({ entidad_id: entidadId, email: e, tipo: 'general' }))
        promises.push(supabase.from('entidad_emails').insert(emailInserts))
    }

    // Phones
    if (formData.telefonos?.length) {
        const telInserts = formData.telefonos.filter(Boolean).map(t => ({ entidad_id: entidadId, telefono: t, tipo: 'general' }))
        promises.push(supabase.from('entidad_telefonos').insert(telInserts))
    }

    // Coverage
    if (formData.codigos_postales?.length) {
        const cpInserts = formData.codigos_postales.map(cp => ({ entidad_id: entidadId, cp }))
        promises.push(supabase.from('entidad_cobertura').insert(cpInserts))
    }

    // Addresses (Simple one branch logic)
    if (formData.direcciones?.length) {
        // Create default branch
        const { data: suc } = await supabase.from('sucursales').insert({
            entidad_id: entidadId,
            nombre: 'Principal',
            es_principal: true
        }).select().single()

        if (suc) {
            const dirInserts = formData.direcciones.map(d => ({
                sucursal_id: suc.id,
                calle: d.calle,
                cp: d.cp,
                localidad_id: d.localidad_id
            }))
            promises.push(supabase.from('direcciones').insert(dirInserts))
        }
    }

    // Socials
    if (formData.redes_sociales && Object.keys(formData.redes_sociales).length > 0) {
        const { data: redesSocialesMap, error: redesError } = await supabase
            .from('redes_sociales')
            .select('id, nombre')

        if (redesError) {
            console.error('Error fetching redes_sociales for createEntidad:', redesError)
        } else if (redesSocialesMap) {
            const redesInserts = Object.entries(formData.redes_sociales)
                .map(([nombre, url]) => {
                    if (!url) return null
                    const redSocial = redesSocialesMap.find(r => r.nombre.toLowerCase() === nombre.toLowerCase())
                    return redSocial ? { entidad_id: entidadId, red_social_id: redSocial.id, url } : null
                })
                .filter(Boolean)

            if (redesInserts.length) {
                promises.push(supabase.from('entidad_redes').insert(redesInserts))
            }
        }
    }

    await Promise.all(promises)

    await logAction({
        action: 'CREATE_ENTIDAD',
        entityName: formData.nombre_comercial,
        details: { tipo: formData.tipo },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/entidades')

    return { data: entity }
}

// This function requires a major overhaul to handle relational updates.
// We must update the main entity, then update related tables (delete+insert or upsert).
export async function updateEntidad(id: string, formData: EntidadFormData) {
    const supabase = await createClient()

    // 1. Update basic fields
    const { data: entity, error } = await supabase
        .from('entidades')
        .update({
            tipo: formData.tipo,
            nombre_comercial: formData.nombre_comercial,
            razon_social: formData.razon_social || null,
            cuit: formData.cuit || null,
            descripcion: formData.descripcion || null,
            activo: formData.activo,
            notas: formData.notas || null,
            etiquetas: formData.etiquetas || [],
            // Deprecated fields kept for sync if needed, or ignored:
            codigos_postales: formData.codigos_postales || [],
            categorias: formData.categorias // Keeping JSONB for now to avoid UI break before migration?
        })
        .eq('id', id)
        .select()
        .single()

    if (error) return { error: error.message }

    // 2. Update Relations (Simplest strategy: Delete all and recreate)
    // Categories
    if (formData.categorias) {
        await supabase.from('entidad_categorias').delete().eq('entidad_id', id)
        const catInserts = formData.categorias.map(c => ({ entidad_id: id, categoria_id: c.id }))
        if (catInserts.length) await supabase.from('entidad_categorias').insert(catInserts)
    }

    // Emails
    if (formData.emails) {
        await supabase.from('entidad_emails').delete().eq('entidad_id', id)
        const emailInserts = formData.emails.filter(Boolean).map(e => ({ entidad_id: id, email: e, tipo: 'general' }))
        if (emailInserts.length) await supabase.from('entidad_emails').insert(emailInserts)
    }

    // Phones
    if (formData.telefonos) {
        await supabase.from('entidad_telefonos').delete().eq('entidad_id', id)
        const telInserts = formData.telefonos.filter(Boolean).map(t => ({ entidad_id: id, telefono: t, tipo: 'general' }))
        if (telInserts.length) await supabase.from('entidad_telefonos').insert(telInserts)
    }

    // Coverage (Codigos Postales)
    if (formData.codigos_postales) {
        await supabase.from('entidad_cobertura').delete().eq('entidad_id', id)
        const cpInserts = formData.codigos_postales.map(cp => ({ entidad_id: id, cp }))
        if (cpInserts.length) await supabase.from('entidad_cobertura').insert(cpInserts)
    }

    // Addresses / Sucursales
    // This is more complex because we might want to preserve IDs.
    // For MVP refactor, we might treat 'direcciones' as a recreation of a main branch.
    // If we assume 1 main branch per entity for now (based on UI):
    if (formData.direcciones && formData.direcciones.length > 0) {
        // Clear old branches? Or try to update?
        // Let's wipe and recreate for simplicity in this step,
        // but ideally we should diff.
        await supabase.from('sucursales').delete().eq('entidad_id', id)

        // Create one sucursal per address? Or one main sucursal?
        // "Sucursales + Direcciones" model says Direccion belongs to Sucursal.
        // Let's create a "Principal" sucursal for the first address, etc.
        for (const dir of formData.direcciones) {
            const { data: suc } = await supabase.from('sucursales').insert({
                entidad_id: id,
                nombre: 'Principal',
                es_principal: true
            }).select().single()

            if (suc) {
                await supabase.from('direcciones').insert({
                    sucursal_id: suc.id,
                    calle: dir.calle,
                    cp: dir.cp,
                    localidad_id: dir.localidad_id, // If provided in updated form
                    // lat, lng...
                })
            }
        }
    }

    // Social Networks
    if (formData.redes_sociales) {
        await supabase.from('entidad_redes').delete().eq('entidad_id', id)

        const { data: redesSocialesMap, error: redesError } = await supabase
            .from('redes_sociales')
            .select('id, nombre')

        if (redesError) {
            console.error('Error fetching redes_sociales for updateEntidad:', redesError)
        } else if (redesSocialesMap) {
            const redesInserts = Object.entries(formData.redes_sociales)
                .map(([nombre, url]) => {
                    if (!url) return null
                    const redSocial = redesSocialesMap.find(r => r.nombre.toLowerCase() === nombre.toLowerCase())
                    return redSocial ? { entidad_id: id, red_social_id: redSocial.id, url } : null
                })
                .filter(Boolean)

            if (redesInserts.length) {
                await supabase.from('entidad_redes').insert(redesInserts)
            }
        }
    }

    // REVALIDATION
    await logAction({
        action: 'UPDATE_ENTIDAD',
        entityName: formData.nombre_comercial,
        details: { id, campos_actualizados: Object.keys(formData) },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/entidades')
    revalidatePath(`/dashboard/entidades/${id}`)

    return { data: entity }
}

export async function deleteEntidad(id: string, nombre: string) {
    const supabase = await createClient()

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
