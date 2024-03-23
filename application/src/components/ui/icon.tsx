import type { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense } from 'react'

export interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports
}

export const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = lazy(dynamicIconImports[name])

    return (
        <Suspense>
            <LucideIcon {...props} />
        </Suspense>
    )
}
