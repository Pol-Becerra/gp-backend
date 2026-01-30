import { DireccionForm } from '@/components/forms/direccion-form'
import { getDireccion } from '@/app/actions/direcciones'
import { getEntidadById } from '@/app/actions/entidades'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
        direccionId: string
    }>
}

export default async function EditDireccionPage(props: PageProps) {
    const params = await props.params
    const entidad = await getEntidadById(params.id)
    const direccion = await getDireccion(params.id, params.direccionId)

    if (!entidad || !direccion) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Editar Dirección</h1>
                <p className="text-text-secondary mt-1">
                    Modificar dirección para {entidad.nombre_comercial}
                </p>
            </div>

            <DireccionForm
                entidadId={params.id}
                direccion={direccion}
                mode="edit"
            />
        </div>
    )
}
