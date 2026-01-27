import { getTareaAreas } from '@/app/actions/tareas'
import { AreaManager } from '@/components/tasks/area-manager'
import { LayoutGrid, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AreasPage() {
    const areas = await getTareaAreas()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                        <LayoutGrid className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Gestión de Áreas</h1>
                        <p className="text-text-secondary">Define las áreas de trabajo para tus tareas</p>
                    </div>
                </div>
                <Link href="/dashboard/tareas">
                    <Button variant="ghost">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Tareas
                    </Button>
                </Link>
            </div>

            <AreaManager areas={areas} />
        </div>
    )
}
