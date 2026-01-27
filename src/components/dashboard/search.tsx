'use client'

import { Input } from '@/components/ui/input'
import { Search as SearchIcon, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface SearchProps {
    placeholder?: string
    className?: string
}

export function Search({ placeholder = 'Buscar...', className }: SearchProps) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className={`relative flex flex-1 flex-shrink-0 ${className}`}>
            <label htmlFor="search" className="sr-only">
                Buscar
            </label>
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
                className="pl-10 pr-10"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('search')?.toString()}
            />
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    )
}
