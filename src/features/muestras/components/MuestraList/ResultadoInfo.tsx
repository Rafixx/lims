import { Calendar, Hash, Type } from 'lucide-react'
import { Resultado } from '../../interfaces/muestras.types'
import { formatDate } from '@/shared/utils/helpers'

/**
 * Componente para renderizar información de un resultado individual
 */
export const ResultadoInfo = ({ resultado }: { resultado: Resultado }) => {
  if (!resultado) return null

  const hasData =
    resultado.valor !== null || resultado.valor_texto || resultado.valor_fecha || resultado.tipo_res

  if (!hasData) return null

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {/* Tipo de Resultado */}
      {resultado.tipo_res && (
        <div className="flex items-center gap-1">
          <Type className="w-3 h-3 text-surface-400 flex-shrink-0" />
          <span className="text-surface-500">Tipo:</span>
          <span className="font-medium text-surface-800">{resultado.tipo_res}</span>
        </div>
      )}

      {/* Valor Numérico/String */}
      {resultado.valor !== null && resultado.valor !== undefined && (
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3 text-surface-400 flex-shrink-0" />
          <span className="text-surface-500">Valor:</span>
          <span className="font-medium text-surface-800">
            {resultado.valor}
            {resultado.unidades && (
              <span className="text-surface-500 ml-1">{resultado.unidades}</span>
            )}
          </span>
        </div>
      )}

      {/* Valor Texto */}
      {resultado.valor_texto && (
        <div className="flex items-center gap-1">
          <Type className="w-3 h-3 text-surface-400 flex-shrink-0" />
          <span className="text-surface-500">Desc:</span>
          <span
            className="font-medium text-surface-800 truncate max-w-[150px]"
            title={resultado.valor_texto}
          >
            {resultado.valor_texto}
          </span>
        </div>
      )}

      {/* Valor Fecha */}
      {resultado.valor_fecha && (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-surface-400 flex-shrink-0" />
          <span className="text-surface-500">Fecha:</span>
          <span className="font-medium text-surface-800 font-mono">
            {formatDate(resultado.valor_fecha)}
          </span>
        </div>
      )}
    </div>
  )
}
