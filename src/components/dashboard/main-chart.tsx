'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from 'recharts'

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

const COLORS = ['#3B82F6', '#22C55E', '#39FF14', '#F59E0B', '#A855F7', '#EF4444']

export function MainChart({
    entidadesPorCategoria,
    entidadesPorMes,
    entidadesPorTipo,
}: MainChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entidades por Mes - Area Chart */}
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Evolución Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={entidadesPorMes}>
                                <defs>
                                    <linearGradient id="colorPymes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNegocios" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfesionales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                <XAxis
                                    dataKey="mes"
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#9CA3AF' }}
                                />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#161B22',
                                        border: '1px solid #2D3748',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#FFFFFF' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pymes"
                                    name="PyMES"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorPymes)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="negocios"
                                    name="Negocios"
                                    stroke="#22C55E"
                                    fillOpacity={1}
                                    fill="url(#colorNegocios)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="profesionales"
                                    name="Profesionales"
                                    stroke="#39FF14"
                                    fillOpacity={1}
                                    fill="url(#colorProfesionales)"
                                />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Entidades por Categoría - Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={entidadesPorCategoria} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                <XAxis type="number" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <YAxis
                                    type="category"
                                    dataKey="categoria_nombre"
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#9CA3AF' }}
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#161B22',
                                        border: '1px solid #2D3748',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#FFFFFF' }}
                                />
                                <Bar dataKey="count" name="Entidades" radius={[0, 4, 4, 0]}>
                                    {entidadesPorCategoria.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.categoria_color || COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Distribución por Tipo - Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={entidadesPorTipo}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {entidadesPorTipo.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#161B22',
                                        border: '1px solid #2D3748',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
