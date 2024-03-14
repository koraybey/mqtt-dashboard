import type { SeriesPoint } from '@visx/shape/lib/types'

import type { ChartStackData } from './data'

export type SharedChartProperties = {
    width: number
    height: number
    events?: boolean
    margin?: { top: number; right: number; bottom: number; left: number }
}

export type TooltipData = {
    bar: SeriesPoint<ChartStackData>
    key: string
    index: number
    height: number
    width: number
    x: number
    y: number
    color: string
}
