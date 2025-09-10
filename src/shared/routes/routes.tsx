import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { HomePage } from '@/features/dashboard/pages/HomePage'
// import { SolicitudesPage } from '@/features/solicitudes/pages/SolicitudesPage'
import { WorkListPage } from '@/features/workList/pages/WorkListPage'
import { SolicitudesSimplePage } from '@/features/solicitudes/pages/SolicitudesSimplePage'

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
    children: [
      { path: 'dashboard', element: <HomePage /> },
      { path: 'solicitudes', element: <SolicitudesSimplePage /> },
      { path: 'workList', element: <WorkListPage /> }
    ]
  }
])
