//src/features/solicitud/components/MuestraItem.tsx
import { EstudioItem } from '../../estudio/components/EstudioItem'
import { Muestra } from '../interfaces/muestra.interface'

interface Props {
  muestra: Muestra
}

export const MuestraItem = ({ muestra }: Props) => {
  return (
    <div className="flex flex-wrap w-full">
      <div className="flex w-full justify-between bg-cyan-100">
        <div className="flex flex-wrap justify-start w-full">
          <div className="flex justify-left items-center px-5 space-x-5 h-8 ">
            <span>{muestra.codigoInterno}</span>
            <span>{muestra.identificacionExterna}</span>
            <span>{muestra.fechaIngreso}</span>
            <span>{muestra.estado}</span>
            <span>{muestra.ubicacion}</span>
          </div>
        </div>
        <div className="flex bg-slate-300 w-12 justify-center items-center">&gt;&gt;</div>
      </div>
      <div className="flex w-full">
        {muestra.estudios && (
          <div className="flex w-full flex-wrap justify-between bg-cyan-200 px-8">
            {muestra.estudios.map(estudio => (
              <EstudioItem key={estudio.estudioId} estudio={estudio} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
