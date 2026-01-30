import Link from 'next/link'
import { getContactos } from '@/app/actions/contactos'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Users, Phone, Mail, Building2, Pencil } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'
import { DeleteContactButton } from '@/components/dashboard/delete-contact-button'
import { Plus } from 'lucide-react'
import { Search } from '@/components/dashboard/search'

export default async function ContactosPage(props: {
    searchParams: Promise<{ search?: string }>
}) {
    const searchParams = await props.searchParams
    const contactos = await getContactos(searchParams.search)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Contactos</h1>
                    <p className="text-text-secondary mt-1">
                        Gestiona los contactos de todas las entidades
                    </p>
                </div>
                <Link href="/dashboard/contactos/nuevo">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Contacto
                    </Button>
                </Link>
            </div>

            <div className="w-full sm:w-1/2">
                <Search placeholder="Buscar contactos..." />
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {contactos.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-text-primary">
                                No hay contactos
                            </h3>
                            <p className="text-text-secondary mt-1">
                                Agrega contactos a tus entidades
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Entidad</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contactos.map((contacto: any) => (
                                    <TableRow key={contacto.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>
                                                        {getInitials(contacto.nombre_completo)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-text-primary">
                                                            {contacto.nombre_completo}
                                                        </p>
                                                        {contacto.es_principal && (
                                                            <Badge variant="default" className="text-xs">
                                                                Principal
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {contacto.cargo && (
                                                        <p className="text-text-muted text-sm">
                                                            {contacto.cargo}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {contacto.entidad && (
                                                <Link
                                                    href={`/dashboard/entidades/${contacto.entidad.id}`}
                                                    className="flex items-center gap-2 hover:text-accent transition-colors"
                                                >
                                                    <Building2 className="h-4 w-4 text-text-muted" />
                                                    <span>{contacto.entidad.nombre_comercial}</span>
                                                </Link>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{contacto.rol}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1 text-sm">
                                                {contacto.telefonos?.[0] && (
                                                    <div className="flex items-center gap-2 text-text-muted">
                                                        <Phone className="h-3 w-3" />
                                                        {contacto.telefonos[0]}
                                                    </div>
                                                )}
                                                {contacto.emails?.[0] && (
                                                    <div className="flex items-center gap-2 text-text-muted">
                                                        <Mail className="h-3 w-3" />
                                                        {contacto.emails[0]}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-text-muted">
                                            {formatDate(contacto.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/entidades/${contacto.entidad_id}/contactos/${contacto.id}/editar`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteContactButton
                                                    contactoId={contacto.id}
                                                    nombre={contacto.nombre_completo}
                                                    entidadId={contacto.entidad_id}
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
    )
}
