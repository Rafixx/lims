//src/features/muestras/components/MuestraCard.tsx
import { Muestra } from '../interfaces/muestra.interface'
import { EstudiosList } from '../../estudio/components/EstudiosList'

interface Props {
  muestra: Muestra
}

export const MuestraCard = ({ muestra }: Props) => {
  return (
    <article className="bg-gray-50 p-3 rounded mb-3">
      <header className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{muestra.codigoInterno}</h3>
        <time className="text-xs text-gray-600">
          {new Date(muestra.fechaIngreso).toLocaleDateString()}
        </time>
      </header>
      <p className="text-sm">ID Externa: {muestra.identificacionExterna}</p>
      <p className="text-sm">Ubicación: {muestra.ubicacion}</p>
      <div className="mt-2">
        <EstudiosList estudios={muestra.estudios} />
      </div>
    </article>
  )
}
