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
    getProvincias,
    createProvincia,
    updateProvincia,
    deleteProvincia
} from '@/app/actions/geo'
import type { Provincia } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProvinciaManagerProps {
    onSelect: (provincia: Provincia | null) => void
    selectedId: string | null
}

export function ProvinciaManager({ onSelect, selectedId }: ProvinciaManagerProps) {
    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentProvincia, setCurrentProvincia] = useState<Provincia | null>(null)
    const [formData, setFormData] = useState({ nombre: '' })

    const loadProvincias = async () => {
        setIsLoading(true)
        try {
            const data = await getProvincias()
            setProvincias(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadProvincias()
    }, [])

    const handleSubmit = async () => {
        try {
            if (currentProvincia) {
                await updateProvincia(currentProvincia.id, formData.nombre)
            } else {
                await createProvincia(formData.nombre)
            }
            setIsDialogOpen(false)
            setFormData({ nombre: '' })
            setCurrentProvincia(null)
            loadProvincias()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('¿Seguro que deseas eliminar esta provincia?')) return

        try {
            await deleteProvincia(id)
            if (selectedId === id) onSelect(null)
            loadProvincias()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (provincia: Provincia, e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentProvincia(provincia)
        setFormData({ nombre: provincia.nombre })
        setIsDialogOpen(true)
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Provincias</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={() => {
                                setCurrentProvincia(null)
                                setFormData({ nombre: '' })
                            }}>
                                <Plus className="h-4 w-4 mr-1" /> Nuevo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{currentProvincia ? 'Editar' : 'Nueva'} Provincia</DialogTitle>
                                <DialogDescription>
                                    Ingrese los datos de la provincia.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: Buenos Aires"
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
                <CardDescription>Selecciona para ver partidos</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pl-2 pr-2">
                <div className="space-y-1">
                    {provincias.map((provincia) => (
                        <div
                            key={provincia.id}
                            onClick={() => onSelect(provincia)}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors",
                                selectedId === provincia.id
                                    ? "bg-slate-100 dark:bg-slate-800 font-medium border-l-4 border-slate-500"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <span className="truncate">{provincia.nombre}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => openEdit(provincia, e)}>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => handleDelete(provincia.id, e)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                                {selectedId === provincia.id && <ChevronRight className="h-4 w-4 ml-1 text-slate-400" />}
                            </div>
                        </div>
                    ))}
                    {!isLoading && provincias.length === 0 && (
                        <div className="text-center text-muted-foreground p-4 text-sm">
                            No hay provincias registradas
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
