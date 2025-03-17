//src/features/solicitud/components/SolicitudItem.tsx
import { Solicitud } from '../interfaces/solicitud.interface'
import { useMuestra } from '../hooks/useMuestra'
import { MuestraItem } from './MuestraItem'

interface Props {
  solicitud: Solicitud
  showDropDown?: boolean
}

export const SolicitudItem = ({ solicitud }: Props) => {
  const { data: muestras, isLoading, isError } = useMuestra(solicitud.id)
  return (
    <div className="flex flex-wrap justify-between bg-cyan-50 shadow-md rounded mx-3 my-1">
      <div className="flex justify-left items-center px-5 pt-4 space-x-5 w-full h-12 ">
        <span>{solicitud.solicitante}</span>
        <span>{solicitud.fechaSolicitud}</span>
        <span>{solicitud.estado}</span>
      </div>
      <div className="w-full ">
        {isLoading && <span>Cargando...</span>}
        {isError && <span>Error al cargar la muestra</span>}
        {muestras && muestras.map(muestra => <MuestraItem key={muestra.id} muestra={muestra} />)}
      </div>
    </div>
  )
}
