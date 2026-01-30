import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('[Supabase Server] Creating client...', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        env: process.env.NODE_ENV
    })

    if (!supabaseUrl || !supabaseAnonKey) {
        const errorMsg = 'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        console.error('[Supabase Server] Error:', errorMsg)
        throw new Error(errorMsg)
    }

    try {
        const cookieStore = await cookies()
        console.log('[Supabase Server] Cookies retrieved')

        return createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Handle cookie error in Server Components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Handle cookie error in Server Components
                    }
                },
            },
        })
    } catch (error) {
        console.error('[Supabase Server] Unexpected error:', error)
        throw error
    }
}

export function createServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
        )
    }

    return createServerClient(supabaseUrl, serviceRoleKey, {
        cookies: {
            get() { return undefined },
            set() { },
            remove() { },
        },
    })
}
