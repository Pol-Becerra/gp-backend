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
import { deleteContacto } from '@/app/actions/contactos'

interface DeleteContactButtonProps {
    contactoId: string
    nombre: string
    entidadId: string
}

export function DeleteContactButton({
    contactoId,
    nombre,
    entidadId,
}: DeleteContactButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteContacto(contactoId, nombre, entidadId)
            if (result.error) {
                alert(result.error)
            } else {
                setOpen(false)
            }
        } catch (error) {
            alert('Error al eliminar el contacto')
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
                    <DialogTitle>¿Eliminar contacto?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará a <strong>{nombre}</strong> de forma permanente.
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
                            'Eliminar Contacto'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
