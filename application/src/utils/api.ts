import { GraphQLClient } from 'graphql-request'

import type { DeviceInfo, LogMessage } from '@/generated/gql/graphql'
export const client = new GraphQLClient('http://127.0.0.1:4000/graphql')

export const logFetcher = (query: string) => {
    return client.request(query).then((data) => {
        if (!data) {
            throw new Error('Cannot logs from the endpoint')
        }
        return data as { logs: LogMessage[] }
    })
}

export const deviceFetcher = (query: string) => {
    return client.request(query).then((data) => {
        if (!data) {
            throw new Error('Cannot logs from the endpoint')
        }
        return data as { devices: DeviceInfo[] }
    })
}
