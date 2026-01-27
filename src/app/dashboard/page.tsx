import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { MainChart } from '@/components/dashboard/main-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'

async function getDashboardData() {
    const supabase = createClient()

    // Get entities count by type
    const { data: entidades } = await supabase
        .from('entidades')
        .select('tipo, created_at')

    const stats = {
        total_entidades: entidades?.length || 0,
        total_pymes: entidades?.filter(e => e.tipo === 'PYME').length || 0,
        total_negocios: entidades?.filter(e => e.tipo === 'NEGOCIO').length || 0,
        total_profesionales: entidades?.filter(e => e.tipo === 'PROFESIONAL').length || 0,
        total_servicios: entidades?.filter(e => e.tipo === 'SERVICIO').length || 0,
        total_contactos: 0,
        nuevas_ultimo_mes: 0,
    }

    // Get contacts count
    const { count: contactosCount } = await supabase
        .from('contactos')
        .select('*', { count: 'exact', head: true })
    stats.total_contactos = contactosCount || 0

    // New entities in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    stats.nuevas_ultimo_mes = entidades?.filter(
        e => new Date(e.created_at) > thirtyDaysAgo
    ).length || 0

    // Entities by category
    const { data: entidadesPorCategoria } = await supabase
        .from('entidades')
        .select('categoria_id, categorias(nombre, color)')

    const categoryCounts: Record<string, { nombre: string; color: string; count: number }> = {}
    entidadesPorCategoria?.forEach((e: any) => {
        if (e.categorias) {
            const key = e.categorias.nombre
            if (!categoryCounts[key]) {
                categoryCounts[key] = {
                    nombre: e.categorias.nombre,
                    color: e.categorias.color || '#39FF14',
                    count: 0,
                }
            }
            categoryCounts[key].count++
        }
    })

    const entidadesPorCategoriaChart = Object.values(categoryCounts).map(c => ({
        categoria_nombre: c.nombre,
        categoria_color: c.color,
        count: c.count,
    }))

    // Entities by month (simulated for demo, would need real monthly aggregation)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    const entidadesPorMes = months.map((mes, i) => ({
        mes,
        pymes: Math.floor(stats.total_pymes / 6) + (i % 2),
        negocios: Math.floor(stats.total_negocios / 6) + (i % 3),
        profesionales: Math.floor(stats.total_profesionales / 6) + (i % 2),
        servicios: Math.floor(stats.total_servicios / 6) + (i % 2),
    }))

    // Entities by type for pie chart
    const entidadesPorTipo = [
        { name: 'PyMES', value: stats.total_pymes, color: '#3B82F6' },
        { name: 'Negocios', value: stats.total_negocios, color: '#22C55E' },
        { name: 'Profesionales', value: stats.total_profesionales, color: '#39FF14' },
        { name: 'Servicios', value: stats.total_servicios, color: '#A855F7' },
    ]

    // Recent activity logs
    const { data: logs } = await supabase
        .from('auditoria_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    return {
        stats,
        entidadesPorCategoria: entidadesPorCategoriaChart,
        entidadesPorMes,
        entidadesPorTipo,
        logs: logs || [],
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary mt-1">
                    Resumen de tu gestión de entidades y contactos
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={data.stats} />

            {/* Charts */}
            <MainChart
                entidadesPorCategoria={data.entidadesPorCategoria}
                entidadesPorMes={data.entidadesPorMes}
                entidadesPorTipo={data.entidadesPorTipo}
            />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity logs={data.logs} />
                </div>
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-text-primary mb-4">Acciones Rápidas</h3>
                        <div className="space-y-2">
                            <a
                                href="/dashboard/entidades/nueva"
                                className="btn-primary w-full text-center block"
                            >
                                + Nueva Entidad
                            </a>
                            <a
                                href="/dashboard/categorias"
                                className="btn-secondary w-full text-center block"
                            >
                                Gestionar Categorías
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
