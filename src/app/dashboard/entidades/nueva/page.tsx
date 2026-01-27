import { EntidadForm } from '@/components/forms/entidad-form'

export default function NuevaEntidadPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Nueva Entidad</h1>
                <p className="text-text-secondary mt-1">
                    Completa el formulario para crear una nueva entidad
                </p>
            </div>

            <EntidadForm mode="create" />
        </div>
    )
}
