import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
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
} from '@/components/charts/styles'
import type { LogMessage } from '@/generated/gql/graphql'
import { colors } from '@/theme/colors'
import type { SharedChartProperties } from '@/types/components'

import { filterByDeviceId } from './helpers'

export const Line = ({ data }: { data: LogMessage[] }) => {
    const measure = R.prop('linkquality')

    const calcMaxDomain = (max(data, measure) as unknown as number) || 0
    const calcMinDomain = (min(data, measure) as unknown as number) || 0

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
                    domain: extent(
                        data,
                        (d: { timestamp: string }) => new Date(d.timestamp)
                    ) as unknown as [Date, Date],
                })

                //! TODO Hoist and memoize
                const yScale = scaleLinear({
                    range: [innerHeight, 0],
                    domain: [calcMinDomain, calcMaxDomain],
                    nice: true,
                })

                const getX =
                    R.pipe(
                        (d: { timestamp: string }) => new Date(d.timestamp),
                        xScale
                    ) ?? 0
                const getY = R.pipe(measure, yScale) ?? 0

                return (
                    <svg width={width} height={height}>
                        <Group top={margin.top} left={margin.left}>
                            <GridRows
                                scale={yScale}
                                width={innerWidth}
                                stroke={gridColor}
                                strokeOpacity={0.1}
                                pointerEvents={'none'}
                            />

                            <AxisLeft
                                scale={yScale}
                                hideZero
                                hideTicks
                                numTicks={6}
                                hideAxisLine
                                tickLabelProps={axisLeftTickLabel}
                                tickFormat={format('.5~g')}
                            />
                        </Group>
                        <Group
                            top={margin.top}
                            left={margin.left + margin.left / 4}
                        >
                            <AxisBottom
                                top={innerHeight}
                                scale={xScale}
                                hideZero
                                numTicks={6}
                                tickLabelProps={axisBottomTickLabel}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={filterByDeviceId(
                                    data,
                                    'zigbee2mqtt/0_motion_salotto'
                                )}
                                x={getX}
                                y={getY}
                                strokeWidth={1.5}
                                stroke={colors.purple[1]}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={filterByDeviceId(
                                    data,
                                    'zigbee2mqtt/0_light_studio'
                                )}
                                x={getX}
                                y={getY}
                                strokeWidth={1.5}
                                stroke={colors.green[1]}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={filterByDeviceId(
                                    data,
                                    'zigbee2mqtt/0_plug_studio'
                                )}
                                x={getX}
                                y={getY}
                                strokeWidth={1.5}
                                stroke={colors.blue[1]}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={filterByDeviceId(
                                    data,
                                    'zigbee2mqtt/0_plug_camera'
                                )}
                                x={getX}
                                y={getY}
                                strokeWidth={1.5}
                                stroke={colors.red[1]}
                            />
                            <LinePath
                                curve={curveBasis}
                                data={filterByDeviceId(
                                    data,
                                    'zigbee2mqtt/0_plug_alarm"'
                                )}
                                x={getX}
                                y={getY}
                                strokeWidth={1.5}
                                stroke={colors.red[1]}
                            />
                        </Group>
                    </svg>
                )
            }}
        </ParentSize>
    )
}
