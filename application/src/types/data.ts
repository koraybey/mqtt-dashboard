export type ChartData = {
    date: string
    value: number
}

export type ChartStackData = {
    date: string
}

export interface Aggregates {
    date: string
    mean: number
    median: number
    mode: number
    min: number
    max: number
}
