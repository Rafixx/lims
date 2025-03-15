//src/features/solicitud/components/MuestraItem.tsx
import { Muestra } from '../interfaces/muestra.interface'

interface Props {
  muestra: Muestra
}

export const MuestraItem = ({ muestra }: Props) => {
  return (
    <div className="flex justify-left items-center space-x-5 ">
      <span>{muestra.codigoInterno}</span>
      <span>{muestra.identificacionExterna}</span>
      <span>{muestra.fechaIngreso}</span>
      <span>{muestra.estado}</span>
      <span>{muestra.ubicacion}</span>
    </div>
  )
}
