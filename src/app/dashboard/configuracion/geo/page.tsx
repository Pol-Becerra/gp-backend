import { GeoDashboard } from '@/components/geo/geo-dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Administración Geográfica | Guía Pymes',
    description: 'Gestionar provincias, partidos y localidades'
}

export default function GeoPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Administración Geográfica</h1>
                    <p className="text-muted-foreground">
                        Gestiona la estructura de provincias, partidos y localidades del sistema.
                    </p>
                </div>
            </div>

            <GeoDashboard />
        </div>
    )
}
