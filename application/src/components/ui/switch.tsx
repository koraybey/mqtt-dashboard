import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/components/utils'

export const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors  disabled:cursor-not-allowed disabled:opacity-50 bg-input focus-visible:outline-none',
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'pointer-events-none block h-5 w-5 rounded-full data-[state=unchecked]:opacity-25 bg-primary transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
            )}
        />
    </SwitchPrimitives.Root>
))
