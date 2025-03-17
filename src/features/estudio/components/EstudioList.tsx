//src/features/estudio/components/EstudioList.tsx
import { FC } from 'react'
import { Estudio } from '../interfaces/estudio.interface'
import { EstudioItem } from './EstudioItem'

interface Props {
  estudios: Estudio[]
}

export const EstudioList: FC<Props> = ({ estudios }) => {
  return (
    <div>
      {estudios.map(estudio => (
        <EstudioItem key={estudio.estudioId} estudio={estudio} />
      ))}
    </div>
  )
}
