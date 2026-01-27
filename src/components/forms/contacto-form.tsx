'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { createContacto, updateContacto } from '@/app/actions/contactos'
import type { Contacto, ContactoFormData, RolContacto } from '@/lib/types'
import { Plus, X, Loader2, User, Phone, Mail, Globe, Building2 } from 'lucide-react'

interface ContactoFormProps {
    contacto?: Contacto
    entidadId?: string
    entidades?: { id: string; nombre_comercial: string }[]
    mode: 'create' | 'edit'
}

const rolOptions: { value: RolContacto; label: string }[] = [
    { value: 'Dueño', label: 'Dueño/Propietario' },
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Contador', label: 'Contador' },
    { value: 'Ventas', label: 'Ventas' },
    { value: 'Otro', label: 'Otro' },
]

export function ContactoForm({ contacto, entidadId, entidades, mode }: ContactoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [telefonos, setTelefonos] = useState<string[]>(
        contacto?.telefonos?.length ? contacto.telefonos : ['']
    )
    const [emails, setEmails] = useState<string[]>(
        contacto?.emails?.length ? contacto.emails : ['']
    )

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Omit<ContactoFormData, 'telefonos' | 'emails'>>({
        defaultValues: contacto
            ? {
                entidad_id: contacto.entidad_id,
                nombre_completo: contacto.nombre_completo,
                cargo: contacto.cargo || '',
                rol: contacto.rol,
                redes_sociales: contacto.redes_sociales || {},
                es_principal: contacto.es_principal,
                notas: contacto.notas || '',
            }
            : {
                entidad_id: entidadId || '',
                nombre_completo: '',
                rol: 'Otro',
                redes_sociales: {},
                es_principal: false,
            },
    })

    const addTelefono = () => setTelefonos([...telefonos, ''])
    const removeTelefono = (index: number) => {
        if (telefonos.length > 1) {
            setTelefonos(telefonos.filter((_, i) => i !== index))
        }
    }
    const updateTelefono = (index: number, value: string) => {
        const newTelefonos = [...telefonos]
        newTelefonos[index] = value
        setTelefonos(newTelefonos)
    }

    const addEmail = () => setEmails([...emails, ''])
    const removeEmail = (index: number) => {
        if (emails.length > 1) {
            setEmails(emails.filter((_, i) => i !== index))
        }
    }
    const updateEmail = (index: number, value: string) => {
        const newEmails = [...emails]
        newEmails[index] = value
        setEmails(newEmails)
    }

    const onSubmit = async (data: Omit<ContactoFormData, 'telefonos' | 'emails'>) => {
        setLoading(true)
        setError('')

        const formData: ContactoFormData = {
            ...data,
            telefonos: telefonos.filter(Boolean),
            emails: emails.filter(Boolean),
        }

        try {
            const result = mode === 'create'
                ? await createContacto(formData)
                : await updateContacto(contacto!.id, formData)

            if (result.error) {
                setError(result.error)
            } else {
                if (entidadId) {
                    router.push(`/dashboard/entidades/${entidadId}`)
                } else {
                    router.push('/dashboard/contactos')
                }
                router.refresh()
            }
        } catch (err) {
            setError('Error al guardar el contacto')
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

            {/* Información Básica */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-accent" />
                        Información del Contacto
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!entidadId && entidades && (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="entidad_id">Entidad *</Label>
                                <Select
                                    value={watch('entidad_id')}
                                    onValueChange={(value) => setValue('entidad_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar entidad a la que pertenece" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entidades.map((entidad) => (
                                            <SelectItem key={entidad.id} value={entidad.id}>
                                                {entidad.nombre_comercial}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                            <Input
                                id="nombre_completo"
                                {...register('nombre_completo', { required: 'Campo requerido' })}
                                placeholder="Juan Pérez"
                            />
                            {errors.nombre_completo && (
                                <p className="text-error text-sm">{errors.nombre_completo.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cargo">Cargo</Label>
                            <Input
                                id="cargo"
                                {...register('cargo')}
                                placeholder="Gerente General"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rol">Rol *</Label>
                            <Select
                                value={watch('rol')}
                                onValueChange={(value) => setValue('rol', value as RolContacto)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rolOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register('es_principal')}
                                    className="rounded border-border"
                                />
                                Contacto Principal
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Teléfonos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-accent" />
                        Teléfonos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {telefonos.map((telefono, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={telefono}
                                onChange={(e) => updateTelefono(index, e.target.value)}
                                placeholder="+54 11 XXXX-XXXX"
                            />
                            {telefonos.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTelefono(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addTelefono}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Teléfono
                    </Button>
                </CardContent>
            </Card>

            {/* Emails */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-accent" />
                        Correos Electrónicos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {emails.map((email, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={email}
                                onChange={(e) => updateEmail(index, e.target.value)}
                                type="email"
                                placeholder="correo@ejemplo.com"
                            />
                            {emails.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEmail(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={addEmail}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Email
                    </Button>
                </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-accent" />
                        Redes Sociales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <div className="flex gap-2">
                                {watch('redes_sociales.linkedin') ? (
                                    <a
                                        href={watch('redes_sociales.linkedin')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2.5 hover:text-accent transition-colors"
                                        title="Ver LinkedIn"
                                    >
                                        <Badge variant="outline" className="px-1 py-0">IN</Badge>
                                    </a>
                                ) : (
                                    <Badge variant="outline" className="px-1 py-0 mt-2.5 opacity-50">IN</Badge>
                                )}
                                <Input
                                    {...register('redes_sociales.linkedin')}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Twitter/X</Label>
                            <div className="flex gap-2">
                                {watch('redes_sociales.twitter') ? (
                                    <a
                                        href={watch('redes_sociales.twitter')?.startsWith('http') ? watch('redes_sociales.twitter') : `https://twitter.com/${watch('redes_sociales.twitter')?.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2.5 hover:text-accent transition-colors"
                                        title="Ver Twitter/X"
                                    >
                                        <Badge variant="outline" className="px-1 py-0">TW</Badge>
                                    </a>
                                ) : (
                                    <Badge variant="outline" className="px-1 py-0 mt-2.5 opacity-50">TW</Badge>
                                )}
                                <Input
                                    {...register('redes_sociales.twitter')}
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notas */}
            <Card>
                <CardHeader>
                    <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        {...register('notas')}
                        placeholder="Notas sobre este contacto..."
                        rows={3}
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
                        'Crear Contacto'
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </div>
        </form>
    )
}
