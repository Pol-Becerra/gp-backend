'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, getInitials } from '@/lib/utils'
import type { AuditoriaLog } from '@/lib/types'
import {
    Plus,
    Pencil,
    Trash2,
    LogIn,
    LogOut,
    FolderPlus,
} from 'lucide-react'

interface RecentActivityProps {
    logs: AuditoriaLog[]
}

const actionIcons: Record<string, React.ReactNode> = {
    CREATE_ENTIDAD: <Plus className="h-4 w-4" />,
    UPDATE_ENTIDAD: <Pencil className="h-4 w-4" />,
    DELETE_ENTIDAD: <Trash2 className="h-4 w-4" />,
    CREATE_CONTACTO: <Plus className="h-4 w-4" />,
    UPDATE_CONTACTO: <Pencil className="h-4 w-4" />,
    DELETE_CONTACTO: <Trash2 className="h-4 w-4" />,
    CREATE_CATEGORIA: <FolderPlus className="h-4 w-4" />,
    UPDATE_CATEGORIA: <Pencil className="h-4 w-4" />,
    DELETE_CATEGORIA: <Trash2 className="h-4 w-4" />,
    LOGIN: <LogIn className="h-4 w-4" />,
    LOGOUT: <LogOut className="h-4 w-4" />,
}

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

export function RecentActivity({ logs }: RecentActivityProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <p className="text-text-muted text-center py-8">
                            No hay actividad reciente
                        </p>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-background-secondary transition-colors"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-accent/20 text-accent">
                                        {actionIcons[log.accion] || <Plus className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-text-primary">
                                            {actionLabels[log.accion] || log.accion}
                                        </span>
                                        <Badge variant={actionColors[log.accion] || 'secondary'}>
                                            {log.accion.split('_')[0]}
                                        </Badge>
                                    </div>
                                    {log.entidad_afectada && (
                                        <p className="text-text-secondary text-sm truncate">
                                            {log.entidad_afectada}
                                        </p>
                                    )}
                                    <p className="text-text-muted text-xs mt-1">
                                        {formatDateTime(log.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
