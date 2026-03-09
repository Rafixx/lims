// src/features/plantillaTecnica/components/TecnicasList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Beaker } from 'lucide-react'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import type { Template } from '../interfaces/template.types'
import { TecnicasTemplateTable, type SavePar } from './TecnicasTemplateTable'

interface TecnicasListProps {
  tecnicas: Tecnica[]
  /** Plantilla con scope TECNICA. Si se proporciona, sustituye la tabla de resultados
   *  por la tabla de entrada de datos de plantilla. */
  templateTecnica?: Template
  /** Callback de guardado en lote. Requerido cuando templateTecnica está presente. */
  onSaveTecnicaValues?: (pares: SavePar[]) => Promise<void>
  /** Indica si hay un guardado en curso (deshabilita el botón global). */
  isSavingTecnica?: boolean
}

/**
 * Componente que muestra la lista de técnicas del worklist.
 *
 * — Sin template: tabla de resultados (Tipo Resultado, Valor, Unidades).
 * — Con template scope TECNICA: tabla de entrada de datos de plantilla
 *   integrada en la misma sección.
 */
export const TecnicasList = ({
  tecnicas,
  templateTecnica,
  onSaveTecnicaValues,
  isSavingTecnica = false
}: TecnicasListProps) => {
  const isTecnicaScope = templateTecnica?.scope === 'TECNICA'

  return (
    <Card className="p-6">
      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Beaker className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">Muestras y Resultados</h2>
          <p className="text-sm text-surface-600">
            {tecnicas.length} {tecnicas.length === 1 ? 'técnica' : 'técnicas'}
            {isTecnicaScope && (
              <span className="ml-2 text-surface-400">— Introduce los valores por muestra</span>
            )}
          </p>
        </div>
      </div>

      {tecnicas.length === 0 ? (
        /* Estado vacío */
        <div className="text-center py-12">
          <Beaker className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">No hay técnicas en este worklist</p>
        </div>
      ) : isTecnicaScope && onSaveTecnicaValues ? (
        /* Tabla de entrada de datos por técnica */
        <TecnicasTemplateTable
          tecnicas={tecnicas}
          template={templateTecnica}
          onSave={onSaveTecnicaValues}
          isSaving={isSavingTecnica}
        />
      ) : (
        /* Tabla de resultados (comportamiento original) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[0, 1].map(colIndex => {
            const tecnicasPorColumna = Math.ceil(tecnicas.length / 2)
            const inicio = colIndex * tecnicasPorColumna
            const fin = inicio + tecnicasPorColumna
            const tecnicasColumna = tecnicas.slice(inicio, fin)

            if (tecnicasColumna.length === 0) return null

            return (
              <div key={colIndex} className="border border-surface-200 rounded-lg overflow-hidden">
                {/* Encabezado */}
                <div className="grid grid-cols-[70px_70px_1fr_90px_70px] gap-2 bg-primary-50 border-b border-surface-200 px-3 py-2">
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Cód. Ext</div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Cód. Epi</div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">
                    Tipo Resultado
                  </div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase text-right">
                    Valor
                  </div>
                  <div className="text-[10px] font-bold text-surface-700 uppercase">Unidades</div>
                </div>

                {/* Filas */}
                <div className="divide-y divide-surface-200">
                  {tecnicasColumna.map((tecnica, tecnicaIndex) => {
                    const isArray = Boolean(tecnica.muestraArray)
                    const codigoExterno =
                      isArray && tecnica.muestraArray?.codigo_externo
                        ? tecnica.muestraArray.codigo_externo
                        : tecnica.muestra?.codigo_externo || '-'
                    const codigoEpi =
                      isArray && tecnica.muestraArray?.codigo_epi
                        ? tecnica.muestraArray.codigo_epi
                        : tecnica.muestra?.codigo_epi || '-'

                    if (!tecnica.resultados || tecnica.resultados.length === 0) {
                      return (
                        <div
                          key={tecnicaIndex}
                          className="grid grid-cols-[70px_70px_1fr_90px_70px] gap-2 px-3 py-1.5 hover:bg-surface-50 transition-colors"
                        >
                          <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                            {codigoExterno}
                          </div>
                          <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                            {codigoEpi}
                          </div>
                          <div className="text-[10px] text-surface-400 italic">Sin resultados</div>
                          <div className="text-[10px] text-surface-400 text-right">-</div>
                          <div className="text-[10px] text-surface-400">-</div>
                        </div>
                      )
                    }

                    return tecnica.resultados.map((resultado, resultadoIndex) => (
                      <div
                        key={`${tecnicaIndex}-${resultadoIndex}`}
                        className="grid grid-cols-[70px_70px_1fr_90px_70px] gap-2 px-3 py-1.5 hover:bg-surface-50 transition-colors"
                      >
                        <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                          {resultadoIndex === 0 ? codigoExterno : ''}
                        </div>
                        <div className="text-[10px] font-mono font-semibold text-primary-600 leading-tight break-words">
                          {resultadoIndex === 0 ? codigoEpi : ''}
                        </div>
                        <div
                          className="text-[10px] text-surface-700 truncate"
                          title={resultado.tipo_res}
                        >
                          {resultado.tipo_res}
                        </div>
                        <div
                          className="text-[10px] font-semibold text-success-600 text-right truncate"
                          title={String(resultado.valor || '-')}
                        >
                          {resultado.valor !== null && resultado.valor !== undefined
                            ? resultado.valor
                            : '-'}
                        </div>
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
      )}
    </Card>
  )
}
