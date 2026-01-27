'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addDireccion, updateDireccion } from '@/app/actions/direcciones'
import { Direccion } from '@/lib/types'
import { Loader2, MapPin } from 'lucide-react'
import { GeoSelector } from './geo-selector'

interface DireccionFormProps {
    entidadId: string
    direccion?: Direccion
    mode: 'create' | 'edit'
}

type FormData = Omit<Direccion, 'id'>

const tipoOptions = [
    { value: 'fiscal', label: 'Fiscal' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'obra', label: 'Obra' },
    { value: 'local', label: 'Local' },
    { value: 'principal', label: 'Principal' },
    { value: 'estudio', label: 'Estudio' },
]

export function DireccionForm({ entidadId, direccion, mode }: DireccionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: direccion || {
            tipo: 'comercial',
            calle: '',
            numero: '',
            piso: '',
            oficina: '',
            ciudad: '',
            provincia: '',
            cp: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError('')

        try {
            const result = mode === 'create'
                ? await addDireccion(entidadId, data)
                : await updateDireccion(entidadId, { ...data, id: direccion!.id })

            if (result.error) {
                setError(result.error)
            } else {
                router.push(`/dashboard/entidades/${entidadId}`)
                router.refresh()
            }
        } catch (err) {
            setError('Error al guardar la dirección')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-error/10 border border-error/50 text-error rounded-lg p-3">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Detalles de la Dirección
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Tipo */}
                    <div className="space-y-2">
                        <Label>Tipo de Dirección</Label>
                        <Select
                            value={watch('tipo')}
                            onValueChange={(value) => setValue('tipo', value as any)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {tipoOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Calle y Altura */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="calle">Calle *</Label>
                            <Input
                                id="calle"
                                {...register('calle', { required: 'Requerido' })}
                                placeholder="Av. Corrientes"
                            />
                            {errors.calle && (
                                <p className="text-error text-sm">{errors.calle.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="numero">Número *</Label>
                            <Input
                                id="numero"
                                {...register('numero', { required: 'Requerido' })}
                                placeholder="1234"
                            />
                            {errors.numero && (
                                <p className="text-error text-sm">{errors.numero.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="piso">Piso</Label>
                            <Input
                                id="piso"
                                {...register('piso')}
                                placeholder="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oficina">Oficina/Depto</Label>
                            <Input
                                id="oficina"
                                {...register('oficina')}
                                placeholder="A"
                            />
                        </div>
                    </div>

                    {/* Ubicación Geográfica */}
                    <GeoSelector
                        onValueChange={(field, value) => setValue(field as any, value)}
                        defaultValues={{
                            provincia: watch('provincia'),
                            ciudad: watch('ciudad'),
                            cp: watch('cp')
                        }}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : mode === 'create' ? (
                        'Crear Dirección'
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </div>
        </form>
    )
}
