'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { createEntidad, updateEntidad } from '@/app/actions/entidades'
import { getCategorias } from '@/app/actions/categorias'
import type { Entidad, Categoria, TipoEntidad, Direccion, RedesSociales } from '@/lib/types'
import {
    Plus,
    X,
    Loader2,
    Building2,
    Store,
    User,
    Phone,
    Mail,
    Globe,
    MapPin,
    Wrench,
    Tag,
} from 'lucide-react'
import { TagInput } from '@/components/ui/tag-input'

interface EntidadFormProps {
    entidad?: Entidad
    mode: 'create' | 'edit'
}

interface FormData {
    tipo: TipoEntidad
    nombre_comercial: string
    razon_social?: string
    cuit?: string
    descripcion?: string
    categorias: Partial<Categoria>[]
    redes_sociales: RedesSociales
    activo: boolean
    notas?: string
    codigos_postales: string[]
    etiquetas: string[]
}

const tipoOptions: { value: TipoEntidad; label: string; icon: React.ReactNode }[] = [
    { value: 'PYME', label: 'PyME', icon: <Building2 className="h-4 w-4" /> },
    { value: 'NEGOCIO', label: 'Comercio', icon: <Store className="h-4 w-4" /> },
    { value: 'PROFESIONAL', label: 'Profesional', icon: <User className="h-4 w-4" /> },
    { value: 'SERVICIO', label: 'Servicio', icon: <Wrench className="h-4 w-4" /> },
]

