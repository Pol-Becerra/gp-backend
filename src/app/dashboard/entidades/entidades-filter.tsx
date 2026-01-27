'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useState, useTransition } from 'react'
import type { Categoria } from '@/lib/types'

interface EntidadesFilterProps {
    categorias: Categoria[]
}

export function EntidadesFilter({ categorias }: EntidadesFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [tipo, setTipo] = useState(searchParams.get('tipo') || '')
    const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')

    const updateFilters = (newSearch?: string, newTipo?: string, newCategoria?: string) => {
        const params = new URLSearchParams()

        const searchValue = newSearch !== undefined ? newSearch : search
        const tipoValue = newTipo !== undefined ? newTipo : tipo
        const categoriaValue = newCategoria !== undefined ? newCategoria : categoria

        if (searchValue) params.set('search', searchValue)
        if (tipoValue && tipoValue !== 'all') params.set('tipo', tipoValue)
        if (categoriaValue && categoriaValue !== 'all') params.set('categoria', categoriaValue)

        startTransition(() => {
            router.push(`/dashboard/entidades?${params.toString()}`)
        })
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateFilters(search)
    }

    const clearFilters = () => {
        setSearch('')
        setTipo('')
        setCategoria('')
        startTransition(() => {
            router.push('/dashboard/entidades')
        })
    }

    const hasFilters = search || tipo || categoria

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="pl-10"
                    />
                </div>
            </form>

            <Select
                value={tipo || 'all'}
                onValueChange={(value) => {
                    setTipo(value)
                    updateFilters(undefined, value)
                }}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="PYME">PyME</SelectItem>
                    <SelectItem value="NEGOCIO">Comercio</SelectItem>
                    <SelectItem value="PROFESIONAL">Profesional</SelectItem>
                    <SelectItem value="SERVICIO">Servicio</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={categoria || 'all'}
                onValueChange={(value) => {
                    setCategoria(value)
                    updateFilters(undefined, undefined, value)
                }}
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                />
                                {cat.nombre}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                </Button>
            )}
        </div>
    )
}
