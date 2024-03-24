import type { TickLabelProps } from '@visx/axis'
import type { StringLike } from '@visx/scale'
import type { NumberValue } from '@visx/vendor/d3-scale'

import { colors } from '@/theme/colors'

export const gridColor = colors.shade[3]
export const tickStroke = colors.shade[9]
const tickLabelColor = colors.shade[4]

export const defaultChartMargin = { top: 0, right: 0, bottom: 36, left: 24 }

export const axisBottomTickLabel: TickLabelProps<
    NumberValue | StringLike | undefined
> = {
    fill: tickLabelColor,
    fontSize: 13,
    fontFamily: 'Space Grotesk',
    textAnchor: 'middle',
}

export const axisLeftTickLabel: TickLabelProps<
    NumberValue | StringLike | undefined
> = {
    fill: tickLabelColor,
    fontFamily: 'Space Grotesk',
    fontSize: 13,
    textAnchor: 'middle',
}
