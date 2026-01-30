import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    getEntidadById,
    deleteEntidad,
} from '@/app/actions/entidades'
import { getContactosByEntidad } from '@/app/actions/contactos'
import { Search } from '@/components/dashboard/search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Pencil,
    ArrowLeft,
    Building2,
    Phone,
    Mail,
    Globe,
    MapPin,
    Users,
    Calendar,
    Plus,
} from 'lucide-react'
import { formatDate, getInitials, getTipoEntidadLabel } from '@/lib/utils'
import { DeleteEntidadButton } from './delete-button'
import { DeleteContactButton } from '@/components/dashboard/delete-contact-button'
import { DeleteDireccionButton } from '@/components/dashboard/delete-direccion-button'

interface PageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ search?: string }>
}

export default async function EntidadDetailPage(props: PageProps) {
    const params = await props.params
    const searchParams = await props.searchParams

    const entidad = await getEntidadById(params.id)

    if (!entidad) {
        notFound()
    }

    const contactos = searchParams.search
        ? await getContactosByEntidad(params.id, searchParams.search)
        : entidad.contactos


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/entidades">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-text-primary">
                                {entidad.nombre_comercial}
                            </h1>
                            <Badge
                                variant={
                                    entidad.tipo === 'PYME'
                                        ? 'pyme'
                                        : entidad.tipo === 'NEGOCIO'
                                            ? 'negocio'
                                            : 'profesional'
                                }
                            >
                                {getTipoEntidadLabel(entidad.tipo)}
                            </Badge>
                            <Badge variant={entidad.activo ? 'success' : 'secondary'}>
                                {entidad.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                        {entidad.razon_social && (
                            <p className="text-text-secondary mt-1">{entidad.razon_social}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/entidades/${entidad.id}/editar`}>
                        <Button variant="secondary">
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </Link>
                    <DeleteEntidadButton id={entidad.id} nombre={entidad.nombre_comercial} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    {entidad.descripcion && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Descripción</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary">{entidad.descripcion}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Phones */}
                            {entidad.telefonos?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Teléfonos
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {entidad.telefonos.map((tel: string, i: number) => (
                                            <a
                                                key={i}
                                                href={`tel:${tel}`}
                                                className="px-3 py-1 bg-card-hover rounded-lg text-text-primary hover:bg-accent/10 transition-colors"
                                            >
                                                {tel}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Emails */}
                            {entidad.emails?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Correos Electrónicos
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {entidad.emails.map((email: string, i: number) => (
                                            <a
                                                key={i}
                                                href={`mailto:${email}`}
                                                className="px-3 py-1 bg-card-hover rounded-lg text-text-primary hover:bg-accent/10 transition-colors"
                                            >
                                                {email}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Networks */}
                            {Object.keys(entidad.redes_sociales || {}).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                                        <Globe className="h-4 w-4" /> Redes Sociales
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(entidad.redes_sociales || {} as Record<string, string>)
                                            .filter(([, value]) => value)
                                            .map(([key, value]) => (
                                                <a
                                                    key={key}
                                                    href={
                                                        String(value).startsWith('http')
                                                            ? String(value)
                                                            : `https://${value}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-card-hover rounded-lg text-text-primary hover:bg-accent/10 transition-colors capitalize"
                                                >
                                                    {key}
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Direcciones
                            </CardTitle>
                            <Link href={`/dashboard/entidades/${entidad.id}/direcciones/nueva`}>
                                <Button size="sm" variant="ghost">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {entidad.direcciones?.length > 0 ? (
                                <div className="space-y-3">
                                    {entidad.direcciones.map((dir: any, i: number) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-card-hover rounded-lg flex items-start justify-between group"
                                        >
                                            <div>
                                                <Badge variant="secondary" className="mb-2">
                                                    {dir.tipo}
                                                </Badge>
                                                <p className="text-text-primary">
                                                    {dir.calle} {dir.numero}
                                                    {dir.piso && `, Piso ${dir.piso}`}
                                                    {dir.oficina && ` Of. ${dir.oficina}`}
                                                </p>
                                                <p className="text-text-muted text-sm">
                                                    {dir.ciudad}, {dir.provincia} {dir.cp}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/dashboard/entidades/${entidad.id}/direcciones/${dir.id}/editar`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteDireccionButton
                                                    entidadId={entidad.id}
                                                    direccionId={dir.id}
                                                    direccionDetalle={`${dir.calle} ${dir.numero}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-muted text-center py-4">
                                    No hay direcciones registradas
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contacts */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Contactos ({entidad.contactos?.length || 0})
                            </CardTitle>
                            <Link href={`/dashboard/entidades/${entidad.id}/contactos/nuevo`}>
                                <Button size="sm">Agregar Contacto</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {entidad.contactos?.length === 0 ? (
                                <p className="text-text-muted text-center py-4">
                                    No hay contactos registrados
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entidad.contactos?.map((contacto: any) => (
                                            <TableRow key={contacto.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {getInitials(contacto.nombre_completo)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{contacto.nombre_completo}</p>
                                                            {contacto.cargo && (
                                                                <p className="text-text-muted text-sm">
                                                                    {contacto.cargo}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{contacto.rol}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-text-muted text-sm">
                                                        {contacto.telefonos?.[0] && (
                                                            <div>{contacto.telefonos[0]}</div>
                                                        )}
                                                        {contacto.emails?.[0] && (
                                                            <div>{contacto.emails[0]}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/dashboard/entidades/${entidad.id}/contactos/${contacto.id}/editar`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <DeleteContactButton
                                                            contactoId={contacto.id}
                                                            nombre={contacto.nombre_completo}
                                                            entidadId={entidad.id}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {entidad.cuit && (
                                <div>
                                    <p className="text-text-muted text-sm">CUIT</p>
                                    <p className="font-medium">{entidad.cuit}</p>
                                </div>
                            )}
                            {entidad.categorias && entidad.categorias.length > 0 && (
                                <div>
                                    <p className="text-text-muted text-sm mb-2">Categorías</p>
                                    <div className="space-y-2">
                                        {entidad.categorias.map((cat: any) => (
                                            <div key={cat.id} className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <span className="font-medium text-sm">{cat.nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {entidad.codigos_postales && entidad.codigos_postales.length > 0 && (
                                <div>
                                    <p className="text-text-muted text-sm mb-2">Cobertura</p>
                                    <div className="flex flex-wrap gap-1">
                                        {entidad.codigos_postales.map((cp: string) => (
                                            <Badge key={cp} variant="outline" className="text-[10px] font-mono leading-none py-1">
                                                {cp}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-text-muted text-sm">Creado</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(entidad.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-text-muted text-sm">Última actualización</p>
                                <p className="font-medium">{formatDate(entidad.updated_at)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    {entidad.notas && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary whitespace-pre-wrap">
                                    {entidad.notas}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div >
    )
}
