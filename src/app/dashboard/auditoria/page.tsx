import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ClipboardList } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

const actionLabels: Record<string, string> = {
    CREATE_ENTIDAD: 'Creó entidad',
    UPDATE_ENTIDAD: 'Actualizó entidad',
    DELETE_ENTIDAD: 'Eliminó entidad',
    CREATE_CONTACTO: 'Creó contacto',
    UPDATE_CONTACTO: 'Actualizó contacto',
    DELETE_CONTACTO: 'Eliminó contacto',
    CREATE_CATEGORIA: 'Creó categoría',
    UPDATE_CATEGORIA: 'Actualizó categoría',
    DELETE_CATEGORIA: 'Eliminó categoría',
    LOGIN: 'Inició sesión',
    LOGOUT: 'Cerró sesión',
}

const actionColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    CREATE_ENTIDAD: 'success',
    UPDATE_ENTIDAD: 'warning',
    DELETE_ENTIDAD: 'error',
    CREATE_CONTACTO: 'success',
    UPDATE_CONTACTO: 'warning',
    DELETE_CONTACTO: 'error',
    CREATE_CATEGORIA: 'success',
    UPDATE_CATEGORIA: 'warning',
    DELETE_CATEGORIA: 'error',
    LOGIN: 'info',
    LOGOUT: 'info',
}

export default async function AuditoriaPage() {
    const supabase = await createClient()

    const { data: logs } = await supabase
        .from('auditoria_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Auditorías</h1>
                <p className="text-text-secondary mt-1">
                    Registro de todas las acciones realizadas en el sistema
                </p>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-accent" />
                        Últimas 100 acciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {!logs || logs.length === 0 ? (
                        <div className="text-center py-12">
                            <ClipboardList className="h-12 w-12 text-text-muted mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-text-primary">
                                No hay registros
                            </h3>
                            <p className="text-text-secondary mt-1">
                                Las acciones aparecerán aquí cuando se realicen
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Acción</TableHead>
                                    <TableHead>Entidad Afectada</TableHead>
                                    <TableHead>Detalles</TableHead>
                                    <TableHead>IP</TableHead>
                                    <TableHead>Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log: any) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={actionColors[log.accion] || 'secondary'}>
                                                    {log.accion.split('_')[0]}
                                                </Badge>
                                                <span className="text-text-primary">
                                                    {actionLabels[log.accion] || log.accion}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-text-secondary">
                                            {log.entidad_afectada || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {log.detalles && Object.keys(log.detalles).length > 0 ? (
                                                <code className="text-xs bg-background-secondary px-2 py-1 rounded">
                                                    {JSON.stringify(log.detalles)}
                                                </code>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="text-text-muted text-sm">
                                            {log.ip_address || '-'}
                                        </TableCell>
                                        <TableCell className="text-text-muted text-sm">
                                            {formatDateTime(log.created_at)}
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
