import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './shared/contexts/UserContext'
import { MenuProvider } from './shared/contexts/MenuContext'

import { worker } from './mocks/browser'
import { Layout } from './shared/layouts/Layout'
import { BrowserRouter } from 'react-router-dom'
import { FilterProvider } from './shared/hooks/useFilter'

// Aquí podrías condicionar el uso de MSW según una variable de entorno
if (process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MSW === 'true') {
  worker.start()
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 // 1 minuto
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <MenuProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <FilterProvider>
              <Layout>
                <App />
              </Layout>
            </FilterProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </MenuProvider>
    </UserProvider>
  </StrictMode>
)
