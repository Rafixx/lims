import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './shared/routes/routes'
import { UserProvider } from './shared/contexts/UserContext'
import { NotificationProvider } from './shared/components/Notification/NotificationContext'
import { ConfirmationProvider } from './shared/components/Confirmation/ConfirmationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './index.css'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <ConfirmationProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </UserProvider>
      </ConfirmationProvider>
    </NotificationProvider>
  </React.StrictMode>
)
