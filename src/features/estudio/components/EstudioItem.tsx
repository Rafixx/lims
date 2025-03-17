//src/features/estudio/components/EstudioItem.tsx
import { Estudio } from '../interfaces/estudio.interface'

interface Props {
  estudio: Estudio
}

export const EstudioItem = ({ estudio }: Props) => {
  return (
    <div className="mx-3">
      <div className="flex justify-left items-center px-5 space-x-5 h-8">
        <span>{estudio.estudioId}</span>
        <span>{estudio.nombre}</span>
        <span>{estudio.estado}</span>
      </div>
    </div>
  )
}
