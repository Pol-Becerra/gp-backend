import { getEntidades } from '@/app/actions/entidades'
import { ContactoForm } from '@/components/forms/contacto-form'

export default async function NuevoContactoPage() {
    const entidades = await getEntidades()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Nuevo Contacto</h1>
                <p className="text-text-secondary mt-1">
                    Crea un contacto y asígnalo a una entidad
                </p>
            </div>

            <ContactoForm mode="create" entidades={entidades} />
        </div>
    )
}
