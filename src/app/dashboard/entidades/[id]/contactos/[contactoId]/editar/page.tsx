import { getContactoById } from '@/app/actions/contactos'
import { ContactoForm } from '@/components/forms/contacto-form'
import { notFound } from 'next/navigation'

interface EditContactoPageProps {
    params: {
        id: string
        contactoId: string
    }
}

export default async function EditContactoPage({ params }: EditContactoPageProps) {
    const contacto = await getContactoById(params.contactoId)

    if (!contacto) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Editar Contacto</h1>
                <p className="text-text-secondary mt-1">
                    Modifica los datos del contacto para {contacto.entidad?.nombre_comercial}
                </p>
            </div>

            <ContactoForm
                contacto={contacto}
                entidadId={params.id}
                mode="edit"
            />
        </div>
    )
}
