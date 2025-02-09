import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ViewProvider } from './contexts/ViewContext.tsx'
import { ReservationProvider } from './contexts/ReservationContext.tsx'

import App from './components/App.tsx'

import './styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewProvider>
      <ReservationProvider>
        <App />
      </ReservationProvider>
    </ViewProvider>
  </StrictMode>,
)
