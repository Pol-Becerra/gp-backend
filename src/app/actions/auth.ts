'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function resetPassword(email: string) {
    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin') || headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'

    // Construct base URL more robustly
    const baseUrl = origin?.startsWith('http') ? origin : `${protocol}://${origin}`

    console.log(`[Auth] Reset password attempt for: ${email}`)
    console.log(`[Auth] Base URL for redirect: ${baseUrl}`)

    if (!email || !email.includes('@')) {
        return { error: 'Por favor, ingresa un correo electrónico válido.' }
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${baseUrl}/dashboard/configuracion`,
        })

        if (error) {
            console.error('[Auth] Supabase error:', error)

            // Helpful messages for self-hosted instances
            if (error.message.includes('identity_not_found')) {
                return { error: 'El usuario no existe.' }
            }
            if (error.message.includes('SMTP')) {
                return { error: 'Error en el servidor de correo (SMTP). Verifique la configuración de Supabase.' }
            }
            if (error.message.includes('rate limit')) {
                return { error: 'Demasiados intentos. Inténtalo más tarde.' }
            }

            return { error: `Supabase: ${error.message} (${error.status || 'sin estado'})` }
        }

        console.log('[Auth] Reset email sent.')
        return { success: true }
    } catch (err: any) {
        console.error('[Auth] Unexpected error:', err)
        return { error: `Error inesperado: ${err.message || 'Error desconocido'}` }
    }
}
