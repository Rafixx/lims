import { Muestra } from '../interfaces/solicitudes.types'

interface Props {
  muestra: Muestra
}

export const MuestraItem = ({ muestra }: Props) => {
  return (
    <div className="p-3 border rounded bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
          <p>
            <span className="font-semibold">Prueba: </span> {muestra.prueba?.prueba}
          </p>
          <p>
            <span className="font-semibold">Cód Epidisease: </span> {muestra.codigo_muestra}
          </p>
          <p>
            <span className="font-semibold">REVISAR - Cód externo: </span> {muestra.codigo_muestra}
          </p>
          <p>
            <span className="font-semibold">Tipo de muestra: </span>
            {muestra.tipo_muestra?.descripcion ?? 'No especificado'}
          </p>
          <p>
            <span className="font-semibold">REVISAR - Técnico: </span>
            {muestra.id_prueba ?? 'Sin asignar'}
          </p>
        </div>

        <div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            REVISAR: {muestra.observaciones_muestra}
          </span>
        </div>
      </div>
      {muestra.tecnicas && muestra.tecnicas.length > 0 && (
        <div className="mt-2 pl-2 border-l-2 border-blue-100 space-y-1">
          <h4 className="text-xs font-semibold text-blue-600 mb-1">Técnicas asociadas</h4>
          {/* {muestra.tecnicas.map(tecnica => (
            <TecnicaItem key={tecnica.descripcion} tecnica={tecnica} />
          ))} */}
        </div>
      )}
    </div>
  )
}
