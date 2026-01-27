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
