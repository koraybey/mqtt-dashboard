import '@/theme/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { Dashboard } from './pages/Dashboard'

const App = () => {
    return (
        <div className={'content'}>
            <Dashboard />
        </div>
    )
}

ReactDOM.createRoot(document.querySelector('#root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
