import Link from 'next/link'
import { getGoogleMapsData } from '@/app/actions/google-maps'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Plus, Map, Eye, Pencil, Star, Phone, Globe, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'

interface PageProps {
    searchParams: {
        title?: string
        rubro?: string
        website?: string
        phone?: string
        page?: string
    }
}

export default async function GoogleMapsPage({ searchParams }: PageProps) {
    const currentPage = Number(searchParams.page) || 1
    const limit = 10

    const { data, count } = await getGoogleMapsData({
        title: searchParams.title,
        rubro: searchParams.rubro,
        website: searchParams.website,
        phone: searchParams.phone,
        page: currentPage,
        limit
    })

    const totalPages = Math.ceil(count / limit)

    // Helper to generate search query URL
    const getQueryString = (params: Record<string, string | number | undefined>) => {
        const newParams = new URLSearchParams()

        // Keep existing params
        if (searchParams.title) newParams.set('title', searchParams.title)
        if (searchParams.rubro) newParams.set('rubro', searchParams.rubro)
        if (searchParams.website) newParams.set('website', searchParams.website)
        if (searchParams.phone) newParams.set('phone', searchParams.phone)

        // Update with new params
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                newParams.delete(key)
            } else {
                newParams.set(key, String(value))
            }
        })

        return newParams.toString() ? `?${newParams.toString()}` : ''
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Google Maps Data</h1>
                    <p className="text-text-secondary mt-1">
                        Gestiona los datos recolectados de Google Maps
                    </p>
                </div>
                <Link href="/dashboard/google-maps/nuevo">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Registro
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-muted ml-1">Título</label>
                            <Input
                                name="title"
                                placeholder="Buscar por título..."
                                defaultValue={searchParams.title}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-muted ml-1">Rubro / Categoría</label>
                            <Input
                                name="rubro"
                                placeholder="Rubro buscado..."
                                defaultValue={searchParams.rubro}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-text-muted ml-1">Web</label>
                            <Input
                                name="website"
                                placeholder="Sitioweb.com..."
                                defaultValue={searchParams.website}
                            />
                        </div>
                        <div className="space-y-1 flex flex-col justify-end">
                            <label className="text-xs font-medium text-text-muted ml-1">Teléfono</label>
                            <div className="flex gap-2">
                                <Input
                                    name="phone"
                                    placeholder="Nro de teléfono..."
                                    defaultValue={searchParams.phone}
                                />
                                <Button type="submit" size="icon" variant="secondary">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Reset hidden field to avoid inheriting page if we change filters */}
                        <input type="hidden" name="page" value="1" />
                    </form>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <Map className="h-12 w-12 text-text-muted mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-text-primary">
                                No hay datos de Google Maps
                            </h3>
                            <p className="text-text-secondary mt-1">
                                No se encontraron registros que coincidan con la búsqueda
                            </p>
                            <Link href="/dashboard/google-maps/nuevo">
                                <Button className="mt-4">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Registro
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Negocio</TableHead>
                                        <TableHead>Rubro / Categoría</TableHead>
                                        <TableHead>Ubicación</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {entry.title}
                                                    </p>
                                                    {entry.plus_code && (
                                                        <p className="text-text-muted text-sm font-mono">
                                                            {entry.plus_code}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-text-primary capitalize">{entry.rubro_buscado}</p>
                                                    <p className="text-text-muted text-sm">{entry.category_name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-text-secondary text-sm" title={entry.address || ''}>
                                                    {entry.city || entry.state || 'N/A'}
                                                </p>
                                                <p className="text-text-muted text-xs">
                                                    {entry.street ? truncate(entry.street, 20) : 'N/A'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {entry.total_score ? (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-accent text-accent" />
                                                        <span className="font-medium">{entry.total_score}</span>
                                                        <span className="text-text-muted text-xs">({entry.reviews_count})</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-text-muted text-xs">Sin reseñas</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    {entry.phone && (
                                                        <Phone className="h-4 w-4" />
                                                    )}
                                                    {entry.website && (
                                                        <a href={entry.website} target="_blank" rel="noopener noreferrer" title={entry.website}>
                                                            <Globe className="h-4 w-4 hover:text-accent transition-colors" />
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-text-muted text-sm whitespace-nowrap">
                                                {formatDate(entry.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/dashboard/google-maps/${entry.id}`}>
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

                            {/* Pagination */}
                            <div className="p-4 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-text-secondary">
                                    Mostrando <span className="font-medium">{data.length}</span> de <span className="font-medium">{count}</span> registros
                                </p>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={currentPage > 1 ? getQueryString({ page: currentPage - 1 }) : '#'}
                                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                    >
                                        <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Anterior
                                        </Button>
                                    </Link>
                                    <div className="flex items-center gap-1 bg-background-secondary px-3 py-1 rounded-md border border-border">
                                        <span className="text-sm font-medium text-accent">{currentPage}</span>
                                        <span className="text-sm text-text-muted">/</span>
                                        <span className="text-sm text-text-secondary">{totalPages || 1}</span>
                                    </div>
                                    <Link
                                        href={currentPage < totalPages ? getQueryString({ page: currentPage + 1 }) : '#'}
                                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                    >
                                        <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
                                            Siguiente
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
