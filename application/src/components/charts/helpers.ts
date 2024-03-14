import { format, parseISO } from 'date-fns'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'

import type { ChartData } from '@/types/data'
import type { Exposes } from '@/types/exposes'

export const createChartDate = (d: { date: string }) => new Date(d.date)
export const getChartDate = (d: { date: string }) => d.date
export const dissocDate = R.pipe(R.dissoc('date'), R.values)
export const renameTimeToDate = R.map<{ time: string }, { date: string }>(
    RA.renameKey('time', 'date')
)

export const calculateSums = R.map((object: ChartData) => ({
    date: object.date,
    value: R.sum(dissocDate(object)),
}))

export const filterByDeviceId = (data: Exposes[], deviceId: string) =>
    R.pipe(
        R.filter((obj: Exposes) => obj.identifier === deviceId),
        R.map(RA.renameKey('time', 'date'))
    )(data)

export const groupDeviceValuesByHour = R.pipe(
    R.groupBy(({ date }: { date: string }) =>
        format(parseISO(date), 'yyyy-MM-dd-HH')
    )
)
