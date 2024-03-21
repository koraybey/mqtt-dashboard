import '@/theme/index.css'
import '@/theme/app.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@/theme/theme_provider'

import { Dashboard } from './pages/Dashboard'

const App = () => {
    return (
        <ThemeProvider defaultTheme={'dark'} storageKey={'vite-ui-theme'}>
            <Dashboard />
        </ThemeProvider>
    )
}

ReactDOM.createRoot(document.querySelector('#root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
