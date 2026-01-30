'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Building2,
    Users,
    FolderTree,
    ClipboardList,
    Settings,
    LogOut,
    BarChart3,
    ChevronLeft,
    Menu,
    Map,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/components/dashboard/sidebar-context'

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Estadísticas',
        href: '/dashboard/estadisticas',
        icon: BarChart3,
    },
    {
        name: 'Entidades',
        href: '/dashboard/entidades',
        icon: Building2,
    },
    {
        name: 'Contactos',
        href: '/dashboard/contactos',
        icon: Users,
    },
    {
        name: 'Categorías',
        href: '/dashboard/categorias',
        icon: FolderTree,
    },
    {
        name: 'Google Maps',
        href: '/dashboard/google-maps',
        icon: Map,
    },
    {
        name: 'Tareas',
        href: '/dashboard/tareas',
        icon: ClipboardList,
    },
    {
        name: 'Auditorías',
        href: '/dashboard/auditoria',
        icon: ClipboardList,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { collapsed, setCollapsed, toggleCollapsed } = useSidebar()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 lg:hidden"
                onClick={toggleCollapsed}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300',
                    collapsed ? 'w-16' : 'w-64',
                    'max-lg:translate-x-[-100%]',
                    !collapsed && 'max-lg:translate-x-0'
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                <span className="text-background font-bold text-lg">GP</span>
                            </div>
                            <span className="text-xl font-bold text-text-primary">
                                Guía PyMES
                            </span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapsed}
                        className="hidden lg:flex"
                    >
                        <ChevronLeft
                            className={cn(
                                'h-5 w-5 transition-transform',
                                collapsed && 'rotate-180'
                            )}
                        />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    'text-text-secondary hover:text-text-primary hover:bg-background-secondary',
                                    isActive && 'bg-accent/10 text-accent border-l-2 border-accent',
                                    collapsed && 'justify-center px-2'
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-accent')} />
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-border p-2 space-y-1">
                    <Link
                        href="/dashboard/configuracion"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                            'text-text-secondary hover:text-text-primary hover:bg-background-secondary',
                            collapsed && 'justify-center px-2'
                        )}
                        title={collapsed ? 'Configuración' : undefined}
                    >
                        <Settings className="h-5 w-5" />
                        {!collapsed && <span className="font-medium">Configuración</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
                            'text-text-secondary hover:text-error hover:bg-error/10',
                            collapsed && 'justify-center px-2'
                        )}
                        title={collapsed ? 'Cerrar Sesión' : undefined}
                    >
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {!collapsed && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}
        </>
    )
}
