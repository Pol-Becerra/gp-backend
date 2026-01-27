'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createCategoria, updateCategoria, deleteCategoria } from '@/app/actions/categorias'
import type { Categoria } from '@/lib/types'
import {
    Plus,
    Pencil,
    Trash2,
    ChevronRight,
    ChevronDown,
    Folder,
    Loader2,
} from 'lucide-react'

interface CategoryTreeProps {
    categorias: Categoria[]
    onRefresh: () => void
}

const colorOptions = [
    '#39FF14', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1',
]

function CategoryItem({
    categoria,
    categorias,
    level,
    onRefresh,
}: {
    categoria: Categoria & { subcategorias?: Categoria[] }
    categorias: Categoria[]
    level: number
    onRefresh: () => void
}) {
    const [expanded, setExpanded] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState(categoria.nombre)
    const [color, setColor] = useState(categoria.color)
    const [descripcion, setDescripcion] = useState(categoria.descripcion || '')

    const hasChildren = categoria.subcategorias && categoria.subcategorias.length > 0

    const handleUpdate = async () => {
        setLoading(true)
        await updateCategoria(categoria.id, {
            nombre,
            descripcion,
            icono: 'folder',
            color,
            parent_id: categoria.parent_id || undefined,
            orden: categoria.orden,
        })
        setEditOpen(false)
        setLoading(false)
        onRefresh()
    }

    const handleDelete = async () => {
        setLoading(true)
        await deleteCategoria(categoria.id, categoria.nombre)
        setDeleteOpen(false)
        setLoading(false)
        onRefresh()
    }

    return (
        <div>
            <div
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-card-hover group transition-colors"
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 hover:bg-background-secondary rounded"
                    style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
                >
                    {expanded ? (
                        <ChevronDown className="h-4 w-4 text-text-muted" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                    )}
                </button>

                <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: categoria.color }}
                />

                <span className="flex-1 font-medium">{categoria.nombre}</span>

                {categoria.descripcion && (
                    <span className="text-text-muted text-sm hidden sm:block">
                        {categoria.descripcion}
                    </span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Edit Dialog */}
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Categoría</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descripción</Label>
                                    <Input
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {colorOptions.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'
                                                    }`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setEditOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleUpdate} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:text-error">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>¿Eliminar categoría?</DialogTitle>
                            </DialogHeader>
                            <p className="text-text-secondary">
                                Se eliminará <strong>{categoria.nombre}</strong> y todas sus subcategorías.
                                Esta acción no se puede deshacer.
                            </p>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Eliminar'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Children */}
            {hasChildren && expanded && (
                <div>
                    {categoria.subcategorias!.map((sub: any) => (
                        <CategoryItem
                            key={sub.id}
                            categoria={sub}
                            categorias={categorias}
                            level={level + 1}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function CategoryTree({ categorias, onRefresh }: CategoryTreeProps) {
    const [createOpen, setCreateOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [color, setColor] = useState('#39FF14')
    const [parentId, setParentId] = useState<string>('')
    const [descripcion, setDescripcion] = useState('')

    // Search state
    const [searchTerm, setSearchTerm] = useState('')

    // Filter logic
    const filterCategories = (cats: Categoria[], term: string): Categoria[] => {
        if (!term) return cats

        return cats.map(cat => {
            // Check if current category matches
            const matches = cat.nombre.toLowerCase().includes(term.toLowerCase())

            // Check children
            const filteredChildren = cat.subcategorias
                ? filterCategories(cat.subcategorias, term)
                : []

            // Return category if it matches or has matching children
            if (matches || filteredChildren.length > 0) {
                return {
                    ...cat,
                    subcategorias: filteredChildren.length > 0 ? filteredChildren : cat.subcategorias,
                    // If we are filtering, we probably want to expand everything to show matches, 
                    // but CategoryItem controls expansion locally. 
                    // Ideally we'd pass an 'forceExpand' prop to CategoryItem.
                }
            }

            return null
        }).filter(Boolean) as Categoria[]
    }

    const filteredCategorias = filterCategories(categorias, searchTerm)

    // Flat list for parent selection (use original full list)
    const flatCategorias: Categoria[] = []
    const flatten = (cats: Categoria[], level: number = 0) => {
        cats.forEach((c: any) => {
            flatCategorias.push({ ...c, nombre: '  '.repeat(level) + c.nombre })
            if (c.subcategorias) flatten(c.subcategorias, level + 1)
        })
    }
    flatten(categorias)

    const handleCreate = async () => {
        if (!nombre.trim()) return
        setLoading(true)
        await createCategoria({
            nombre: nombre.trim(),
            descripcion: descripcion.trim() || undefined,
            icono: 'folder',
            color,
            parent_id: parentId || undefined,
            orden: 0,
        })
        setCreateOpen(false)
        setLoading(false)
        setNombre('')
        setDescripcion('')
        setParentId('')
        onRefresh()
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between mb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-accent" />
                        Estructura de Categorías
                    </CardTitle>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Categoría
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nueva Categoría</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nombre *</Label>
                                    <Input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Nombre de la categoría"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descripción</Label>
                                    <Input
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Descripción opcional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoría Padre</Label>
                                    <Select value={parentId || 'none'} onValueChange={(v) => setParentId(v === 'none' ? '' : v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguna (categoría raíz)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Ninguna (categoría raíz)</SelectItem>
                                            {flatCategorias.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {colorOptions.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'
                                                    }`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setCreateOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreate} disabled={loading || !nombre.trim()}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Input */}
                <Input
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </CardHeader>
            <CardContent>
                {categorias.length === 0 ? (
                    <div className="text-center py-8 text-text-muted">
                        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No hay categorías creadas</p>
                        <p className="text-sm">Crea tu primera categoría para comenzar</p>
                    </div>
                ) : filteredCategorias.length === 0 ? (
                    <div className="text-center py-8 text-text-muted">
                        <p>No se encontraron categorías que coincidan con &quot;{searchTerm}&quot;</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredCategorias.map((cat: any) => (
                            <CategoryItem
                                key={cat.id}
                                categoria={cat}
                                categorias={categorias}
                                level={0}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
