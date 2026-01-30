import { notFound } from 'next/navigation'
import { getEntidadById } from '@/app/actions/entidades'
import { EntidadForm } from '@/components/forms/entidad-form'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditarEntidadPage(props: PageProps) {
    const params = await props.params
    const entidad = await getEntidadById(params.id)

    if (!entidad) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Editar Entidad</h1>
                <p className="text-text-secondary mt-1">
                    Modifica los datos de {entidad.nombre_comercial}
                </p>
            </div>

            <EntidadForm entidad={entidad} mode="edit" />
        </div>
    )
}
