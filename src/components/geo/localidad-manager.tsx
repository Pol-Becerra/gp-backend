'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
    getLocalidades,
    createLocalidad,
    updateLocalidad,
    deleteLocalidad
} from '@/app/actions/geo'
import type { Localidad } from '@/lib/types'
import { cn } from '@/lib/utils'

interface LocalidadManagerProps {
    partidoId: string
}

export function LocalidadManager({ partidoId }: LocalidadManagerProps) {
    const [localidades, setLocalidades] = useState<Localidad[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentLocalidad, setCurrentLocalidad] = useState<Localidad | null>(null)
    const [formData, setFormData] = useState({ nombre: '', cp: '' })

    const loadLocalidades = async () => {
        setIsLoading(true)
        try {
            const data = await getLocalidades(partidoId)
            setLocalidades(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadLocalidades()
    }, [partidoId])

    const handleSubmit = async () => {
        try {
            if (currentLocalidad) {
                await updateLocalidad(currentLocalidad.id, formData.nombre, formData.cp)
            } else {
                await createLocalidad(formData.nombre, partidoId, formData.cp)
            }
            setIsDialogOpen(false)
            setFormData({ nombre: '', cp: '' })
            setCurrentLocalidad(null)
            loadLocalidades()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar esta ciudad?')) return

        try {
            await deleteLocalidad(id)
            loadLocalidades()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (localidad: Localidad) => {
        setCurrentLocalidad(localidad)
        setFormData({ nombre: localidad.nombre, cp: localidad.cp || '' })
        setIsDialogOpen(true)
    }

    return (
        <Card className="h-full flex flex-col border-l-2">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Ciudades / Localidades</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => {
                                setCurrentLocalidad(null)
                                setFormData({ nombre: '', cp: '' })
                            }}>
                                <Plus className="h-4 w-4 mr-1" /> Nuevo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{currentLocalidad ? 'Editar' : 'Nueva'} Localidad</DialogTitle>
                                <DialogDescription>
                                    Ingrese los datos de la ciudad.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: Ramos Mejía"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cp">Código Postal</Label>
                                    <Input
                                        id="cp"
                                        value={formData.cp}
                                        onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                                        placeholder="Ej: 1704"
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
                <CardDescription>Gestión de localidades y códigos postales</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pl-2 pr-2">
                <div className="space-y-1">
                    {localidades.map((localidad) => (
                        <div
                            key={localidad.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm group transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{localidad.nombre}</span>
                                <span className="text-xs text-muted-foreground">CP: {localidad.cp || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(localidad)}>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(localidad.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {!isLoading && localidades.length === 0 && (
                        <div className="text-center text-muted-foreground p-4 text-sm">
                            No hay localidades registradas
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
