import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-accent-muted text-accent',
                secondary: 'bg-card text-text-secondary border border-border',
                success: 'bg-success-muted text-success',
                warning: 'bg-warning-muted text-warning',
                error: 'bg-error-muted text-error',
                info: 'bg-info-muted text-info',
                outline: 'border border-border text-text-secondary',
                pyme: 'bg-info-muted text-info',
                negocio: 'bg-success-muted text-success',
                profesional: 'bg-accent-muted text-accent',
                servicio: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
