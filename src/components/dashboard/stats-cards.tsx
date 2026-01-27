'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'accent' | 'info' | 'success' | 'warning' | 'error' | 'service'
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'accent',
}: StatCardProps) {
    const colorClasses = {
        accent: 'text-accent bg-accent/10',
        info: 'text-info bg-info/10',
        success: 'text-success bg-success/10',
        warning: 'text-warning bg-warning/10',
        error: 'text-error bg-error/10',
        service: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    }

    return (
        <Card className="stat-card p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-text-secondary text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-text-primary">{value}</p>
                    {subtitle && (
                        <p className="text-text-muted text-sm">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    trend.isPositive ? 'text-success' : 'text-error'
                                )}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-text-muted text-sm">vs mes anterior</span>
                        </div>
                    )}
                </div>
                <div className={cn('p-3 rounded-lg', colorClasses[color])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    )
}

interface StatsCardsProps {
    stats: {
        total_entidades: number
        total_pymes: number
        total_negocios: number
        total_profesionales: number
        total_servicios: number
        total_contactos: number
        nuevas_ultimo_mes: number
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards: StatCardProps[] = [
        {
            title: 'Total Entidades',
            value: stats.total_entidades,
            subtitle: `${stats.nuevas_ultimo_mes} nuevas este mes`,
            icon: require('lucide-react').Building2,
            color: 'accent',
        },
        {
            title: 'PyMES',
            value: stats.total_pymes,
            icon: require('lucide-react').Factory,
            color: 'info',
        },
        {
            title: 'Comercios',
            value: stats.total_negocios,
            icon: require('lucide-react').Store,
            color: 'success',
        },
        {
            title: 'Profesionales',
            value: stats.total_profesionales,
            icon: require('lucide-react').User,
            color: 'warning',
        },
        {
            title: 'Servicios',
            value: stats.total_servicios,
            icon: require('lucide-react').Wrench,
            color: 'service',
        },
        {
            title: 'Contactos',
            value: stats.total_contactos,
            icon: require('lucide-react').Users,
            color: 'accent',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    )
}
