//src/features/listadoSolicitudes/components/MuestrasList.tsx
import { Muestra } from '../interfaces/muestra.interface'
import { MuestraCard } from './MuestraCard'

interface Props {
  muestras: Muestra[]
}

export const MuestrasList = ({ muestras }: Props) => {
  return (
    <div>
      {muestras.map(muestra => (
        <MuestraCard key={muestra.id} muestra={muestra} />
      ))}
    </div>
  )
}
