'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    getPartidos,
    createPartido,
    updatePartido,
    deletePartido
} from '@/app/actions/geo'
import type { Partido } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PartidoManagerProps {
    provinciaId: string
    onSelect: (partido: Partido | null) => void
    selectedId: string | null
}

export function PartidoManager({ provinciaId, onSelect, selectedId }: PartidoManagerProps) {
    const [partidos, setPartidos] = useState<Partido[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentPartido, setCurrentPartido] = useState<Partido | null>(null)
    const [formData, setFormData] = useState({ nombre: '' })

    const loadPartidos = async () => {
        setIsLoading(true)
        try {
            const data = await getPartidos(provinciaId)
            setPartidos(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadPartidos()
    }, [provinciaId])

    const handleSubmit = async () => {
        try {
            if (currentPartido) {
                await updatePartido(currentPartido.id, formData.nombre)
            } else {
                await createPartido(formData.nombre, provinciaId)
            }
            setIsDialogOpen(false)
            setFormData({ nombre: '' })
            setCurrentPartido(null)
            loadPartidos()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('¿Seguro que deseas eliminar este partido?')) return

        try {
            await deletePartido(id)
            if (selectedId === id) onSelect(null)
            loadPartidos()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (partido: Partido, e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentPartido(partido)
        setFormData({ nombre: partido.nombre })
        setIsDialogOpen(true)
    }

    return (
        <Card className="h-full flex flex-col border-l-2">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Partidos</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => {
                                setCurrentPartido(null)
                                setFormData({ nombre: '' })
                            }}>
                                <Plus className="h-4 w-4 mr-1" /> Nuevo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{currentPartido ? 'Editar' : 'Nuevo'} Partido</DialogTitle>
                                <DialogDescription>
                                    Ingrese los datos del partido.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: La Matanza"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSubmit}>Guardar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <CardDescription>Selecciona para ver localidades</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pl-2 pr-2">
                <div className="space-y-1">
                    {partidos.map((partido) => (
                        <div
                            key={partido.id}
                            onClick={() => onSelect(partido)}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors",
                                selectedId === partido.id
                                    ? "bg-slate-100 dark:bg-slate-800 font-medium border-l-4 border-slate-500"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <span className="truncate">{partido.nombre}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => openEdit(partido, e)}>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => handleDelete(partido.id, e)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                                {selectedId === partido.id && <ChevronRight className="h-4 w-4 ml-1 text-slate-400" />}
                            </div>
                        </div>
                    ))}
                    {!isLoading && partidos.length === 0 && (
                        <div className="text-center text-muted-foreground p-4 text-sm">
                            No hay partidos registrados
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