export function EntidadForm({ entidad, mode }: EntidadFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [categorias, setCategorias] = useState<Categoria[]>([])

    // Controlled state for dynamic arrays
    const [telefonos, setTelefonos] = useState<string[]>(
        entidad?.telefonos?.length ? entidad.telefonos : ['']
    )
    const [emails, setEmails] = useState<string[]>(
        entidad?.emails?.length ? entidad.emails : ['']
    )
    const [direcciones, setDirecciones] = useState<Direccion[]>(
        entidad?.direcciones?.length ? entidad.direcciones : []
    )

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: entidad
            ? {
                tipo: entidad.tipo,
                nombre_comercial: entidad.nombre_comercial,
                razon_social: entidad.razon_social || '',
                cuit: entidad.cuit || '',
                descripcion: entidad.descripcion || '',
                categorias: entidad.categorias || [],
                redes_sociales: entidad.redes_sociales || {},
                activo: entidad.activo,
                notas: entidad.notas || '',
                codigos_postales: entidad.codigos_postales || [],
                etiquetas: entidad.etiquetas || [],
            }
            : {
                tipo: 'PYME',
                nombre_comercial: '',
                categorias: [],
                redes_sociales: {},
                activo: true,
                codigos_postales: [],
                etiquetas: [],
            },
    })

    // Array helpers
    const addTelefono = () => setTelefonos([...telefonos, ''])
    const removeTelefono = (index: number) => {
        if (telefonos.length > 1) setTelefonos(telefonos.filter((_, i) => i !== index))
    }
    const updateTelefono = (index: number, value: string) => {
        const newArr = [...telefonos]
        newArr[index] = value
        setTelefonos(newArr)
    }

    const addEmail = () => setEmails([...emails, ''])
    const removeEmail = (index: number) => {
        if (emails.length > 1) setEmails(emails.filter((_, i) => i !== index))
    }
    const updateEmail = (index: number, value: string) => {
        const newArr = [...emails]
        newArr[index] = value
        setEmails(newArr)
    }

    const addDireccion = () => {
        setDirecciones([...direcciones, {
            id: crypto.randomUUID(),
            tipo: 'fiscal',
            calle: '',
            numero: '',
            ciudad: '',
            provincia: '',
            cp: ''
        }])
    }
    const removeDireccion = (index: number) => {
        setDirecciones(direcciones.filter((_, i) => i !== index))
    }
    const updateDireccion = (index: number, field: keyof Direccion, value: string) => {
        const newArr = [...direcciones]
        newArr[index] = { ...newArr[index], [field]: value }
        setDirecciones(newArr)
    }

    useEffect(() => {
        async function loadCategorias() {
            const data = await getCategorias()
            setCategorias(data)
        }
        loadCategorias()
    }, [])

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError('')

        const formData = {
            ...data,
            telefonos: telefonos.filter(Boolean),
            emails: emails.filter(Boolean),
            direcciones,
        }

        try {
            const result = mode === 'create'
                ? await createEntidad(formData)
                : await updateEntidad(entidad!.id, formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/dashboard/entidades')
                router.refresh()
            }
        } catch (err) {
            setError('Error al guardar la entidad')
        } finally {
            setLoading(false)
        }
    }

    const selectedTipo = watch('tipo')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-error/10 border border-error/50 text-error rounded-lg p-3">
                    {error}
                </div>
            )}

            {/* Tipo de Entidad */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-accent" />
                        Tipo de Entidad
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {tipoOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setValue('tipo', option.value)}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedTipo === option.value
                                    ? 'border-accent bg-accent/10'
                                    : 'border-border hover:border-accent/50'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`p-2 rounded-lg ${selectedTipo === option.value ? 'bg-accent/20' : 'bg-card'
                                        }`}>
                                        {option.icon}
                                    </div>
                                    <span className="font-medium">{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Información Básica */}
            <Card>
                <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_comercial">Nombre Comercial *</Label>
                            <Input
                                id="nombre_comercial"
                                {...register('nombre_comercial', { required: 'Campo requerido' })}
                                placeholder="Nombre de la empresa o negocio"
                            />
                            {errors.nombre_comercial && (
                                <p className="text-error text-sm">{errors.nombre_comercial.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="razon_social">Razón Social</Label>
                            <Input
                                id="razon_social"
                                {...register('razon_social')}
                                placeholder="Razón social legal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cuit">CUIT</Label>
                            <Input
                                id="cuit"
                                {...register('cuit')}
                                placeholder="XX-XXXXXXXX-X"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Categorías</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {watch('categorias')?.map((cat) => (
                                    <Badge
                                        key={cat.id}
                                        variant="secondary"
                                        className="flex items-center gap-1 pl-2 pr-1 py-1"
                                        style={{ borderLeft: `4px solid ${cat.color}` }}
                                    >
                                        {cat.nombre}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const current = watch('categorias') || []
                                                setValue('categorias', current.filter(c => c.id !== cat.id), { shouldDirty: true })
                                            }}
                                            className="hover:bg-accent/20 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {(!watch('categorias') || watch('categorias').length === 0) && (
                                    <p className="text-sm text-text-secondary italic">Sin categorías seleccionadas</p>
                                )}
                            </div>
                            <Select
                                onValueChange={(id) => {
                                    const cat = categorias.find(c => c.id === id)
                                    if (cat) {
                                        const current = watch('categorias') || []
                                        if (!current.find(c => c.id === id)) {
                                            setValue('categorias', [...current, { id: cat.id, nombre: cat.nombre, color: cat.color }], { shouldDirty: true })
                                        }
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Agregar categoría..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias
                                        .filter(cat => !watch('categorias')?.some(c => c.id === cat.id))
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: cat.color }}
                                                    />
                                                    {cat.nombre}
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            {...register('descripcion')}
                            placeholder="Descripción de la entidad..."
                            rows={3}
                        />
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
                            <Label>Sitio Web</Label>
                            <div className="flex gap-2">
                                {watch('redes_sociales.website') ? (
                                    <a
                                        href={watch('redes_sociales.website')}
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
                                    {...register('redes_sociales.website')}
                                    placeholder="https://www.ejemplo.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram</Label>
                            <div className="flex gap-2">
                                {watch('redes_sociales.instagram') ? (
                                    <a
                                        href={watch('redes_sociales.instagram')?.startsWith('http') ? watch('redes_sociales.instagram') : `https://instagram.com/${watch('redes_sociales.instagram')?.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2.5 hover:text-accent transition-colors"
                                        title="Ver Instagram"
                                    >
                                        <Badge variant="outline" className="px-1 py-0">IG</Badge>
                                    </a>
                                ) : (
                                    <Badge variant="outline" className="px-1 py-0 mt-2.5 opacity-50">IG</Badge>
                                )}
                                <Input
                                    {...register('redes_sociales.instagram')}
                                    placeholder="@usuario"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Facebook</Label>
                            <div className="flex gap-2">
                                {watch('redes_sociales.facebook') ? (
                                    <a
                                        href={watch('redes_sociales.facebook')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2.5 hover:text-accent transition-colors"
                                        title="Ver Facebook"
                                    >
                                        <Badge variant="outline" className="px-1 py-0">FB</Badge>
                                    </a>
                                ) : (
                                    <Badge variant="outline" className="px-1 py-0 mt-2.5 opacity-50">FB</Badge>
                                )}
                                <Input
                                    {...register('redes_sociales.facebook')}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                        </div>
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
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Direcciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Direcciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {direcciones.map((direccion, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <Badge variant="secondary">Dirección {index + 1}</Badge>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeDireccion(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <Select
                                        value={direccion.tipo}
                                        onValueChange={(value) => updateDireccion(index, 'tipo', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fiscal">Fiscal</SelectItem>
                                            <SelectItem value="comercial">Comercial</SelectItem>
                                            <SelectItem value="obra">Obra</SelectItem>
                                            <SelectItem value="local">Local</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Calle</Label>
                                    <Input
                                        value={direccion.calle}
                                        onChange={(e) => updateDireccion(index, 'calle', e.target.value)}
                                        placeholder="Av. Rivadavia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Número</Label>
                                    <Input
                                        value={direccion.numero}
                                        onChange={(e) => updateDireccion(index, 'numero', e.target.value)}
                                        placeholder="1234"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ciudad</Label>
                                    <Input
                                        value={direccion.ciudad}
                                        onChange={(e) => updateDireccion(index, 'ciudad', e.target.value)}
                                        placeholder="Buenos Aires"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Provincia</Label>
                                    <Input
                                        value={direccion.provincia}
                                        onChange={(e) => updateDireccion(index, 'provincia', e.target.value)}
                                        placeholder="CABA"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Código Postal</Label>
                                    <Input
                                        value={direccion.cp}
                                        onChange={(e) => updateDireccion(index, 'cp', e.target.value)}
                                        placeholder="C1033"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addDireccion}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Dirección
                    </Button>
                </CardContent>
            </Card>

            {/* Etiquetas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-accent" />
                        Etiquetas de Estado
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TagInput
                        value={watch('etiquetas')}
                        onChange={(tags) => setValue('etiquetas', tags, { shouldDirty: true })}
                    />
                </CardContent>
            </Card>

            {/* Áreas de Cobertura */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Áreas de Cobertura (CP)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TagInput
                        value={watch('codigos_postales') || []}
                        onChange={(tags) => setValue('codigos_postales', tags, { shouldDirty: true })}
                        placeholder="Ej: 1425, B7600..."
                    />
                </CardContent>
            </Card>

            {/* Notas */}
            <Card>
                <CardHeader>
                    <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        {...register('notas')}
                        placeholder="Notas internas sobre esta entidad..."
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
                        'Crear Entidad'
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </div>
        </form>
    )
}
