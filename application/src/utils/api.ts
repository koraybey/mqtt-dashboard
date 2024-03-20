import axios from 'axios'
import { GraphQLClient } from 'graphql-request'

import type { Devices, Exposes, LogMessage } from '@/types/exposes'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3001',
    timeout: 40_000,
})

export const client = new GraphQLClient('http://127.0.0.1:4000/graphql')

export const logFetcher = (query: string) => {
    return client.request(query).then((data) => {
        if (!data) {
            throw new Error('Cannot logs from the endpoint')
        }
        return data as { logs: LogMessage[] }
    })
}

export const deviceLogFetcher = (url: string) => {
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
