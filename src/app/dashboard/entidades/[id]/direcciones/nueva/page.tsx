import { DireccionForm } from '@/components/forms/direccion-form'
import { getEntidadById } from '@/app/actions/entidades'
import { notFound } from 'next/navigation'

interface PageProps {
    params: { id: string }
}

export default async function NuevaDireccionPage({ params }: PageProps) {
    const entidad = await getEntidadById(params.id)

    if (!entidad) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Nueva Dirección</h1>
                <p className="text-text-secondary mt-1">
                    Agregar dirección para {entidad.nombre_comercial}
                </p>
            </div>

            <DireccionForm entidadId={params.id} mode="create" />
        </div>
    )
}
