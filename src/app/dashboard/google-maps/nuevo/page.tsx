import { GoogleMapsForm } from '@/components/forms/google-maps-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map } from 'lucide-react'

export default function NuevaGoogleMapsEntryPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                    <Map className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Nuevo Registro Google Maps</h1>
                    <p className="text-text-secondary">Crea una nueva entrada con datos de ubicación</p>
                </div>
            </div>

            <GoogleMapsForm mode="create" />
        </div>
    )
}
