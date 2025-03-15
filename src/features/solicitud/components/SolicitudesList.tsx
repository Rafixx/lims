//src/features/solicitud/components/SolicitudesList.tsx
import { FC } from 'react'
import { Solicitud } from '../interfaces/solicitud.interface'
import { SolicitudItem } from './SolicitudItem'

interface Props {
  solicitudes: Solicitud[]
}

export const SolicitudesList: FC<Props> = ({ solicitudes }) => {
  return (
    <div>
      {solicitudes.map(solicitud => (
        <SolicitudItem key={solicitud.id} solicitud={solicitud} />
      ))}
    </div>
  )
}
