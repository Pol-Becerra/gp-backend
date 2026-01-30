import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { MainChart } from '@/components/dashboard/main-chart'
import { Building2, Users, FolderTree, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'

async function getDashboardSummary() {
    const supabase = await createClient()

    // Get basic stats
    const { data: entidades } = await supabase
        .from('entidades')
        .select('tipo, created_at, activo')

    const { count: contactosCount } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true })

    const stats = {
        total_entidades: entidades?.length || 0,
        total_pymes: entidades?.filter(e => e.tipo === 'PYME').length || 0,
        total_negocios: entidades?.filter(e => e.tipo === 'NEGOCIO').length || 0,
        total_profesionales: entidades?.filter(e => e.tipo === 'PROFESIONAL').length || 0,
        total_servicios: entidades?.filter(e => e.tipo === 'SERVICIO').length || 0,
        entidades_activas: entidades?.filter(e => e.activo).length || 0,
        total_contactos: contactosCount || 0,
        nuevas_ultimo_mes: 0,
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    stats.nuevas_ultimo_mes = entidades?.filter(
        e => new Date(e.created_at) > thirtyDaysAgo
    ).length || 0

    // Aggregations for Charts
    const entidadesPorTipo = [
        { name: 'PyMES', value: stats.total_pymes, color: '#3B82F6' },
        { name: 'Negocios', value: stats.total_negocios, color: '#22C55E' },
        { name: 'Profesionales', value: stats.total_profesionales, color: '#A855F7' },
        { name: 'Servicios', value: stats.total_servicios, color: '#F97316' },
    ]

    // Aggregations by Month (Last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        return {
            date: d,
            label: d.toLocaleString('es-ES', { month: 'short' })
        }
    }).reverse()

    const entidadesPorMes = months.map(m => {
        const monthEntidades = entidades?.filter(e => {
            const date = new Date(e.created_at)
            return date.getMonth() === m.date.getMonth() && date.getFullYear() === m.date.getFullYear()
        })
        return {
            mes: m.label,
            pymes: monthEntidades?.filter(e => e.tipo === 'PYME').length || 0,
            negocios: monthEntidades?.filter(e => e.tipo === 'NEGOCIO').length || 0,
            profesionales: monthEntidades?.filter(e => e.tipo === 'PROFESIONAL').length || 0,
        }
    })

    // Aggregations by Category
    const { data: categorias } = await supabase
        .from('entidades')
        .select(`
            categorias
        `)

    // Flatten and count categories
    const categoryCounts: Record<string, { count: number, color: string }> = {}

    categorias?.forEach(row => {
        if (Array.isArray(row.categorias)) {
            row.categorias.forEach((cat: any) => {
                if (!categoryCounts[cat.nombre]) {
                    categoryCounts[cat.nombre] = { count: 0, color: cat.color || '#3B82F6' }
                }
                categoryCounts[cat.nombre].count++
            })
        }
    })

    const entidadesPorCategoria = Object.entries(categoryCounts)
        .map(([nombre, data]) => ({
            categoria_nombre: nombre,
            categoria_color: data.color,
            count: data.count
        }))
        .sort((a, b) => b.count - a.count)


    return { stats, entidadesPorTipo, entidadesPorMes, entidadesPorCategoria }
}

export default async function DashboardPage() {
    const data = await getDashboardSummary()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary mt-1">
                    Bienvenido al panel de gestión de Guía PyMES
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={data.stats} />

            {/* Main Charts Area */}
            <MainChart
                entidadesPorCategoria={data.entidadesPorCategoria}
                entidadesPorMes={data.entidadesPorMes}
                entidadesPorTipo={data.entidadesPorTipo}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Access Cards */}
                <Link href="/dashboard/entidades" className="glass-card p-6 group hover:border-accent/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-accent/10 text-accent">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-text-muted group-hover:translate-x-1 group-hover:text-accent transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">Entidades</h3>
                    <p className="text-text-secondary text-sm">Gestiona PyMES, Comercios y Profesionales registrados.</p>
                </Link>

                <Link href="/dashboard/contactos" className="glass-card p-6 group hover:border-accent/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-accent/10 text-accent">
                            <Users className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-text-muted group-hover:translate-x-1 group-hover:text-accent transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">Contactos</h3>
                    <p className="text-text-secondary text-sm">Administra la base de datos de personas y roles.</p>
                </Link>

                <Link href="/dashboard/categorias" className="glass-card p-6 group hover:border-accent/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-accent/10 text-accent">
                            <FolderTree className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-text-muted group-hover:translate-x-1 group-hover:text-accent transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-1">Categorías</h3>
                    <p className="text-text-secondary text-sm">Organiza tus registros por jerarquías y clusters.</p>
                </Link>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40">
                <Link href="/dashboard/entidades/nueva" className="btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Entidad
                </Link>
                <Link href="/dashboard/estadisticas" className="btn-secondary">
                    Ver Estadísticas Completas
                </Link>
                <Link href="/dashboard/auditoria" className="btn-secondary">
                    Historial de Actividad
                </Link>
            </div>
        </div>
    )
}
