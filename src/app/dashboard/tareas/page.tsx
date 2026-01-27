import {
    Plus,
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertTriangle,
    User,
    Eye,
    Circle,
    XCircle,
    CornerDownRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getTareas, getTareaAreas } from '@/app/actions/tareas'
import { formatDate, truncate, cn } from '@/lib/utils'
import Link from 'next/link'
import { TaskFilters } from '@/components/tasks/task-filters'

interface PageProps {
    searchParams: {
        area?: string
        estado?: string
        prioridad?: string
    }
}

export default async function TareasPage({ searchParams }: PageProps) {
    const [areas, tareas] = await Promise.all([
        getTareaAreas(),
        getTareas({
            area_id: searchParams.area,
            estado: searchParams.estado,
            prioridad: searchParams.prioridad
        })
    ])

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Crítica': return 'bg-error text-white'
            case 'Alta': return 'bg-orange-500 text-white'
            case 'Media': return 'bg-accent text-background'
            case 'Baja': return 'bg-success text-white'
            default: return 'bg-text-muted text-white'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completada': return <CheckCircle2 className="h-4 w-4 text-success" />
            case 'En Progreso': return <Clock className="h-4 w-4 text-accent" />
            case 'En Revisión': return <Eye className="h-4 w-4 text-orange-500" />
            case 'Cancelada': return <XCircle className="h-4 w-4 text-error" />
            default: return <Circle className="h-4 w-4 text-text-muted" />
        }
    }

    // Build hierarchy
    const taskMap = new Map<string, any>()
    tareas.forEach(t => taskMap.set(t.id, { ...t, subtasks: [] }))

    const rootTasks: any[] = []
    tareas.forEach(t => {
        if (t.parent_id && taskMap.has(t.parent_id)) {
            taskMap.get(t.parent_id).subtasks.push(taskMap.get(t.id))
        } else {
            rootTasks.push(taskMap.get(t.id))
        }
    })

    const renderTaskRow = (tarea: any, depth = 0) => {
        const rows = [
            <TableRow key={tarea.id} className="group hover:bg-accent/5 transition-colors">
                <TableCell>
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
                        {depth > 0 && <CornerDownRight className="h-4 w-4 text-text-muted" />}
                        <div>
                            <p className="font-medium text-text-primary group-hover:text-accent transition-colors">{tarea.titulo}</p>
                            {tarea.descripcion && (
                                <p className="text-text-muted text-xs">{truncate(tarea.descripcion, 50)}</p>
                            )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    {tarea.area ? (
                        <Badge variant="outline" style={{ color: tarea.area.color, borderColor: tarea.area.color + '40' }} className="bg-transparent text-[10px] px-2 font-semibold">
                            {tarea.area.nombre}
                        </Badge>
                    ) : (
                        <span className="text-text-muted text-xs italic">Sin área</span>
                    )}
                </TableCell>
                <TableCell>
                    <Badge className={cn('text-[10px] uppercase py-0 px-2 font-bold', getPriorityColor(tarea.prioridad))}>
                        {tarea.prioridad}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary whitespace-nowrap">
                        {getStatusIcon(tarea.estado)}
                        {tarea.estado}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                            <User className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-[10px] text-text-secondary">
                            {tarea.asignado_a ? 'Asignado' : 'Pendiente'}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <Link href={`/dashboard/tareas/${tarea.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 hover:bg-accent/10 hover:text-accent font-medium text-xs">Editar</Button>
                    </Link>
                </TableCell>
            </TableRow>
        ]

        if (tarea.subtasks && tarea.subtasks.length > 0) {
            tarea.subtasks.forEach((subtask: any) => {
                rows.push(...renderTaskRow(subtask, depth + 1))
            })
        }

        return rows
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Gestión de Tareas</h1>
                    <p className="text-text-secondary mt-1">
                        Organiza el trabajo por áreas y establece prioridades
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/tareas/areas">
                        <Button variant="outline">
                            Gestionar Áreas
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-accent/20 text-accent">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Totales</p>
                            <p className="text-xl font-bold">{tareas.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Pendientes</p>
                            <p className="text-xl font-bold">
                                {tareas.filter(t => t.estado === 'Pendiente' || t.estado === 'En Progreso').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-success/20 text-success">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Hechas</p>
                            <p className="text-xl font-bold">
                                {tareas.filter(t => t.estado === 'Completada').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-error/20 text-error">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Críticas</p>
                            <p className="text-xl font-bold">
                                {tareas.filter(t => t.prioridad === 'Crítica').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <TaskFilters areas={areas} />

            {/* Tasks Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        <CardTitle className="text-lg font-bold">Listado de Tareas</CardTitle>
                    </div>
                    <Link href="/dashboard/tareas/nueva">
                        <Button size="sm" className="h-9 px-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Tarea
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    {tareas.length === 0 ? (
                        <div className="text-center py-16">
                            <ClipboardList className="h-16 w-16 text-text-muted/30 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-text-primary">No hay tareas</h3>
                            <p className="text-text-secondary mt-1">Empieza creando una nueva tarea para tu equipo.</p>
                            <Link href="/dashboard/tareas/nueva" className="mt-6 inline-block">
                                <Button variant="outline">
                                    Crear mi primera tarea
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-background-secondary/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-bold">Tarea</TableHead>
                                    <TableHead className="font-bold">Área</TableHead>
                                    <TableHead className="font-bold">Prioridad</TableHead>
                                    <TableHead className="font-bold">Estado</TableHead>
                                    <TableHead className="font-bold">Asignado</TableHead>
                                    <TableHead className="text-right font-bold">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rootTasks.map(tarea => renderTaskRow(tarea))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
