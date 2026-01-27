import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Guía PyMES - Gestión de Empresas y Negocios',
    description: 'Plataforma de gestión de PYMES, Negocios y Profesionales. Administra contactos, categorías y más.',
    keywords: ['pymes', 'negocios', 'profesionales', 'gestión', 'crm', 'argentina'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className="dark">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
