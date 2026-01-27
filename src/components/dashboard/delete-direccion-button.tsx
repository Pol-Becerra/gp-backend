'use client'

import { useState } from 'react'
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
import { Trash2, Loader2 } from 'lucide-react'
import { deleteDireccion } from '@/app/actions/direcciones'

interface DeleteDireccionButtonProps {
    entidadId: string
    direccionId: string
    direccionDetalle: string
}

export function DeleteDireccionButton({
    entidadId,
    direccionId,
    direccionDetalle,
}: DeleteDireccionButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteDireccion(entidadId, direccionId)
            if (result.error) {
                alert(result.error)
            } else {
                setOpen(false)
            }
        } catch (error) {
            alert('Error al eliminar la dirección')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-error hover:text-error hover:bg-error/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar dirección?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará la dirección: <strong>{direccionDetalle}</strong>.
                        <br />
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar Dirección'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
