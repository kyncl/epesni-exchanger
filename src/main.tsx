import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App'

export const currencyApi = import.meta.env.VITE_CURRENCY_EXCHANGE_API;
export const defaultCurrency = "EUR";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
