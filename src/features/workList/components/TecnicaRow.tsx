// src/features/workList/components/TecnicaRow.tsx

import { User } from 'lucide-react'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { ResultadoInfo } from '@/features/muestras/components/MuestraList/ResultadoInfo'
import { Tecnica } from '../interfaces/worklist.types'

interface TecnicaRowProps {
  tecnica: Tecnica
}

export const TecnicaRow = ({ tecnica }: TecnicaRowProps) => {
  const hasResultados = Boolean(
    tecnica.resultados &&
      (tecnica.resultados.valor !== null ||
        tecnica.resultados.valor_texto ||
        tecnica.resultados.valor_fecha ||
        tecnica.resultados.tipo_res)
  )

  return (
    <div className="grid grid-cols-12 gap-4 border p-3 rounded bg-white hover:bg-gray-50 transition-colors items-center">
      {/* Columna 1: Códigos (span 2) */}
      <div className="col-span-2 space-y-1">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Externo:</span> {tecnica.muestra?.codigo_externo || 'N/A'}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-medium">Epidisease:</span> {tecnica.muestra?.codigo_epi || 'N/A'}
        </div>
      </div>

      {/* Columna 2: Técnico Lab (span 2) */}
      <div className="col-span-2">
        {tecnica.tecnico_resp ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">{tecnica.tecnico_resp.nombre}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Sin asignar</span>
        )}
      </div>

      {/* Columna 3: Resultados (span 6) */}
      <div className="col-span-6">
        {hasResultados && tecnica.resultados ? (
          <ResultadoInfo resultado={tecnica.resultados} />
        ) : (
          <span className="text-xs text-gray-400">Sin resultados</span>
        )}
      </div>

      {/* Columna 4: Estado (span 2) */}
      <div className="col-span-2 flex justify-end">
        {tecnica.estadoInfo ? (
          <IndicadorEstado estado={tecnica.estadoInfo} size="small" />
        ) : (
          <span className="text-xs text-gray-400">Sin estado</span>
        )}
      </div>
    </div>
  )
}
