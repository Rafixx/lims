import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { HomePage } from '../../features/dashboard/pages/HomePage'
import { RegisterPage } from '../../pages/RegisterPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [{ path: 'dashboard', element: <HomePage /> }]
  }
])
