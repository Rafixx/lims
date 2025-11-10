// src/features/plantillaTecnica/components/TecnicasList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Beaker } from 'lucide-react'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'

interface TecnicasListProps {
  tecnicas: Tecnica[]
}

/**
 * Componente que muestra la lista de técnicas del worklist en formato tabla
 * Muestra: Código, Tipo, Valor y Unidades en formato tabular
 * Ahora soporta múltiples resultados por técnica
 */
export const TecnicasList = ({ tecnicas }: TecnicasListProps) => {
  return (
    <Card className="p-6">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Beaker className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">Muestras y Resultados</h2>
          <p className="text-sm text-surface-600">
            {tecnicas.length} {tecnicas.length === 1 ? 'técnica' : 'técnicas'}
          </p>
        </div>
      </div>

      {/* Tablas de técnicas en 2 columnas */}
      {tecnicas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Dividir técnicas en dos grupos */}
          {[0, 1].map(colIndex => {
            const tecnicasPorColumna = Math.ceil(tecnicas.length / 2)
            const inicio = colIndex * tecnicasPorColumna
            const fin = inicio + tecnicasPorColumna
            const tecnicasColumna = tecnicas.slice(inicio, fin)

            if (tecnicasColumna.length === 0) return null

            return (
              <div key={colIndex} className="border border-surface-200 rounded-lg overflow-hidden">
                {/* Encabezado de la tabla con 4 columnas */}
                <div className="grid grid-cols-[80px_1fr_90px_80px] gap-2 bg-primary-50 border-b border-surface-200 px-3 py-2">
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Código</div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">
                    Tipo Resultado
                  </div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase text-right">
                    Valor
                  </div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Unidades</div>
                </div>

                {/* Filas de datos */}
                <div className="divide-y divide-surface-200">
                  {tecnicasColumna.map((tecnica, tecnicaIndex) => {
                    const codigoMuestra =
                      tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || '-'

                    // Si no hay resultados, mostrar una fila vacía
                    if (!tecnica.resultados || tecnica.resultados.length === 0) {
                      return (
                        <div
                          key={tecnicaIndex}
                          className="grid grid-cols-[80px_1fr_90px_80px] gap-2 px-3 py-1.5 hover:bg-surface-50 transition-colors"
                        >
                          <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                            {codigoMuestra}
                          </div>
                          <div className="text-[10px] text-surface-400 italic">Sin resultados</div>
                          <div className="text-[10px] text-surface-400 text-right">-</div>
                          <div className="text-[10px] text-surface-400">-</div>
                        </div>
                      )
                    }

                    // Renderizar cada resultado como una fila
                    return tecnica.resultados.map((resultado, resultadoIndex) => (
                      <div
                        key={`${tecnicaIndex}-${resultadoIndex}`}
                        className="grid grid-cols-[80px_1fr_90px_80px] gap-2 px-3 py-1.5 hover:bg-surface-50 transition-colors"
                      >
                        {/* Código - Solo mostrar en la primera fila, con wrap en 2 líneas */}
                        <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                          {resultadoIndex === 0 ? codigoMuestra : ''}
                        </div>

                        {/* Tipo de Resultado */}
                        <div
                          className="text-[10px] text-surface-700 truncate"
                          title={resultado.tipo_res}
                        >
                          {resultado.tipo_res}
                        </div>

                        {/* Valor */}
                        <div
                          className="text-[10px] font-semibold text-success-600 text-right truncate"
                          title={String(resultado.valor || '-')}
                        >
                          {resultado.valor !== null && resultado.valor !== undefined
                            ? resultado.valor
                            : '-'}
                        </div>

                        {/* Unidades */}
                        <div
                          className="text-[10px] text-surface-600 truncate"
                          title={resultado.unidades || ''}
                        >
                          {resultado.unidades || '-'}
                        </div>
                      </div>
                    ))
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-12">
          <Beaker className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">No hay técnicas en este worklist</p>
        </div>
      )}
    </Card>
  )
}
