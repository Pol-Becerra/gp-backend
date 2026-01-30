'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MapPin, Globe, Phone, Info, Link as LinkIcon, Star, Tag } from 'lucide-react'
import { TagInput } from '@/components/ui/tag-input'
import { createGoogleMapsEntry, updateGoogleMapsEntry } from '@/app/actions/google-maps'
import type { GoogleMapsData, GoogleMapsFormData } from '@/lib/types'

interface GoogleMapsFormProps {
    entry?: GoogleMapsData
    mode: 'create' | 'edit'
}

export function GoogleMapsForm({ entry, mode }: GoogleMapsFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<GoogleMapsFormData>({
        defaultValues: entry
            ? {
                rubro_buscado: entry.rubro_buscado || '',
                title: entry.title || '',
                phone: entry.phone || '',
                phone_unformatted: entry.phone_unformatted || '',
                website: entry.website || '',
                address: entry.address || '',
                street: entry.street || '',
                city: entry.city || '',
                postal_codes: entry.postal_codes || [],
                state: entry.state || '',
                country_code: entry.country_code || 'AR',
                latitude: entry.latitude || undefined,
                longitude: entry.longitude || undefined,
                plus_code: entry.plus_code || '',
                category_name: entry.category_name || '',
                categories: entry.categories || [],
                total_score: entry.total_score || undefined,
                reviews_count: entry.reviews_count || undefined,
                opening_hours: entry.opening_hours || '',
                open_now: entry.open_now || '',
                price_level: entry.price_level || '',
                description: entry.description || '',
                images: entry.images || [],
                attributes: entry.attributes || [],
                service_options: entry.service_options || [],
                menu_link: entry.menu_link || '',
                reservation_link: entry.reservation_link || '',
                order_link: entry.order_link || '',
                google_maps_url: entry.google_maps_url || '',
                etiquetas: entry.etiquetas || [],
            }
            : {
                country_code: 'AR',
                images: [],
                attributes: [],
                service_options: [],
                categories: [],
                etiquetas: [],
            },
    })

    const onSubmit = async (data: GoogleMapsFormData) => {
        setLoading(true)
        setError('')

        try {
            const result = mode === 'create'
                ? await createGoogleMapsEntry(data)
                : await updateGoogleMapsEntry(entry!.id, data)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/dashboard/google-maps')
                router.refresh()
            }
        } catch (err) {
            setError('Error al guardar los datos')
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-accent" />
                                Información Básica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título / Nombre del Negocio *</Label>
                                <Input
                                    id="title"
                                    {...register('title', { required: 'El título es requerido' })}
                                    placeholder="Ej: Ferretería El Progreso"
                                />
                                {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rubro_buscado">Rubro Buscado</Label>
                                    <Input
                                        id="rubro_buscado"
                                        {...register('rubro_buscado')}
                                        placeholder="Ej: ferreterías"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category_name">Categoría Principal</Label>
                                    <Input
                                        id="category_name"
                                        {...register('category_name')}
                                        placeholder="Ej: Tienda de herramientas"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Categorías Adicionales (JSON)</Label>
                                <TagInput
                                    value={watch('categories') || []}
                                    onChange={(tags) => setValue('categories', tags, { shouldDirty: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Descripción del negocio..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contacto y Web */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-accent" />
                                Contacto y Web
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        placeholder="011 1234-5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone_unformatted">Teléfono (Sin formato)</Label>
                                    <Input
                                        id="phone_unformatted"
                                        {...register('phone_unformatted')}
                                        placeholder="541112345678"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Sitio Web</Label>
                                <div className="flex gap-2">
                                    {watch('website') ? (
                                        <a
                                            href={watch('website')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2.5 hover:text-accent transition-colors"
                                            title="Abrir sitio web"
                                        >
                                            <Globe className="h-5 w-5" />
                                        </a>
                                    ) : (
                                        <Globe className="h-5 w-5 text-text-secondary mt-2.5" />
                                    )}
                                    <Input
                                        id="website"
                                        {...register('website')}
                                        placeholder="https://www.ejemplo.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="google_maps_url">Google Maps URL</Label>
                                <div className="flex gap-2">
                                    {watch('google_maps_url') ? (
                                        <a
                                            href={watch('google_maps_url')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2.5 hover:text-accent transition-colors"
                                            title="Abrir en Google Maps"
                                        >
                                            <LinkIcon className="h-5 w-5" />
                                        </a>
                                    ) : (
                                        <LinkIcon className="h-5 w-5 text-text-secondary mt-2.5" />
                                    )}
                                    <Input
                                        id="google_maps_url"
                                        {...register('google_maps_url')}
                                        placeholder="https://www.google.com/maps/..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Ubicación */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-accent" />
                                Ubicación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección Completa</Label>
                                <Input
                                    id="address"
                                    {...register('address')}
                                    placeholder="Calle 123, Ciudad, Provincia"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Calle / Altura</Label>
                                    <Input
                                        id="street"
                                        {...register('street')}
                                        placeholder="Calle 123"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        {...register('city')}
                                        placeholder="Ciudad"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Códigos Postales / Áreas</Label>
                                    <TagInput
                                        value={watch('postal_codes') || []}
                                        onChange={(tags) => setValue('postal_codes', tags, { shouldDirty: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">Provincia / Estado</Label>
                                    <Input
                                        id="state"
                                        {...register('state')}
                                        placeholder="Provincia"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitud</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        {...register('latitude', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitud</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        {...register('longitude', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calificaciones y Horarios */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-accent" />
                                Calificaciones y Horarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="total_score">Puntuación Total</Label>
                                    <Input
                                        id="total_score"
                                        type="number"
                                        step="0.1"
                                        {...register('total_score', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reviews_count">Cant. de Reseñas</Label>
                                    <Input
                                        id="reviews_count"
                                        type="number"
                                        {...register('reviews_count', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="opening_hours">Horarios de Apertura</Label>
                                <Input
                                    id="opening_hours"
                                    {...register('opening_hours')}
                                    placeholder="Lunes a Viernes 08:00 - 18:00"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price_level">Nivel de Precios</Label>
                                    <Input
                                        id="price_level"
                                        {...register('price_level')}
                                        placeholder="$, $$, $$$"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="open_now">Abierto Ahora</Label>
                                    <Input
                                        id="open_now"
                                        {...register('open_now')}
                                        placeholder="Sí / No"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Etiquetas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-accent" />
                        Etiquetas de Seguimiento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TagInput
                        value={watch('etiquetas') || []}
                        onChange={(tags) => setValue('etiquetas', tags, { shouldDirty: true })}
                    />
                </CardContent>
            </Card>

            {/* Actions */}
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
                        'Crear Entrada'
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </div>
        </form>
    )
}
