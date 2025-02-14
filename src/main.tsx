import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './contexts/UserContext'
import { worker } from './mocks/browser'

// Aquí podrías condicionar el uso de MSW según una variable de entorno
// Por ejemplo, solo usar MSW si REACT_APP_USE_MSW está configurado en "true"
if (process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MSW === 'true') {
  worker.start()
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserProvider>
  </StrictMode>
)
