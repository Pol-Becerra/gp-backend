'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type AuditAction =
    | 'CREATE_ENTIDAD'
    | 'UPDATE_ENTIDAD'
    | 'DELETE_ENTIDAD'
    | 'CREATE_CONTACTO'
    | 'UPDATE_CONTACTO'
    | 'DELETE_CONTACTO'
    | 'CREATE_CATEGORIA'
    | 'UPDATE_CATEGORIA'
    | 'DELETE_CATEGORIA'
    | 'CREATE_GOOGLE_MAPS_ENTRY'
    | 'UPDATE_GOOGLE_MAPS_ENTRY'
    | 'DELETE_GOOGLE_MAPS_ENTRY'
    | 'CREATE_TAREA'
    | 'UPDATE_TAREA'
    | 'DELETE_TAREA'
    | 'CREATE_TAREA_AREA'
    | 'UPDATE_TAREA_AREA'
    | 'DELETE_TAREA_AREA'
    | 'LOGIN'
    | 'LOGOUT'

interface LogActionParams {
    action: AuditAction
    entityName: string
    details?: Record<string, unknown>
}

export async function logAction({ action, entityName, details }: LogActionParams) {
    const supabase = createClient()
    const headersList = headers()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.warn('Audit log: No user found')
        return
    }

    const ipAddress = headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        'unknown'

    const { error } = await supabase.from('auditoria_logs').insert({
        user_id: user.id,
        accion: action,
        entidad_afectada: entityName,
        detalles: details || {},
        ip_address: ipAddress,
    })

    if (error) {
        console.error('Error logging action:', error)
    }
}
