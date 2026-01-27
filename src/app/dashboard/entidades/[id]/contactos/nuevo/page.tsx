import { ContactoForm } from '@/components/forms/contacto-form'
import { getEntidadById } from '@/app/actions/entidades'
import { notFound } from 'next/navigation'

interface PageProps {
    params: { id: string }
}

export default async function NuevoContactoPage({ params }: PageProps) {
    const entidad = await getEntidadById(params.id)

    if (!entidad) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Nuevo Contacto</h1>
                <p className="text-text-secondary mt-1">
                    Agregar contacto para {entidad.nombre_comercial}
                </p>
            </div>

            <ContactoForm entidadId={params.id} mode="create" />
        </div>
    )
}
