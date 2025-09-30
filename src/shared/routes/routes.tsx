import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { HomePage } from '@/features/dashboard/pages/HomePage'
import { WorkListsPage } from '@/features/workList/pages/WorkListsPage'
// import { SolicitudesSimplePage } from '@/features/_old/solicitudes/pages/SolicitudesSimplePage'
// import { SolicitudFormPage } from '@/features/_old/solicitudes/pages/SolicitudesFormPage'
import { MuestrasPage } from '@/features/muestras/pages/MuestrasPage'
import { PruebasPage } from '@/features/dim_tables/pruebas/pages/PruebasPage'
import { CentrosPage } from '@/features/dim_tables/centros/pages/CentrosPage'
import { TiposMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/TiposMuestraPage'
import { PacientesPage } from '@/features/dim_tables/pacientes/pages/PacientesPage'
import { ClientesPage } from '@/features/dim_tables/clientes/pages/ClientesPage'
import { CriteriosValidacionPage } from '@/features/dim_tables/criterios_validacion/pages/CriteriosValidacionPage'
import { UbicacionesPage } from '@/features/dim_tables/ubicaciones/pages/UbicacionesPage'
import { MaquinasPage } from '@/features/dim_tables/maquinas/pages/MaquinasPage'
import { PipetasPage } from '@/features/dim_tables/pipetas/pages/PipetasPage'
import { ReactivosPage } from '@/features/dim_tables/reactivos/pages/ReactivosPage'
import { MaestrosPage } from '@/features/dashboard/pages/MaestrosPage'
import { WorklistDetailPage } from '@/features/workList/pages/WorklistDetailPage'
import { CreateWorklistPage } from '@/features/workList/pages/CreateWorklistPage'
import { CreateMuestraPage } from '@/features/muestras/pages/CreateMuestraPage'

export const router = createBrowserRouter(
  [
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

        // { path: 'solicitudes', element: <SolicitudesSimplePage /> },
        // { path: 'solicitudes/nueva', element: <SolicitudFormPage /> },
        // { path: 'solicitudes/:id/editar', element: <SolicitudFormPage /> },

        { path: 'worklist', element: <WorkListsPage /> },
        { path: 'worklist/nuevo', element: <CreateWorklistPage /> },
        { path: 'worklist/:id', element: <WorklistDetailPage /> },
        { path: 'worklist/:id/editar', element: <WorklistDetailPage /> },

        { path: 'muestras', element: <MuestrasPage /> },
        { path: 'muestras/nueva', element: <CreateMuestraPage /> },
        { path: 'muestras/:id/editar', element: <CreateMuestraPage /> },

        { path: 'maestros', element: <MaestrosPage /> },
        { path: 'pruebas', element: <PruebasPage /> },
        { path: 'centros', element: <CentrosPage /> },
        { path: 'pacientes', element: <PacientesPage /> },
        { path: 'clientes', element: <ClientesPage /> },
        { path: 'criterios-validacion', element: <CriteriosValidacionPage /> },
        { path: 'ubicaciones', element: <UbicacionesPage /> },
        { path: 'maquinas', element: <MaquinasPage /> },
        { path: 'pipetas', element: <PipetasPage /> },
        { path: 'reactivos', element: <ReactivosPage /> },
        { path: 'tipos-muestra', element: <TiposMuestraPage /> }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)
