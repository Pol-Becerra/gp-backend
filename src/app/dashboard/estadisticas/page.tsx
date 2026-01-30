import { createClient } from '@/lib/supabase/server'
import { MainChart } from '@/components/dashboard/main-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

async function getEstadisticasData() {
    const supabase = await createClient()

    // Get all entities for stats
    const { data: entidades } = await supabase
        .from('entidades')
        .select('tipo, created_at')

    const stats = {
        total_entidades: entidades?.length || 0,
        total_pymes: entidades?.filter(e => e.tipo === 'PYME').length || 0,
        total_negocios: entidades?.filter(e => e.tipo === 'NEGOCIO').length || 0,
        total_profesionales: entidades?.filter(e => e.tipo === 'PROFESIONAL').length || 0,
        total_servicios: entidades?.filter(e => e.tipo === 'SERVICIO').length || 0,
    }

    // Entities by category
    const { data: entidadesConCategorias } = await supabase
        .from('entidades')
        .select('categorias')

    const categoryCounts: Record<string, { nombre: string; color: string; count: number }> = {}
    entidadesConCategorias?.forEach((e: any) => {
        if (Array.isArray(e.categorias)) {
            e.categorias.forEach((cat: any) => {
                const key = cat.nombre
                if (!categoryCounts[key]) {
                    categoryCounts[key] = {
                        nombre: cat.nombre,
                        color: cat.color || '#39FF14',
                        count: 0,
                    }
                }
                categoryCounts[key].count++
            })
        }
    })

    const entidadesPorCategoria = Object.values(categoryCounts).map(c => ({
        categoria_nombre: c.nombre,
        categoria_color: c.color,
        count: c.count,
    }))

    // Entities by month (simulated for demo)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    const entidadesPorMes = months.map((mes, i) => ({
        mes,
        pymes: Math.floor(stats.total_pymes / 6) + (i % 2),
        negocios: Math.floor(stats.total_negocios / 6) + (i % 3),
        profesionales: Math.floor(stats.total_profesionales / 6) + (i % 2),
        servicios: Math.floor(stats.total_servicios / 6) + (i % 2),
    }))

    // Entities by type for distribution
    const entidadesPorTipo = [
        { name: 'PyMES', value: stats.total_pymes, color: '#3B82F6' },
        { name: 'Negocios', value: stats.total_negocios, color: '#22C55E' },
        { name: 'Profesionales', value: stats.total_profesionales, color: '#39FF14' },
        { name: 'Servicios', value: stats.total_servicios, color: '#A855F7' },
    ]

    return {
        entidadesPorCategoria,
        entidadesPorMes,
        entidadesPorTipo,
    }
}

export default async function EstadisticasPage() {
    const data = await getEstadisticasData()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-accent" />
                    Estadísticas
                </h1>
                <p className="text-text-secondary mt-1">
                    Análisis visual detallado de tus entidades y registros
                </p>
            </div>

            {/* Main Charts */}
            <MainChart
                entidadesPorCategoria={data.entidadesPorCategoria}
                entidadesPorMes={data.entidadesPorMes}
                entidadesPorTipo={data.entidadesPorTipo}
            />
        </div>
    )
}
