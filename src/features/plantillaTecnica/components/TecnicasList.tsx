// src/features/plantillaTecnica/components/TecnicasList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Beaker } from 'lucide-react'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'

interface TecnicasListProps {
  tecnicas: Tecnica[]
}

/**
 * Componente que muestra la lista de técnicas del worklist en formato tabla
 * Muestra: Código, Muestra y Resultado en formato tabular
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
          <h2 className="text-xl font-bold text-surface-900">Técnicas del Worklist</h2>
          <p className="text-sm text-surface-600">
            {tecnicas.length} {tecnicas.length === 1 ? 'técnica' : 'técnicas'}
          </p>
        </div>
      </div>

      {/* Tabla de técnicas en 4 columnas compactas */}
      {tecnicas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Función helper para renderizar una tabla */}
          {[0, 1, 2, 3].map(colIndex => {
            // Dividir técnicas en 4 columnas
            const tecnicasPorColumna = Math.ceil(tecnicas.length / 4)
            const inicio = colIndex * tecnicasPorColumna
            const fin = inicio + tecnicasPorColumna
            const tecnicasColumna = tecnicas.slice(inicio, fin)

            // Si no hay técnicas en esta columna, no renderizar nada
            if (tecnicasColumna.length === 0) return null

            return (
              <div key={colIndex} className="border border-surface-200 rounded-lg overflow-hidden">
                {/* Encabezado de la tabla */}
                <div className="grid grid-cols-3 gap-2 bg-primary-50 border-b border-surface-200 px-2 py-1.5">
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Código</div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Muestra</div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Resultado</div>
                </div>

                {/* Filas de datos */}
                <div className="divide-y divide-surface-200">
                  {tecnicasColumna.map((tecnica, index) => {
                    const codigoMuestra =
                      tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || '-'
                    const resultado = tecnica.resultados?.valor || '-'

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-2 px-2 py-1.5 hover:bg-surface-50 transition-colors"
                      >
                        <div className="text-[11px] font-mono font-semibold text-primary-600 truncate">
                          {codigoMuestra}
                        </div>
                        <div className="text-[11px] text-surface-900 truncate">
                          {tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || '-'}
                        </div>
                        <div className="text-[11px] font-semibold text-success-600 truncate">
                          {resultado}
                        </div>
                      </div>
                    )
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
