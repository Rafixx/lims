//src/features/listadoSolicitudes/components/EstudiosList.tsx
import { Estudio } from '../interfaces/estudio.interface'
import { EstudioCard } from './EstudioCard'

interface Props {
  estudios: Estudio[]
}

export const EstudiosList = ({ estudios }: Props) => {
  return (
    <div>
      {estudios.map(estudio => (
        <EstudioCard key={estudio.estudioId} estudio={estudio} />
      ))}
    </div>
  )
}
