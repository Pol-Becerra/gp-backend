'use client'

import { useState } from 'react'
import { ProvinciaManager } from './provincia-manager'
import { PartidoManager } from './partido-manager'
import { LocalidadManager } from './localidad-manager'
import type { Provincia, Partido } from '@/lib/types'

export function GeoDashboard() {
    const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(null)
    const [selectedPartido, setSelectedPartido] = useState<Partido | null>(null)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
            <div className="h-full">
                <ProvinciaManager
                    onSelect={(provincia) => {
                        setSelectedProvincia(provincia)
                        setSelectedPartido(null)
                    }}
                    selectedId={selectedProvincia?.id || null}
                />
            </div>

            <div className="h-full">
                {selectedProvincia ? (
                    <PartidoManager
                        provinciaId={selectedProvincia.id}
                        onSelect={setSelectedPartido}
                        selectedId={selectedPartido?.id || null}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-6 text-muted-foreground text-center bg-slate-50/50">
                        <p>Seleccione una provincia para ver sus partidos</p>
                    </div>
                )}
            </div>

            <div className="h-full">
                {selectedPartido ? (
                    <LocalidadManager
                        partidoId={selectedPartido.id}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-6 text-muted-foreground text-center bg-slate-50/50">
                        <p>{selectedProvincia ? 'Seleccione un partido para ver sus ciudades' : 'Esperando selección...'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
