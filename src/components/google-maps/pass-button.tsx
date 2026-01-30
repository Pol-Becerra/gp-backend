'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRightLeft, Loader2, Check } from 'lucide-react'
import { passToEntidades } from '@/app/actions/google-maps'
import { useRouter } from 'next/navigation'

interface PassToEntidadesButtonProps {
    id: string
    isPassed: boolean
}

export function PassToEntidadesButton({ id, isPassed }: PassToEntidadesButtonProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(isPassed)
    const router = useRouter()

    const handlePass = async () => {
        if (success) return

        setLoading(true)
        try {
            const result = await passToEntidades(id)
            if (result.success) {
                setSuccess(true)
                router.refresh()
            } else {
                alert(result.error || 'Error al pasar los datos')
            }
        } catch (error) {
            alert('Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={success ? "outline" : "secondary"}
            size="sm"
            onClick={handlePass}
            disabled={loading || success}
            className={success ? "text-success border-success/30 bg-success/5" : "hover:bg-accent hover:text-background"}
            title={success ? "Ya pasado a Entidades" : "Pasar a Entidades"}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
                <Check className="h-4 w-4" />
            ) : (
                <ArrowRightLeft className="h-4 w-4" />
            )}
        </Button>
    )
}
