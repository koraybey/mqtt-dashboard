import axios from 'axios'
import * as R from 'ramda'

const graphqlURL = import.meta.env.VITE_GRAPHQL_URL

export const fetcher = async (query: string) => {
    if (!graphqlURL) {
        throw new Error('GRAPHQL_URL must be set')
    }
    try {
        const response = await axios({
            url: graphqlURL,
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            data: { query },
        })
        return R.prop('data', response.data) as never
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error('An unknown error occurred')
    }
}
