import axios from 'axios'

import type { Devices, Exposes } from '@/types/exposes'

const instance = axios.create({
    baseURL: 'http://dashboard.perseus.digital:3001',
    timeout: 40_000,
})

export const logFetcher = (url: string) => {
    return instance.get(url).then(({ data }) => {
        if (!data) {
            throw new Error('Cannot logs from the endpoint')
        }
        return data as Exposes[]
    })
}

export const deviceFetcher = (url: string) => {
    return instance.get(url).then(({ data }) => {
        if (!data) {
            throw new Error('Cannot fetch devices from the endpoint')
        }
        return data as Devices
    })
}

export default instance
