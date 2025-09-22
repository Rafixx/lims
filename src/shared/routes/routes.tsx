import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { HomePage } from '@/features/dashboard/pages/HomePage'
import { WorkListsPage, CreateWorklistPage, WorklistDetailPage } from '@/features/_old/workList'
import { SolicitudesSimplePage } from '@/features/_old/solicitudes/pages/SolicitudesSimplePage'
import { SolicitudFormPage } from '@/features/_old/solicitudes/pages/SolicitudesFormPage'
import { MuestrasPage } from '@/features/muestras/pages/MuestrasPage'
import { PruebasPage } from '@/features/dim_tables/pruebas/pages/PruebasPage'

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

      { path: 'worklist', element: <WorkListsPage /> },
      { path: 'worklist/nuevo', element: <CreateWorklistPage /> },
      { path: 'worklist/:id', element: <WorklistDetailPage /> },

      { path: 'muestras', element: <MuestrasPage /> },
      { path: 'pruebas', element: <PruebasPage /> }
    ]
  }
])
