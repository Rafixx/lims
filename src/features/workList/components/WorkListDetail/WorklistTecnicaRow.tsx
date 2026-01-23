// src/features/workList/components/TecnicaRow.tsx

import { AlertTriangle, Edit } from 'lucide-react'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { ResultadoInfo } from '@/features/muestras/components/MuestraList/ResultadoInfo'
import { Tecnica } from '../../interfaces/worklist.types'
import { Button } from '@/shared/components/molecules/Button'

interface TecnicaRowProps {
  tecnica: Tecnica
  onManualResult: (tecnica: Tecnica) => void
  onMarcarResultadoErroneo: (idsTecnicas: number[]) => void
}

export const TecnicaRow = ({
  tecnica,
  onManualResult,
  onMarcarResultadoErroneo
}: TecnicaRowProps) => {
  const hasResultados = Boolean(
    tecnica.resultados &&
      tecnica.resultados.length > 0 &&
      tecnica.resultados.some(
        resultado =>
          resultado.valor !== null ||
          resultado.valor_texto ||
          resultado.valor_fecha ||
          resultado.tipo_res
      )
  )

  const handleMarcarErroneoIndividual = () => {
    if (tecnica.id_tecnica) {
      onMarcarResultadoErroneo([tecnica.id_tecnica])
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 border p-2 rounded bg-white hover:bg-gray-50 transition-colors items-center">
      {/* Columna 1: Códigos inline (span 2) */}
      <div className="col-span-2 text-xs text-gray-700">
        <span className="font-medium text-gray-500">Ext:</span>{' '}
        {tecnica.muestra?.codigo_externo || 'N/A'}
        <span className="mx-2 text-gray-300">|</span>
        <span className="font-medium text-gray-500">Epi:</span>{' '}
        {tecnica.muestra?.codigo_epi || 'N/A'}
      </div>

      {/* Columna 2: Pocillo (span 1) */}
      <div className="col-span-1 text-xs text-center">
        <span className="font-medium text-gray-700">
          {tecnica.muestraArray?.posicion_placa || '-'}
        </span>
      </div>

      {/* Columna 3: Resultados + Botones inline (span 7) */}
      <div className="col-span-7">
        {hasResultados && tecnica.resultados && tecnica.resultados.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              {tecnica.resultados.map((resultado, index) => (
                <ResultadoInfo key={index} resultado={resultado} />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 flex items-center gap-1.5 h-7"
              title="Introducción manual de resultados"
              onClick={() => onManualResult(tecnica)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">Sin resultados</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 flex items-center gap-1.5 h-7"
                title="Introducción manual de resultados"
                onClick={() => onManualResult(tecnica)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 flex items-center gap-1.5 h-7 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-800"
                title="Marcar como resultado erróneo"
                onClick={handleMarcarErroneoIndividual}
              >
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Columna 3: Estado (span 2) */}
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
