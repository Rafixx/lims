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
import { CreatePruebaPage } from '@/features/dim_tables/pruebas/pages/CreatePruebaPage'
import { EditPruebaPage } from '@/features/dim_tables/pruebas/pages/EditPruebaPage'
import { CentrosPage } from '@/features/dim_tables/centros/pages/CentrosPage'
import { TiposMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/TiposMuestraPage'
import { CreateTipoMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/CreateTipoMuestraPage'
import { EditTipoMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/EditTipoMuestraPage'
import { PacientesPage } from '@/features/dim_tables/pacientes/pages/PacientesPage'
import { CreatePacientePage } from '@/features/dim_tables/pacientes/pages/CreatePacientePage'
import { EditPacientePage } from '@/features/dim_tables/pacientes/pages/EditPacientePage'
import { ClientesPage } from '@/features/dim_tables/clientes/pages/ClientesPage'
import { CreateClientePage } from '@/features/dim_tables/clientes/pages/CreateClientePage'
import { EditClientePage } from '@/features/dim_tables/clientes/pages/EditClientePage'
import { CriteriosValidacionPage } from '@/features/dim_tables/criterios_validacion/pages/CriteriosValidacionPage'
import { CreateCriterioValidacionPage } from '@/features/dim_tables/criterios_validacion/pages/CreateCriterioValidacionPage'
import { EditCriterioValidacionPage } from '@/features/dim_tables/criterios_validacion/pages/EditCriterioValidacionPage'
import { UbicacionesPage } from '@/features/dim_tables/ubicaciones/pages/UbicacionesPage'
import { CreateUbicacionPage } from '@/features/dim_tables/ubicaciones/pages/CreateUbicacionPage'
import { EditUbicacionPage } from '@/features/dim_tables/ubicaciones/pages/EditUbicacionPage'
import { MaquinasPage } from '@/features/dim_tables/maquinas/pages/MaquinasPage'
import { CreateMaquinaPage } from '@/features/dim_tables/maquinas/pages/CreateMaquinaPage'
import { EditMaquinaPage } from '@/features/dim_tables/maquinas/pages/EditMaquinaPage'
import { PipetasPage } from '@/features/dim_tables/pipetas/pages/PipetasPage'
import { CreatePipetaPage } from '@/features/dim_tables/pipetas/pages/CreatePipetaPage'
import { EditPipetaPage } from '@/features/dim_tables/pipetas/pages/EditPipetaPage'
import { ReactivosPage } from '@/features/dim_tables/reactivos/pages/ReactivosPage'
import { CreateReactivoPage } from '@/features/dim_tables/reactivos/pages/CreateReactivoPage'
import { EditReactivoPage } from '@/features/dim_tables/reactivos/pages/EditReactivoPage'
import { MaestrosPage } from '@/features/dashboard/pages/MaestrosPage'
import { WorklistDetailPage } from '@/features/workList/pages/WorklistDetailPage'
import { CreateWorklistPage } from '@/features/workList/pages/CreateWorklistPage'
import { CreateCentroPage } from '@/features/dim_tables/centros/pages/CreateCentroPage'
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
        { path: 'pruebas/nueva', element: <CreatePruebaPage /> },
        { path: 'pruebas/:id/editar', element: <EditPruebaPage /> },
        { path: 'centros', element: <CentrosPage /> },
        { path: 'centros/nuevo', element: <CreateCentroPage /> },
        { path: 'centros/:id/editar', element: <CreateCentroPage /> },
        { path: 'pacientes', element: <PacientesPage /> },
        { path: 'pacientes/nuevo', element: <CreatePacientePage /> },
        { path: 'pacientes/:id/editar', element: <EditPacientePage /> },
        { path: 'clientes', element: <ClientesPage /> },
        { path: 'clientes/nuevo', element: <CreateClientePage /> },
        { path: 'clientes/:id/editar', element: <EditClientePage /> },
        { path: 'criterios-validacion', element: <CriteriosValidacionPage /> },
        { path: 'criterios-validacion/nuevo', element: <CreateCriterioValidacionPage /> },
        { path: 'criterios-validacion/:id/editar', element: <EditCriterioValidacionPage /> },
        { path: 'ubicaciones', element: <UbicacionesPage /> },
        { path: 'ubicaciones/nueva', element: <CreateUbicacionPage /> },
        { path: 'ubicaciones/:id/editar', element: <EditUbicacionPage /> },
        { path: 'maquinas', element: <MaquinasPage /> },
        { path: 'maquinas/nueva', element: <CreateMaquinaPage /> },
        { path: 'maquinas/:id/editar', element: <EditMaquinaPage /> },
        { path: 'pipetas', element: <PipetasPage /> },
        { path: 'pipetas/nueva', element: <CreatePipetaPage /> },
        { path: 'pipetas/:id/editar', element: <EditPipetaPage /> },
        { path: 'reactivos', element: <ReactivosPage /> },
        { path: 'reactivos/nuevo', element: <CreateReactivoPage /> },
        { path: 'reactivos/:id/editar', element: <EditReactivoPage /> },
        { path: 'tipos-muestra', element: <TiposMuestraPage /> },
        { path: 'tipos-muestra/nuevo', element: <CreateTipoMuestraPage /> },
        { path: 'tipos-muestra/:id/editar', element: <EditTipoMuestraPage /> }
      ]
    }
  ],
  { basename: import.meta.env.BASE_URL }
)
