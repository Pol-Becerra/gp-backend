import Link from 'next/link'
import { getEntidades } from '@/app/actions/entidades'
import { getCategorias } from '@/app/actions/categorias'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Building2, Eye, Pencil, Phone, Mail } from 'lucide-react'
import { formatDate, truncate, getTipoEntidadLabel } from '@/lib/utils'
import { EntidadesFilter } from './entidades-filter'

interface PageProps {
    searchParams: Promise<{
        search?: string
        tipo?: string
        categoria?: string
        postalCode?: string
        etiqueta?: string
    }>
}

export default async function EntidadesPage(props: PageProps) {
    const searchParams = await props.searchParams
    const entidades = await getEntidades(
        searchParams.search,
        searchParams.tipo as any,
        searchParams.categoria,

        searchParams.postalCode,
        searchParams.etiqueta
    )
    const categorias = await getCategorias()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Entidades</h1>
                    <p className="text-text-secondary mt-1">
                        Gestiona tus empresas, negocios y profesionales
                    </p>
                </div>
                <Link href="/dashboard/entidades/nueva">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Entidad
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <EntidadesFilter categorias={categorias} />

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {entidades.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-text-muted mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-text-primary">
                                No hay entidades
                            </h3>
                            <p className="text-text-secondary mt-1">
                                Comienza creando tu primera entidad
                            </p>
                            <Link href="/dashboard/entidades/nueva">
                                <Button className="mt-4">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Entidad
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entidades.map((entidad: any) => (
                                    <TableRow key={entidad.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-text-primary">
                                                    {entidad.nombre_comercial}
                                                </p>
                                                {entidad.razon_social && (
                                                    <p className="text-text-muted text-sm italic">
                                                        {truncate(entidad.razon_social, 30)}
                                                    </p>
                                                )}
                                                {entidad.etiquetas && entidad.etiquetas.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {entidad.etiquetas.map((tag: string) => (
                                                            <span
                                                                key={tag}
                                                                className="text-[9px] px-1.5 py-0.5 rounded-md bg-accent/5 text-accent/80 border border-accent/10 font-bold uppercase tracking-wider"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            {entidad.categorias && entidad.categorias.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {entidad.categorias.map((cat: any) => (
                                                        <div key={cat.id} className="flex items-center gap-1.5 bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10">
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: cat.color }}
                                                            />
                                                            <span className="text-[11px] text-text-secondary whitespace-nowrap">
                                                                {cat.nombre}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-text-muted">Sin categoría</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 text-text-muted">
                                                {entidad.telefonos?.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        <span className="text-sm">{entidad.telefonos.length}</span>
                                                    </div>
                                                )}
                                                {entidad.emails?.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="text-sm">{entidad.emails.length}</span>
                                                    </div>
                                                )}
                                                {entidad._count?.contactos > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {entidad._count.contactos} contactos
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={entidad.activo ? 'success' : 'secondary'}>
                                                {entidad.activo ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-text-muted">
                                            {formatDate(entidad.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/entidades/${entidad.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/entidades/${entidad.id}/editar`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
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
