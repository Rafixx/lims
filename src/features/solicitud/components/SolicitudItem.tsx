//src/features/solicitud/components/SolicitudItem.tsx
import { Solicitud } from '../interfaces/solicitud.interface'
import { useMuestra } from '../hooks/useMuestra'
import { MuestraItem } from './MuestraItem'

interface Props {
  solicitud: Solicitud
}

export const SolicitudItem = ({ solicitud }: Props) => {
  const { data: muestras, isLoading, isError } = useMuestra(solicitud.id)
  return (
    <>
      <div className="flex justify-left items-center px-5 pt-4 space-x-5 w-full h-12 ">
        <span>{solicitud.solicitante}</span>
        <span>{solicitud.fechaSolicitud}</span>
        <span>{solicitud.estado}</span>
      </div>
      <div className="px-5 py-2 border-b border-gray-200">
        {isLoading && <span>Cargando...</span>}
        {isError && <span>Error al cargar la muestra</span>}
        {muestras && muestras.map(muestra => <MuestraItem key={muestra.id} muestra={muestra} />)}
      </div>
    </>
  )
}
