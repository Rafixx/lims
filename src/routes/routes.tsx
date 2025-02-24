//src/routes/routes.tsx
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import ProfilePage from '../pages/ProfilePage'
import MuestrasPage from '../pages/MuestrasPage'
import UserPage from '../pages/UserPage'
import ListadoPage from '../pages/ListadoPage'
import FiltrosPage from '../pages/FiltrosPage'
import GraficosPage from '../pages/GraficosPage'
import ReportesPage from '../pages/ReportesPage'
import MaquinasPage from '../pages/MaquinasPage'
import ProductosPage from '../pages/ProductosPage'
import TecnicasPage from '../pages/TecnicasPage'

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />}> */}
      <Route index element={<HomePage />} />
      <Route path="login" element={<Login />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="configuracion/usuarios" element={<UserPage />} />
      <Route path="configuracion/maquinas" element={<MaquinasPage />} />
      <Route path="resultados/listado" element={<ListadoPage />} />
      <Route path="resultados/filtros" element={<FiltrosPage />} />
      <Route path="configuracion/productos" element={<ProductosPage />} />
      <Route path="configuracion/tecnicas" element={<TecnicasPage />} />
      <Route path="estadistica/graficos" element={<GraficosPage />} />
      <Route path="estadistica/reportes" element={<ReportesPage />} />
      <Route path="resultados/muestras" element={<MuestrasPage />} />
      {/* </Route> */}
    </Routes>
  )
}

export default MyRoutes
