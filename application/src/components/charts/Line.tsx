import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridColumns, GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear, scaleTime } from '@visx/scale'
import { LinePath } from '@visx/shape'
import { extent, max, min } from '@visx/vendor/d3-array'
import { format } from '@visx/vendor/d3-format'
import { curveBasis } from '@vx/curve'
import * as R from 'ramda'

import {
    axisBottomTickLabel,
    axisLeftTickLabel,
    defaultChartMargin,
    gridColor,
    tickStroke,
} from '@/components/charts/styles'
import { colors } from '@/theme/colors'
import type { SharedChartProperties } from '@/types/components'
import type { Exposes } from '@/types/exposes'

import { createChartDate, filterByDeviceId, renameTimeToDate } from './helpers'

export const Line = ({ data: _data }: { data: Exposes[] }) => {
    //! TODO Replace hard-coded values and map deviceNames dynamically
    //! TODO Refactor redundant calculations and reuse funcs to process data. What is happening below is expensive. However necessary as the server API for the demo is pretty basic.
    const data = renameTimeToDate(_data)
    const plugAlarm = filterByDeviceId(_data, '0_Plug_Alarm')
    const plugCamera = filterByDeviceId(_data, '0_Plug_Camera')
    const measure = R.prop('voltage')
    const calcMaxDomain =
        ((max(plugCamera, measure) as unknown as number) || 0) + 1
    const calcMinDomain = (min(plugAlarm, measure) as unknown as number) || 0

    return (
        <ParentSize>
            {({
                width,
                height,
                margin = defaultChartMargin,
            }: SharedChartProperties) => {
                const innerWidth = width - margin.right - margin.left
                const innerHeight = height - margin.top - margin.bottom

                //! TODO Hoist and memoize
                const xScale = scaleTime({
                    range: [0, innerWidth],
                    domain: extent(data, createChartDate) as unknown as [
                        Date,
                        Date,
                    ],
                })

                //! TODO Hoist and memoize
                const yScale = scaleLinear({
                    range: [innerHeight, 0],
                    domain: [calcMinDomain, calcMaxDomain],
                    nice: true,
                })

                const getX = R.pipe(createChartDate, xScale) ?? 0
                const getY = R.pipe(measure, yScale) ?? 0

                return (
                    <svg width={width} height={height}>
                        <Group top={margin.top} left={margin.left}>
                            <GridRows
                                scale={yScale}
                                width={innerWidth}
                                strokeDasharray={'1'}
                                stroke={gridColor}
                                strokeOpacity={0.2}
                                pointerEvents={'none'}
                            />
                            <GridColumns
                                scale={xScale}
                                height={innerHeight}
                                strokeDasharray={'1,2'}
                                stroke={gridColor}
                                strokeOpacity={0.1}
                                pointerEvents={'none'}
                            />
                            {/* 
                            //! TODO Map
                            */}
                            <LinePath
                                curve={curveBasis}
                                data={plugAlarm}
                                x={getX}
                                y={getY}
                                strokeWidth={1}
                                stroke={colors.blue[1]}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={plugCamera}
                                x={getX}
                                y={getY}
                                strokeWidth={1}
                                stroke={colors.red[1]}
                            />
                        </Group>
                        <Group left={margin.left} top={margin.top}>
                            <AxisBottom
                                hideZero
                                numTicks={8}
                                top={innerHeight}
                                scale={xScale}
                                stroke={tickStroke}
                                tickStroke={tickStroke}
                                tickLabelProps={axisBottomTickLabel}
                            />
                            <AxisLeft
                                hideZero
                                numTicks={8}
                                tickFormat={format('.0f')}
                                scale={yScale}
                                stroke={tickStroke}
                                tickStroke={tickStroke}
                                tickLabelProps={axisLeftTickLabel}
                            />
                        </Group>
                    </svg>
                )
            }}
        </ParentSize>
    )
}