'use client'

import { useState, useEffect } from 'react'
import { getCategoriasTree } from '@/app/actions/categorias'
import { CategoryTree } from '@/components/categorias/category-tree'
import type { Categoria } from '@/lib/types'

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)

    const loadCategorias = async () => {
        setLoading(true)
        const data = await getCategoriasTree()
        setCategorias(data)
        setLoading(false)
    }

    useEffect(() => {
        loadCategorias()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Categorías</h1>
                <p className="text-text-secondary mt-1">
                    Gestiona las categorías y subcategorías para organizar tus entidades
                </p>
            </div>

            {/* Category Tree */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
            ) : (
                <CategoryTree categorias={categorias} onRefresh={loadCategorias} />
            )}

            {/* Info Card */}
            <div className="bg-info/10 border border-info/50 rounded-lg p-4">
                <h4 className="font-medium text-info mb-2">💡 Consejos</h4>
                <ul className="text-text-secondary text-sm space-y-1">
                    <li>• Puedes crear subcategorías seleccionando una categoría padre</li>
                    <li>• Las categorías te ayudan a organizar y filtrar tus entidades</li>
                    <li>• Ejemplo: Construcción → Arquitectos, Ingenieros</li>
                </ul>
            </div>
        </div>
    )
}
