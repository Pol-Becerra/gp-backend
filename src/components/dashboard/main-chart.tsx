'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EntidadPorCategoria {
    categoria_nombre: string
    categoria_color: string
    count: number
}

interface EntidadPorMes {
    mes: string
    pymes: number
    negocios: number
    profesionales: number
}

interface MainChartProps {
    entidadesPorCategoria: EntidadPorCategoria[]
    entidadesPorMes: EntidadPorMes[]
    entidadesPorTipo: {
        name: string
        value: number
        color: string
    }[]
}

export function MainChart({
    entidadesPorCategoria,
    entidadesPorMes,
    entidadesPorTipo,
}: MainChartProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <div className="h-[380px] animate-pulse bg-muted/10 rounded-xl" />
                </Card>
                <Card>
                    <div className="h-[380px] animate-pulse bg-muted/10 rounded-xl" />
                </Card>
                <Card>
                    <div className="h-[380px] animate-pulse bg-muted/10 rounded-xl" />
                </Card>
            </div>
        )
    }

    // Helper for generating SVG Area Paths
    const generateAreaPath = (data: EntidadPorMes[], key: 'pymes' | 'negocios' | 'profesionales', width: number, height: number) => {
        if (!data.length) return ''
        const max = Math.max(...data.map(d => Math.max(d.pymes, d.negocios, d.profesionales, 1)))
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width
            const y = height - (d[key] / max) * height
            return `${x},${y}`
        })

        // Finalize path to close the area
        return `M0,${height} L${points.join(' L')} L${width},${height} Z`
    }

    const maxMesValue = Math.max(...entidadesPorMes.map(d => Math.max(d.pymes, d.negocios, d.profesionales, 1)))
    const maxCatValue = Math.max(...entidadesPorCategoria.map(c => c.count), 1)
    const totalEntidades = entidadesPorTipo.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución Mensual - Custom SVG Area Chart */}
            <Card className="col-span-1 lg:col-span-2 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <div className="w-1 h-4 bg-accent rounded-full" />
                        Evolución Mensual
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full relative group">
                        {/* Grid Lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 border-t border-border/20"
                                style={{ top: `${p * 100}%` }}
                            >
                                <span className="absolute -left-2 -translate-x-full text-[10px] text-text-muted">
                                    {Math.round(maxMesValue * (1 - p))}
                                </span>
                            </div>
                        ))}

                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                            {/* Line & Area for PyMES */}
                            <path
                                d={generateAreaPath(entidadesPorMes, 'pymes', 1000, 300)}
                                fill="url(#gradPymes)"
                                className="opacity-40 transition-opacity hover:opacity-60"
                            />
                            <path
                                d={generateAreaPath(entidadesPorMes, 'pymes', 1000, 300).replace(/Z$/, '').replace(/^M0,300 L/, 'M')}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Line & Area for Negocios */}
                            <path
                                d={generateAreaPath(entidadesPorMes, 'negocios', 1000, 300)}
                                fill="url(#gradNegocios)"
                                className="opacity-40 transition-opacity hover:opacity-60"
                            />
                            <path
                                d={generateAreaPath(entidadesPorMes, 'negocios', 1000, 300).replace(/Z$/, '').replace(/^M0,300 L/, 'M')}
                                fill="none"
                                stroke="#22C55E"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            <defs>
                                <linearGradient id="gradPymes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="gradNegocios" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* X Axis Labels */}
                        <div className="absolute inset-x-0 -bottom-6 flex justify-between">
                            {entidadesPorMes.map((d, i) => (
                                <span key={i} className="text-[10px] text-text-muted font-medium">
                                    {d.mes}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-6 justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                            <span className="text-xs text-text-secondary">PyMES</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                            <span className="text-xs text-text-secondary">Negocios</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categorías - Custom Vertical Bar Chart */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Top Categorías</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {entidadesPorCategoria.slice(0, 6).map((cat, i) => (
                        <div key={i} className="space-y-1.5 group">
                            <div className="flex justify-between text-xs">
                                <span className="text-text-primary font-medium">{cat.categoria_nombre}</span>
                                <span className="text-text-muted font-bold">{cat.count}</span>
                            </div>
                            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125"
                                    style={{
                                        width: `${(cat.count / maxCatValue) * 100}%`,
                                        backgroundColor: cat.categoria_color || '#3B82F6',
                                        boxShadow: `0 0 10px ${cat.categoria_color}44`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {!entidadesPorCategoria.length && (
                        <div className="py-12 text-center text-text-muted text-sm italic">
                            Sin datos por categoría
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Distribución por Tipo - Custom Donut/Legend */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Distribución por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="relative w-48 h-48 mb-8">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                {entidadesPorTipo.map((item, i) => {
                                    const percentage = (item.value / (totalEntidades || 1)) * 100
                                    const offset = entidadesPorTipo
                                        .slice(0, i)
                                        .reduce((acc, curr) => acc + (curr.value / (totalEntidades || 1)) * 100, 0)

                                    return (
                                        <circle
                                            key={i}
                                            cx="18"
                                            cy="18"
                                            r="15.915"
                                            fill="transparent"
                                            stroke={item.color}
                                            strokeWidth="2.5"
                                            strokeDasharray={`${percentage} ${100 - percentage}`}
                                            strokeDashoffset={-offset}
                                            className="transition-all duration-1000 ease-in-out hover:strokeWidth-3"
                                        />
                                    )
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-text-primary">{totalEntidades}</span>
                                <span className="text-[10px] uppercase tracking-wider text-text-muted">Total</span>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            {entidadesPorTipo.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background/40">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-text-muted uppercase font-bold">{item.name}</span>
                                        <span className="text-sm font-bold text-text-primary">
                                            {totalEntidades > 0 ? Math.round((item.value / totalEntidades) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}