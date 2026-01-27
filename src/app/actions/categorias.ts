'use server'

import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import type { CategoriaFormData } from '@/lib/types'

export async function getCategorias() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true })

    if (error) {
        console.error('Error fetching categorias:', error)
        return []
    }

    return data || []
}

export async function getCategoriasTree() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true })

    if (error) {
        console.error('Error fetching categorias:', error)
        return []
    }

    // Build tree structure
    const categories = data || []
    const rootCategories = categories.filter(c => !c.parent_id)

    const buildTree = (parentId: string | null): any[] => {
        return categories
            .filter(c => c.parent_id === parentId)
            .map(c => ({
                ...c,
                subcategorias: buildTree(c.id),
            }))
    }

    return rootCategories.map(c => ({
        ...c,
        subcategorias: buildTree(c.id),
    }))
}

export async function getCategoriaById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching categoria:', error)
        return null
    }

    return data
}

export async function createCategoria(formData: CategoriaFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'No autorizado' }
    }

    const { data, error } = await supabase
        .from('categorias')
        .insert({
            user_id: user.id,
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            icono: formData.icono || 'folder',
            color: formData.color || '#39FF14',
            parent_id: formData.parent_id || null,
            orden: formData.orden || 0,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating categoria:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'CREATE_CATEGORIA',
        entityName: formData.nombre,
        details: { parent_id: formData.parent_id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/categorias')

    return { data }
}

export async function updateCategoria(id: string, formData: CategoriaFormData) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('categorias')
        .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            icono: formData.icono || 'folder',
            color: formData.color || '#39FF14',
            parent_id: formData.parent_id || null,
            orden: formData.orden || 0,
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating categoria:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'UPDATE_CATEGORIA',
        entityName: formData.nombre,
        details: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/categorias')

    return { data }
}

export async function deleteCategoria(id: string, nombre: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting categoria:', error)
        return { error: error.message }
    }

    await logAction({
        action: 'DELETE_CATEGORIA',
        entityName: nombre,
        details: { id },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/categorias')

    return { success: true }
}
