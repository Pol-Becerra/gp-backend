'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getProvincias, getPartidos, getLocalidades } from '@/app/actions/geo'
import type { Provincia, Partido, Localidad } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface GeoSelectorProps {
    onValueChange: (field: string, value: string) => void
    defaultValues?: {
        provincia?: string
        partido?: string
        ciudad?: string
        cp?: string
    }
}

export function GeoSelector({ onValueChange, defaultValues }: GeoSelectorProps) {
    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [partidos, setPartidos] = useState<Partido[]>([])
    const [localidades, setLocalidades] = useState<Localidad[]>([])

    const [selectedProvincia, setSelectedProvincia] = useState(defaultValues?.provincia || '')
    const [selectedPartido, setSelectedPartido] = useState(defaultValues?.partido || '')
    const [selectedLocalidad, setSelectedLocalidad] = useState(defaultValues?.ciudad || '')

    const [loading, setLoading] = useState({
        provincias: false,
        partidos: false,
        localidades: false,
    })

    useEffect(() => {
        const fetchProvincias = async () => {
            setLoading(prev => ({ ...prev, provincias: true }))
            const data = await getProvincias()
            setProvincias(data)
            setLoading(prev => ({ ...prev, provincias: false }))
        }
        fetchProvincias()
    }, [])

    useEffect(() => {
        if (selectedProvincia) {
            const fetchPartidos = async () => {
                setLoading(prev => ({ ...prev, partidos: true }))
                const data = await getPartidos(selectedProvincia)
                setPartidos(data)
                setLoading(prev => ({ ...prev, partidos: false }))
            }
            fetchPartidos()
        } else {
            setPartidos([])
        }
    }, [selectedProvincia])

    useEffect(() => {
        if (selectedPartido) {
            const fetchLocalidades = async () => {
                setLoading(prev => ({ ...prev, localidades: true }))
                const data = await getLocalidades(selectedPartido)
                setLocalidades(data)
                setLoading(prev => ({ ...prev, localidades: false }))
            }
            fetchLocalidades()
        } else {
            setLocalidades([])
        }
    }, [selectedPartido])

    const handleProvinciaChange = (value: string) => {
        setSelectedProvincia(value)
        setSelectedPartido('')
        setSelectedLocalidad('')
        const prov = provincias.find(p => p.id === value)
        onValueChange('provincia', prov?.nombre || '')
        onValueChange('partido', '')
        onValueChange('ciudad', '')
    }

    const handlePartidoChange = (value: string) => {
        setSelectedPartido(value)
        setSelectedLocalidad('')
        const part = partidos.find(p => p.id === value)
        onValueChange('partido', part?.nombre || '')
        onValueChange('ciudad', '')
    }

    const handleLocalidadChange = (value: string) => {
        setSelectedLocalidad(value)
        const loc = localidades.find(l => l.id === value)
        onValueChange('ciudad', loc?.nombre || '')
        if (loc?.cp) {
            onValueChange('cp', loc.cp)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
                <Label>Provincia</Label>
                <Select value={selectedProvincia} onValueChange={handleProvinciaChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={loading.provincias ? 'Cargando...' : 'Seleccionar provincia'} />
                    </SelectTrigger>
                    <SelectContent>
                        {provincias.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Partido</Label>
                <Select
                    value={selectedPartido}
                    onValueChange={handlePartidoChange}
                    disabled={!selectedProvincia || loading.partidos}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={loading.partidos ? 'Cargando...' : 'Seleccionar partido'} />
                    </SelectTrigger>
                    <SelectContent>
                        {partidos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Localidad/Ciudad</Label>
                <Select
                    value={selectedLocalidad}
                    onValueChange={handleLocalidadChange}
                    disabled={!selectedPartido || loading.localidades}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={loading.localidades ? 'Cargando...' : 'Seleccionar localidad'} />
                    </SelectTrigger>
                    <SelectContent>
                        {localidades.map((l) => (
                            <SelectItem key={l.id} value={l.id}>
                                {l.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>CP</Label>
                {/* Note: In this version CP is managed via onValueChange, we'll see if we need a visible component here or if it stays in the parent */}
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm flex items-center">
                    {defaultValues?.cp || ''}
                </div>
            </div>
        </div>
    )
}
