'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FilterX, Search } from 'lucide-react'
import type { TareaArea } from '@/lib/types'

interface TaskFiltersProps {
    areas: TareaArea[]
}

export function TaskFilters({ areas }: TaskFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'all' || !value) {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/dashboard/tareas?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/dashboard/tareas')
    }

    const hasFilters = searchParams.get('area') || searchParams.get('estado') || searchParams.get('prioridad')

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-card p-4 rounded-xl border border-border/50">
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-text-muted" />
                <span className="text-sm font-medium text-text-secondary">Filtrar por:</span>
            </div>

            <div className="w-[180px]">
                <Select
                    value={searchParams.get('area') || 'all'}
                    onValueChange={(v) => updateFilter('area', v)}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las áreas</SelectItem>
                        {areas.map(area => (
                            <SelectItem key={area.id} value={area.id}>
                                {area.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[180px]">
                <Select
                    value={searchParams.get('estado') || 'all'}
                    onValueChange={(v) => updateFilter('estado', v)}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="En Revisión">En Revisión</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-[180px]">
                <Select
                    value={searchParams.get('prioridad') || 'all'}
                    onValueChange={(v) => updateFilter('prioridad', v)}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las prioridades</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 text-error hover:text-error hover:bg-error/10"
                >
                    <FilterX className="h-4 w-4 mr-2" />
                    Limpiar
                </Button>
            )}
        </div>
    )
}
