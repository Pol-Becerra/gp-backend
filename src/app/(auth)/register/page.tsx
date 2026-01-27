'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError('Error al crear la cuenta')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-text-primary mb-2">
                            ¡Registro Exitoso!
                        </h2>
                        <p className="text-text-secondary mb-6">
                            Hemos enviado un enlace de confirmación a tu correo electrónico.
                            Por favor, verifica tu cuenta para continuar.
                        </p>
                        <Link href="/login">
                            <Button className="w-full">Ir a Iniciar Sesión</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
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
                    <p className="text-text-secondary mt-1">Crea tu cuenta</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registro</CardTitle>
                        <CardDescription>
                            Completa el formulario para crear tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            {error && (
                                <div className="bg-error/10 border border-error/50 text-error rounded-lg p-3 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Juan Pérez"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </Button>

                            <p className="text-center text-text-secondary text-sm">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" className="text-accent hover:underline">
                                    Inicia Sesión
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
