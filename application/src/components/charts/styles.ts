import type { TickLabelProps } from '@visx/axis'
import type { StringLike } from '@visx/scale'
import { defaultStyles } from '@visx/tooltip'
import type { NumberValue } from '@visx/vendor/d3-scale'

import { colors } from '@/theme/colors'

export const gridColor = colors.shade[3]
export const tickStroke = colors.shade[9]
const tickLabelColor = colors.shade[3]

export const defaultChartMargin = { top: 24, right: 0, bottom: 24, left: 48 }

export const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
}

export const axisBottomTickLabel: TickLabelProps<
    NumberValue | StringLike | undefined
> = {
    fill: tickLabelColor,
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAnchor: 'middle',
}

export const axisLeftTickLabel: TickLabelProps<
    NumberValue | StringLike | undefined
> = {
    fill: tickLabelColor,
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAnchor: 'end',
}
