import express from 'express'
import ViteExpress from 'vite-express'

const app = express()
ViteExpress.config({ mode: 'production' })

// eslint-disable-next-line no-console
ViteExpress.listen(app, 80, () => console.log('Server is listening...'))
