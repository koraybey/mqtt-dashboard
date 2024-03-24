import type { ComponentProps } from 'react'
import React from 'react'

import { cn } from '../utils'

export const Card: React.FC<ComponentProps<'div'>> = ({
    className,
    children,
    ...props
}) => (
    <div
        className={cn(
            'relative flex flex-col gap-4 overflow-hidden rounded-lg border',
            className
        )}
        {...props}
    >
        {children}
    </div>
)

export const CardHeader: React.FC<ComponentProps<'div'>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('flex flex-auto flex-col gap-2', className)} {...props}>
        {children}
    </div>
)
