import { readFileSync } from 'node:fs'

import cors from 'cors'
import express from 'express'

//! TODO This should not be in production. Replace when GraphQL backend is available.
const logUrl = new URL('static/log_data.json', import.meta.url)
const logData = JSON.parse(readFileSync(logUrl, 'utf8')).slice(0, 900)
const deviceUrl = new URL('devices.json', import.meta.url)
const deviceData = JSON.parse(readFileSync(deviceUrl, 'utf8'))

const app = express()

app.use(cors())

app.get('/log', (_, response) => {
    response.json(logData.slice(0, 600))
})

app.get('/devices', (_, response) => {
    response.json(deviceData)
})

app.listen(3001, () => {
    console.log('App listening on port 3001')
})
