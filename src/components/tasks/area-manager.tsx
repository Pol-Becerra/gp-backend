'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, LayoutGrid, Loader2 } from 'lucide-react'
import { createTareaArea, deleteTareaArea } from '@/app/actions/tareas'
import type { TareaArea } from '@/lib/types'

interface AreaManagerProps {
    areas: TareaArea[]
}

export function AreaManager({ areas }: AreaManagerProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [newArea, setNewArea] = useState({ nombre: '', color: '#39FF14' })

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newArea.nombre) return

        setLoading(true)
        const result = await createTareaArea(newArea)
        setLoading(false)

        if (!result.error) {
            setNewArea({ nombre: '', color: '#39FF14' })
            router.refresh()
        }
    }

    const handleDelete = async (id: string, nombre: string) => {
        if (confirm(`¿Estás seguro de eliminar el área "${nombre}"? Las tareas asociadas se quedarán sin área.`)) {
            setLoading(true)
            await deleteTareaArea(id, nombre)
            setLoading(false)
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-accent" />
                        Añadir Nueva Área
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Ej: SEO, Backend, Frontend..."
                                value={newArea.nombre}
                                onChange={(e) => setNewArea({ ...newArea, nombre: e.target.value })}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="w-full sm:w-24">
                            <Input
                                type="color"
                                value={newArea.color}
                                onChange={(e) => setNewArea({ ...newArea, color: e.target.value })}
                                disabled={loading}
                                className="h-10 p-1 cursor-pointer"
                            />
                        </div>
                        <Button type="submit" disabled={loading || !newArea.nombre}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Área'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {areas.length === 0 ? (
                    <p className="col-span-full text-center text-text-muted py-8">No hay áreas configuradas.</p>
                ) : (
                    areas.map((area) => (
                        <Card key={area.id} className="overflow-hidden">
                            <div className="h-2" style={{ backgroundColor: area.color }} />
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-background-secondary">
                                        <LayoutGrid className="h-4 w-4" style={{ color: area.color }} />
                                    </div>
                                    <span className="font-medium text-text-primary">{area.nombre}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-text-muted hover:text-error hover:bg-error/10"
                                    onClick={() => handleDelete(area.id, area.nombre)}
                                    disabled={loading}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
