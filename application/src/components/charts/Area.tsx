import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridColumns, GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed } from '@visx/shape'
import { extent, max, min } from '@visx/vendor/d3-array'
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

export const Area = ({ data: _data }: { data: Exposes[] }) => {
    //! TODO Replace hard-coded values and map deviceNames dynamically
    //! TODO Refactor redundant calculations and reuse funcs to process data. What is happening below is expensive. However necessary as the server API for the demo is pretty basic.
    const data = renameTimeToDate(_data)
    const motion = filterByDeviceId(_data, '0_Motion')
    const plugAlarm = filterByDeviceId(_data, '0_Plug_Alarm')
    const plugCamera = filterByDeviceId(_data, '0_Plug_Camera')
    const measure = R.prop('linkquality')
    const calcMaxDomain =
        ((max(_data, measure) as unknown as number) || 0) * 1.2
    const calcMinDomain = (min(_data, measure) as unknown as number) || 0

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
                            <AreaClosed
                                data={plugAlarm}
                                x={getX}
                                y={getY}
                                yScale={yScale}
                                strokeWidth={1}
                                fill={colors.blue[0]}
                                stroke={colors.blue[1]}
                                curve={curveBasis}
                            />
                            <AreaClosed
                                data={motion}
                                x={getX}
                                y={getY}
                                yScale={yScale}
                                strokeWidth={1}
                                fill={colors.green[0]}
                                stroke={colors.green[1]}
                                curve={curveBasis}
                            />
                            <AreaClosed
                                data={plugCamera}
                                x={getX}
                                y={getY}
                                yScale={yScale}
                                strokeWidth={1}
                                fill={colors.red[0]}
                                stroke={colors.red[1]}
                            />
                        </Group>
                        <Group left={margin.left} top={margin.top}>
                            <AxisBottom
                                hideZero
                                numTicks={6}
                                top={innerHeight}
                                scale={xScale}
                                stroke={tickStroke}
                                tickStroke={tickStroke}
                                tickLabelProps={axisBottomTickLabel}
                            />
                            <AxisLeft
                                hideZero
                                numTicks={4}
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
