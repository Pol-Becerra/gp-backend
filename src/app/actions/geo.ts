'use server'

import { createClient } from '@/lib/supabase/server'
import type { Provincia, Partido, Localidad } from '@/lib/types'

export async function getProvincias(): Promise<Provincia[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('provincias')
        .select('*')
        .order('nombre')

    if (error) {
        console.error('Error fetching provincias:', error)
        return []
    }

    return data || []
}

export async function getPartidos(provinciaId: string): Promise<Partido[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('partidos')
        .select('*')
        .eq('provincia_id', provinciaId)
        .order('nombre')

    if (error) {
        console.error('Error fetching partidos:', error)
        return []
    }

    return data || []
}

export async function getLocalidades(partidoId: string): Promise<Localidad[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('localidades')
        .select('*')
        .eq('partido_id', partidoId)
        .order('nombre')

    if (error) {
        console.error('Error fetching localidades:', error)
        return []
    }

    return data || []
}

// AMB PROVINCIAS
export async function createProvincia(nombre: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('provincias')
        .insert({ nombre })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updateProvincia(id: string, nombre: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('provincias')
        .update({ nombre })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function deleteProvincia(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('provincias')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// AMB PARTIDOS
export async function createPartido(nombre: string, provinciaId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('partidos')
        .insert({ nombre, provincia_id: provinciaId })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updatePartido(id: string, nombre: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('partidos')
        .update({ nombre })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function deletePartido(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('partidos')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}

// AMB LOCALIDADES
export async function createLocalidad(nombre: string, partidoId: string, cp: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('localidades')
        .insert({ nombre, partido_id: partidoId, cp })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updateLocalidad(id: string, nombre: string, cp: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('localidades')
        .update({ nombre, cp })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function deleteLocalidad(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('localidades')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    return true
}
