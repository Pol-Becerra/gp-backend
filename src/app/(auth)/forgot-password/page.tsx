'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await resetPassword(email)

            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError('Error al enviar el enlace de recuperación. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                        <span className="text-background font-bold text-2xl">GP</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Guía PyMES</h1>
                    <p className="text-text-secondary mt-1">Gestión de Empresas y Negocios</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recuperar Contraseña</CardTitle>
                        <CardDescription>
                            Ingresa tu correo electrónico para recibir un enlace de recuperación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-6 w-6 text-success" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-medium text-text-primary">¡Enlace enviado!</h3>
                                    <p className="text-text-secondary text-sm">
                                        Hemos enviado instrucciones de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada.
                                    </p>
                                </div>
                                <Link href="/login" className="block">
                                    <Button variant="outline" className="w-full">
                                        Volver al inicio de sesión
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {error && (
                                    <div className="bg-error/10 border border-error/50 text-error rounded-lg p-3 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar enlace de recuperación'
                                    )}
                                </Button>

                                <Link href="/login" className="flex items-center justify-center gap-2 text-text-secondary hover:text-accent text-sm transition-colors">
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al inicio de sesión
                                </Link>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
