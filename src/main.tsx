import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import { ViewProvider } from './contexts/ViewContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewProvider>
      <App />
    </ViewProvider>
  </StrictMode>,
)
