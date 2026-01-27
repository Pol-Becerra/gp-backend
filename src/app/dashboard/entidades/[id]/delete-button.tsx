'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { deleteEntidad } from '@/app/actions/entidades'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteEntidadButtonProps {
    id: string
    nombre: string
}

export function DeleteEntidadButton({ id, nombre }: DeleteEntidadButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteEntidad(id, nombre)
            if (result.success) {
                router.push('/dashboard/entidades')
                router.refresh()
            }
        } catch (error) {
            console.error('Error deleting:', error)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar entidad?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará permanentemente a <strong>{nombre}</strong> y
                        todos sus contactos asociados. Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
