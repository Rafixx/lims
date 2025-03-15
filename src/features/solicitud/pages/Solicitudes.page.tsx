//src/features/solicitud/pages/Solicitudes.page.tsx
import { SolicitudesList } from '../components/SolicitudesList'
import { useSolicitudes } from '../hooks/useSolicitudes'

export const SolicitudesPage = () => {
  const { data: solicitudes } = useSolicitudes()
  return (
    <div>
      <h1>Solicitudes</h1>
      <SolicitudesList solicitudes={solicitudes || []} />
    </div>
  )
}
