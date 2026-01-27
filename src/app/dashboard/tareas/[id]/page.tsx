import { getTareaById, getTareaAreas, getTareas, getUsers } from '@/app/actions/tareas'
import { TaskForm } from '@/components/tasks/task-form'
import { ClipboardList } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        id: string
    }
}

export default async function TareaDetallePage({ params }: PageProps) {
    const [tarea, areas, tasks, users] = await Promise.all([
        getTareaById(params.id),
        getTareaAreas(),
        getTareas(),
        getUsers()
    ])

    if (!tarea) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                    <ClipboardList className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Editar Tarea</h1>
                    <p className="text-text-secondary">Actualiza los detalles, prioridad o estado de la tarea</p>
                </div>
            </div>

            <TaskForm tarea={tarea} areas={areas} tasks={tasks} users={users} mode="edit" />
        </div>
    )
}
