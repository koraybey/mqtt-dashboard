import { format, fromUnixTime, parseISO } from 'date-fns'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'

import type { LogMessage } from '@/generated/gql/graphql'
import type { ChartData } from '@/types/data'

export const getChartDate = (d: { date: string }) => d.date
export const dissocDate = R.pipe(R.dissoc('date'), R.values)
export const renameTimeToDate = R.map<{ time: string }, { date: string }>(
    RA.renameKey('time', 'date')
)

export const calculateSums = R.map((object: ChartData) => ({
    date: object.date,
    value: R.sum(dissocDate(object)),
}))

export const filterByDeviceId = (data: LogMessage[], deviceId: string) =>
    R.pipe(R.filter((obj: LogMessage) => obj.friendlyName === deviceId))(data)

export const groupDeviceValuesByHour = R.pipe(
    R.groupBy(({ date }: { date: string }) =>
        format(parseISO(date), 'yyyy-MM-dd-HH')
    )
)

export const isoToHumanReadable = (date: string): string => {
    return format(parseISO(date), 'HH:mm:ss')
}

export const unixTimeToHumanReadable = (date: number): string => {
    return format(fromUnixTime(date), 'HH:mm:ss')
}
