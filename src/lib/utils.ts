import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatDateTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(amount)
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function getTipoEntidadLabel(tipo: string): string {
    switch (tipo) {
        case 'NEGOCIO':
            return 'Comercio'
        case 'PYME':
            return 'PyME'
        case 'PROFESIONAL':
            return 'Profesional'
        case 'SERVICIO':
            return 'Servicio'
        default:
            return tipo
    }
}
