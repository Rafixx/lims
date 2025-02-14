import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './contexts/UserContext'
import { worker } from './mocks/browser'
import { Layout } from './customComponents/organisms/Layout' // Importa el layout

// Aquí podrías condicionar el uso de MSW según una variable de entorno
if (process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MSW === 'true') {
  worker.start()
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <App />
        </Layout>
      </QueryClientProvider>
    </UserProvider>
  </StrictMode>
)
