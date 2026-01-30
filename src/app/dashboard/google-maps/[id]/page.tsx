import { getGoogleMapsEntryById } from '@/app/actions/google-maps'
import { GoogleMapsForm } from '@/components/forms/google-maps-form'
import { notFound } from 'next/navigation'
import { Map } from 'lucide-react'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function GoogleMapsEntryPage(props: PageProps) {
    const params = await props.params
    const entry = await getGoogleMapsEntryById(params.id)

    if (!entry) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                    <Map className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Editar Registro Google Maps</h1>
                    <p className="text-text-secondary">Modifica la información recolectada de la plataforma</p>
                </div>
            </div>

            <GoogleMapsForm entry={entry} mode="edit" />
        </div>
    )
}
