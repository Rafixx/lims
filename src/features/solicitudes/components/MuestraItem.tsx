import { Muestra } from '../interfaces/api.types'
import { TecnicaItem } from './TecnicaItem'

interface Props {
  muestra: Muestra
}

export const MuestraItem = ({ muestra }: Props) => {
  return (
    <div className="p-3 border rounded bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Código EPI:</span> {muestra.codigo_epi}
          </p>
          <p>
            <span className="font-semibold">Código externo:</span> {muestra.codigo_externo}
          </p>
          <p>
            <span className="font-semibold">Tipo de muestra:</span>
            {muestra.tipo_muestra?.tipo_muestra}
          </p>
          <p>
            <span className="font-semibold">Técnico responsable:</span>
            {muestra.tecnico_resp?.nombre ?? 'Sin asignar'}
          </p>
        </div>

        <div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {muestra.estado_muestra}
          </span>
        </div>
      </div>
      {muestra.tecnicas && muestra.tecnicas.length > 0 && (
        <div className="mt-2 pl-2 border-l-2 border-blue-100 space-y-1">
          <h4 className="text-xs font-semibold text-blue-600 mb-1">Técnicas asociadas</h4>
          {muestra.tecnicas.map(tecnica => (
            <TecnicaItem key={tecnica.id_tecnica} tecnica={tecnica} />
          ))}
        </div>
      )}
    </div>
  )
}
