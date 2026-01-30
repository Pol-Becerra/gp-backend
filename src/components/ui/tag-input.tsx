'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X, Plus, Tag as TagIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
    value: string[]
    onChange: (value: string[]) => void
    presets?: string[]
    placeholder?: string
}

const DEFAULT_PRESETS = [
    'revisado',
    'ya no existe',
    'contactado',
    'rechazado',
    'pendiente',
    'potencial cliente',
    'VIP'
]

export function TagInput({
    value = [],
    onChange,
    presets = DEFAULT_PRESETS,
    placeholder = "Nueva etiqueta..."
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('')

    const addTag = (tag: string) => {
        const normalizedTag = tag.trim().toLowerCase()
        if (normalizedTag && !value.includes(normalizedTag)) {
            onChange([...value, normalizedTag])
        }
        setInputValue('')
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag(inputValue)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="pl-2 pr-1 py-1 flex items-center gap-1 bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 transition-colors"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="p-0.5 hover:bg-accent/20 rounded-full transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                {value.length === 0 && (
                    <span className="text-xs text-text-muted italic">Sin etiquetas</span>
                )}
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="pl-9"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => addTag(inputValue)}
                    className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                    title="Agregar etiqueta"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Recomendadas</span>
                <div className="flex flex-wrap gap-1.5">
                    {presets.filter(p => !value.includes(p)).map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => addTag(preset)}
                            className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-card/50 text-text-secondary hover:border-accent/40 hover:text-accent transition-all"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
