'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ClipboardList, AlertTriangle, Clock, CheckCircle2, Plus } from 'lucide-react'
import { createTarea, updateTarea, createTareaArea } from '@/app/actions/tareas'
import type { Tarea, TareaFormData, TareaArea, PrioridadTarea, EstadoTarea } from '@/lib/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'

interface TaskFormProps {
    tarea?: Tarea
    areas: TareaArea[]
    tasks: Tarea[]
    users: { id: string; email: string; nombre: string | null }[]
    mode: 'create' | 'edit'
}

export function TaskForm({ tarea, areas: initialAreas, tasks, users, mode }: TaskFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Areas local state to allow dynamic updates
    const [localAreas, setLocalAreas] = useState<TareaArea[]>(initialAreas)
    const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false)
    const [newAreaLoading, setNewAreaLoading] = useState(false)
    const [newArea, setNewArea] = useState({ nombre: '', color: '#39FF14' })

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TareaFormData>({
        defaultValues: tarea ? {
            titulo: tarea.titulo,
            descripcion: tarea.descripcion || '',
            area_id: tarea.area_id || undefined,
            parent_id: tarea.parent_id || undefined,
            prioridad: tarea.prioridad,
            estado: tarea.estado,
            asignado_a: tarea.asignado_a || undefined,
            fecha_limite: tarea.fecha_limite?.split('T')[0] || undefined
        } : {
            prioridad: 'Media',
            estado: 'Pendiente',
        }
    })

    const onSubmit = async (data: TareaFormData) => {
        setLoading(true)
        setError('')

        try {
            const result = mode === 'create'
                ? await createTarea(data)
                : await updateTarea(tarea!.id, data)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/dashboard/tareas')
                router.refresh()
            }
        } catch (err) {
            setError('Error al guardar la tarea')
        } finally {
            setLoading(false)
        }
    }

    const handleAreaCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newArea.nombre) return

        setNewAreaLoading(true)
        try {
            const result = await createTareaArea(newArea)
            if (result.data) {
                setLocalAreas([...localAreas, result.data as TareaArea])
                setValue('area_id', (result.data as TareaArea).id)
                setIsAreaDialogOpen(false)
                setNewArea({ nombre: '', color: '#39FF14' })
            }
        } catch (err) {
            console.error('Error creating area:', err)
        } finally {
            setNewAreaLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-error/10 border border-error/50 text-error rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-accent" />
                                Detalle de la Tarea
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título *</Label>
                                <Input
                                    id="titulo"
                                    {...register('titulo', { required: 'El título es obligatorio' })}
                                    placeholder="Nombre de la tarea"
                                />
                                {errors.titulo && <span className="text-error text-xs">{errors.titulo.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    {...register('descripcion')}
                                    placeholder="Detalles sobre lo que hay que hacer..."
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Área</Label>
                                    <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-accent">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Nueva
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Crear Nueva Área</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Nombre</Label>
                                                    <Input
                                                        placeholder="SEO, Backend, etc."
                                                        value={newArea.nombre}
                                                        onChange={(e) => setNewArea({ ...newArea, nombre: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Color</Label>
                                                    <Input
                                                        type="color"
                                                        value={newArea.color}
                                                        onChange={(e) => setNewArea({ ...newArea, color: e.target.value })}
                                                        className="h-10 p-1 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsAreaDialogOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleAreaCreate} disabled={newAreaLoading || !newArea.nombre}>
                                                    {newAreaLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Crear y Seleccionar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Select
                                    value={watch('area_id') || 'none'}
                                    onValueChange={(v) => setValue('area_id', v === 'none' ? undefined : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar área" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin área</SelectItem>
                                        {localAreas.map(area => (
                                            <SelectItem key={area.id} value={area.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: area.color }} />
                                                    {area.nombre}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tarea Padre</Label>
                                <Select
                                    value={watch('parent_id') || 'none'}
                                    onValueChange={(v) => setValue('parent_id', v === 'none' ? undefined : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tarea padre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin padre</SelectItem>
                                        {tasks
                                            .filter(t => t.id !== tarea?.id)
                                            .map(t => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.titulo}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Prioridad</Label>
                                <Select
                                    value={watch('prioridad')}
                                    onValueChange={(v) => setValue('prioridad', v as PrioridadTarea)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Baja">Baja</SelectItem>
                                        <SelectItem value="Media">Media</SelectItem>
                                        <SelectItem value="Alta">Alta</SelectItem>
                                        <SelectItem value="Crítica">Crítica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select
                                    value={watch('estado')}
                                    onValueChange={(v) => setValue('estado', v as EstadoTarea)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                                        <SelectItem value="En Revisión">En Revisión</SelectItem>
                                        <SelectItem value="Completada">Completada</SelectItem>
                                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Asignar a</Label>
                                <Select
                                    value={watch('asignado_a') || 'none'}
                                    onValueChange={(v) => setValue('asignado_a', v === 'none' ? undefined : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin asignar</SelectItem>
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.nombre || u.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_limite">Fecha Límite</Label>
                                <Input
                                    id="fecha_limite"
                                    type="date"
                                    {...register('fecha_limite')}
                                    className="cursor-pointer block"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'create' ? 'Crear Tarea' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    )
}
