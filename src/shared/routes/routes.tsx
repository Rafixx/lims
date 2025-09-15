import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { HomePage } from '@/features/dashboard/pages/HomePage'
// Importar nuevas páginas de WorkList
import {
  WorkListsPage,
  CreateWorklistPage,
  WorklistDetailPage,
  WorkListPage
} from '@/features/workList'
import { SolicitudesSimplePage } from '@/features/solicitudes/pages/SolicitudesSimplePage'
import { SolicitudFormPage } from '@/features/solicitudes/pages/SolicitudesFormPage'

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
      { path: 'solicitudes/nueva', element: <SolicitudFormPage /> },
      { path: 'solicitudes/:id/editar', element: <SolicitudFormPage /> },

      // Nuevas rutas de WorkList
      { path: 'worklist', element: <WorkListsPage /> },
      { path: 'worklist/nuevo', element: <CreateWorklistPage /> },
      { path: 'worklist/:id', element: <WorklistDetailPage /> },

      // Mantener ruta legacy para compatibilidad temporal
      { path: 'workList', element: <WorkListPage /> }
    ]
  }
])
