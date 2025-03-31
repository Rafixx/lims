//src/routes/routes.tsx
import { Routes, Route } from 'react-router-dom'
import NotFoundPage from '../../pages/NotFoundPage'
// import HomePage from '../../pages/HomePage'
import Login from '../../pages/Login'
// import UserPage from '../../pages/UserPage'
import { ListadoSolicitudesPage } from '../../features/listadoSolicitudes/pages/ListadoSolicitudes.page'
import { AparatoList } from '../../features/catalogo/aparato/components/AparatoList'
import { UsuarioList } from '../../features/usuario/components/UsuarioList'
import { TiposResultadoTable } from '../../features/catalogo/tipoResultado/components/TipoResultadosTable'
import { ProcesoTable } from '../../features/catalogo/proceso/components/ProcesoTable'
import { EstudioTable } from '../../features/catalogo/estudio/components/EstudioTable'
import HomePage from '../../pages/HomePage'

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} /> {/* Ruta catch-all para 404 */}
      {/* <Route path="/" element={<HomePage />}> */}
      {/* <Route index element={<HomePage />} /> */}
      <Route index element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="login" element={<Login />} />
      <Route path="solicitudes/muestras" element={<ListadoSolicitudesPage />} />
      <Route path="catalogo/aparatos" element={<AparatoList />} />
      <Route path="catalogo/usuarios" element={<UsuarioList />} />
      <Route path="catalogo/tiposResultado" element={<TiposResultadoTable />} />
      <Route path="catalogo/procesos" element={<ProcesoTable />} />
      <Route path="catalogo/estudios" element={<EstudioTable />} />
      {/* <Route path="profile" element={<ProfilePage />} />
      <Route path="configuracion/maquinas" element={<MaquinasPage />} />
      <Route path="resultados/listado" element={<ListadoPage />} />
      <Route path="resultados/filtros" element={<FiltrosPage />} />
      <Route path="configuracion/productos" element={<ProductosPage />} />
      <Route path="configuracion/tecnicas" element={<TecnicasPage />} />
      <Route path="estadistica/graficos" element={<GraficosPage />} />
      <Route path="estadistica/reportes" element={<ReportesPage />} />
      <Route path="resultados/muestras" element={<MuestrasPage />} /> */}
      {/* </Route> */}
    </Routes>
  )
}

export default MyRoutes
