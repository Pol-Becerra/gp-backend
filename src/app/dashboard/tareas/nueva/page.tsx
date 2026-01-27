import { getTareaAreas, getTareas, getUsers } from '@/app/actions/tareas'
import { TaskForm } from '@/components/tasks/task-form'
import { ClipboardList } from 'lucide-react'

export default async function NuevaTareaPage() {
    const [areas, tasks, users] = await Promise.all([
        getTareaAreas(),
        getTareas(),
        getUsers()
    ])

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                    <ClipboardList className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Nueva Tarea</h1>
                    <p className="text-text-secondary">Crea una tarea y asígnala a un área</p>
                </div>
            </div>

            <TaskForm areas={areas} tasks={tasks} users={users} mode="create" />
        </div>
    )
}
