/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios'
import * as R from 'ramda'

export const fetcher = (query: string) =>
    axios({
        url: 'http://10.147.17.93:4000/graphql',
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        data: { query },
    })
        .then((res) => {
            return R.prop('data', res.data)
        })
        .catch((error) => {
            throw new TypeError(`Things exploded: ${error}`)
        })
