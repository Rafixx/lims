// src/features/workList/components/MapResultsModal.tsx

import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/molecules/Button'
import { X, ArrowRight, FileText, Beaker } from 'lucide-react'
import { Tecnica, MappableRow } from '../../interfaces/worklist.types'

interface MapResultsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (mapping: Record<number, number>) => void
  tecnicas: Tecnica[]
  mappableRows: MappableRow[]
}

/**
 * Modal para mapear resultados de la tabla RAW con las técnicas del worklist
 */
export const MapResultsModal = ({
  isOpen,
  onClose,
  onConfirm,
  tecnicas,
  mappableRows
}: MapResultsModalProps) => {
  // Estado: mapeo de índice de fila CSV -> id_tecnica
  const [mapping, setMapping] = useState<Record<number, number>>({})
  // Estado: técnicas mapeadas automáticamente (para deshabilitar el select)
  const [autoMappedRows, setAutoMappedRows] = useState<Set<number>>(new Set())
  const [errors, setErrors] = useState<string[]>([])

  // Inicializar mapeo automático inteligente basado en codigo_epi o posicion_placa
  useEffect(() => {
    if (isOpen && mappableRows.length > 0 && tecnicas.length > 0) {
      const initialMapping: Record<number, number> = {}
      const autoMapped = new Set<number>()
      const usedTecnicas = new Set<number>()

      // Fase 1: Mapeo automático por coincidencia
      mappableRows.forEach((row, index) => {
        const sampleId = row.sampleIdentifier?.trim()
        const posicionPlaca = row.posicionPlaca?.trim()

        let tecnicaMatch: Tecnica | undefined

        // Caso 1: Si hay posición de placa, buscar por muestraArray (para arrays)
        if (posicionPlaca) {
          tecnicaMatch = tecnicas.find(
            t =>
              t.muestraArray &&
              t.muestraArray.posicion_placa === posicionPlaca &&
              !usedTecnicas.has(t.id_tecnica || 0)
          )
        }

        // Caso 2: Si no hay match por posición, buscar por codigo_epi del array o de la muestra
        if (!tecnicaMatch && sampleId) {
          tecnicaMatch = tecnicas.find(
            t =>
              !usedTecnicas.has(t.id_tecnica || 0) &&
              (t.muestraArray?.codigo_epi === sampleId ||
                t.muestraArray?.codigo_externo === sampleId ||
                t.muestra?.codigo_epi === sampleId ||
                t.muestra?.codigo_externo === sampleId)
          )
        }

        if (tecnicaMatch?.id_tecnica) {
          initialMapping[index] = tecnicaMatch.id_tecnica
          autoMapped.add(index)
          usedTecnicas.add(tecnicaMatch.id_tecnica)
        }
      })

      // Fase 2: Para las filas sin mapeo automático, asignar por orden las técnicas restantes
      let tecnicaIndex = 0
      mappableRows.forEach((_, index) => {
        if (!initialMapping[index]) {
          // Buscar la siguiente técnica disponible que no haya sido usada
          while (
            tecnicaIndex < tecnicas.length &&
            usedTecnicas.has(tecnicas[tecnicaIndex]?.id_tecnica || 0)
          ) {
            tecnicaIndex++
          }

          if (tecnicas[tecnicaIndex]?.id_tecnica) {
            initialMapping[index] = tecnicas[tecnicaIndex].id_tecnica!
            usedTecnicas.add(tecnicas[tecnicaIndex].id_tecnica!)
            tecnicaIndex++
          }
        }
      })

      setMapping(initialMapping)
      setAutoMappedRows(autoMapped)
      setErrors([])
    }
  }, [isOpen, mappableRows, tecnicas])

  const handleMappingChange = (rowIndex: number, tecnicaId: string) => {
    setMapping(prev => ({
      ...prev,
      [rowIndex]: parseInt(tecnicaId)
    }))
  }

  const validateMapping = (): boolean => {
    const newErrors: string[] = []

    // Verificar que todas las filas tengan una técnica asignada
    mappableRows.forEach((_, index) => {
      if (!mapping[index]) {
        newErrors.push(`La fila ${index + 1} no tiene técnica asignada`)
      }
    })

    // Verificar que no haya técnicas duplicadas
    const usedTecnicas = Object.values(mapping)
    const uniqueTecnicas = new Set(usedTecnicas)
    if (usedTecnicas.length !== uniqueTecnicas.size) {
      newErrors.push('No puede asignar la misma técnica a múltiples resultados')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleConfirm = () => {
    if (validateMapping()) {
      onConfirm(mapping)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-100 rounded-lg">
              <ArrowRight className="w-6 h-6 text-info-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">Mapear Resultados</h2>
              <p className="text-sm text-surface-600 mt-1">
                Asigna cada resultado del CSV a su técnica correspondiente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Info boxes */}
        <div className="px-6 py-4 bg-info-50 border-b border-info-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-info-600" />
              <span className="text-surface-700">
                <span className="font-semibold">{mappableRows.length}</span> resultados importados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-info-600" />
              <span className="text-surface-700">
                <span className="font-semibold">{tecnicas.length}</span> técnicas en worklist
              </span>
            </div>
            {autoMappedRows.size > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="px-2 py-0.5 text-xs font-semibold bg-success-600 text-white rounded">
                  AUTO-MATCH
                </div>
                <span className="text-success-700 font-semibold">
                  {autoMappedRows.size} coincidencia{autoMappedRows.size !== 1 ? 's' : ''}{' '}
                  automática{autoMappedRows.size !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {mappableRows.map((row, index) => {
              const tecnicaAsignada = tecnicas.find(t => t.id_tecnica === mapping[index])
              const isAutoMapped = autoMappedRows.has(index)
              const sampleId = row.sampleIdentifier

              return (
                <div
                  key={index}
                  className={`grid grid-cols-[1fr_auto_1fr] gap-4 items-center p-4 border rounded-lg ${
                    isAutoMapped
                      ? 'bg-success-50 border-success-300'
                      : 'bg-surface-50 border-surface-200'
                  }`}
                >
                  {/* Columna izquierda: Datos importados */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-info-600" />
                      <span className="text-xs font-semibold text-surface-500 uppercase">
                        Fila #{index + 1}
                      </span>
                      {isAutoMapped && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-success-600 text-white rounded">
                          AUTO-MATCH
                        </span>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      {Object.entries(row.displayData).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-semibold text-surface-700 min-w-[120px]">
                            {key}:
                          </span>
                          <span className="text-surface-900 font-mono">{value || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Columna central: Flecha */}
                  <div className="flex items-center justify-center">
                    <ArrowRight
                      className={`w-6 h-6 ${isAutoMapped ? 'text-success-600' : 'text-primary-500'}`}
                    />
                  </div>

                  {/* Columna derecha: Selector de técnica */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-primary-600" />
                      <span className="text-xs font-semibold text-surface-500 uppercase">
                        Técnica del Worklist
                      </span>
                    </div>
                    <select
                      value={mapping[index] || ''}
                      onChange={e => handleMappingChange(index, e.target.value)}
                      disabled={isAutoMapped}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        isAutoMapped
                          ? 'bg-surface-100 text-surface-600 cursor-not-allowed border-surface-300'
                          : 'bg-white border-surface-300'
                      }`}
                      title={
                        isAutoMapped
                          ? `Match automático: ${sampleId} coincide con código de muestra`
                          : 'Seleccionar técnica manualmente'
                      }
                    >
                      <option value="">Seleccionar técnica...</option>
                      {tecnicas.map(tecnica => {
                        // Verificar si esta técnica ya está siendo usada (excepto para la fila actual)
                        const isUsedByOther = Object.entries(mapping).some(
                          ([rowIdx, tecId]) =>
                            parseInt(rowIdx) !== index && tecId === tecnica.id_tecnica
                        )

                        // Determinar el label según si es array o muestra normal
                        const label = tecnica.muestraArray
                          ? `${tecnica.muestraArray.codigo_placa} - ${tecnica.muestraArray.posicion_placa}${
                              tecnica.muestraArray.codigo_epi
                                ? ` (${tecnica.muestraArray.codigo_epi})`
                                : ''
                            }`
                          : tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || 'N/A'

                        return (
                          <option
                            key={tecnica.id_tecnica}
                            value={tecnica.id_tecnica}
                            disabled={isUsedByOther}
                          >
                            {label} - ID: {tecnica.id_tecnica}
                            {isUsedByOther ? ' (ya asignada)' : ''}
                          </option>
                        )
                      })}
                    </select>
                    {tecnicaAsignada && (
                      <div className="text-xs text-surface-600 mt-1 space-y-0.5">
                        {tecnicaAsignada.muestraArray ? (
                          <>
                            <div>
                              <span className="font-semibold">Placa:</span>{' '}
                              {tecnicaAsignada.muestraArray.codigo_placa}
                            </div>
                            <div>
                              <span className="font-semibold">Posición:</span>{' '}
                              {tecnicaAsignada.muestraArray.posicion_placa}
                            </div>
                            {tecnicaAsignada.muestraArray.codigo_epi && (
                              <div>
                                <span className="font-semibold">Código EPI:</span>{' '}
                                {tecnicaAsignada.muestraArray.codigo_epi}
                              </div>
                            )}
                            {tecnicaAsignada.muestraArray.codigo_externo && (
                              <div>
                                <span className="font-semibold">Código Externo:</span>{' '}
                                {tecnicaAsignada.muestraArray.codigo_externo}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <span className="font-semibold">Muestra:</span>{' '}
                            {tecnicaAsignada.muestra?.codigo_epi ||
                              tecnicaAsignada.muestra?.codigo_externo ||
                              'N/A'}
                          </div>
                        )}
                        {isAutoMapped && (
                          <div className="text-success-700 font-semibold">
                            ✓ Coincidencia automática{' '}
                            {row.posicionPlaca ? 'por posición de placa' : 'por código de muestra'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Errores de validación */}
          {errors.length > 0 && (
            <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <h4 className="text-sm font-semibold text-error-900 mb-2">Errores de validación:</h4>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-error-700">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-200 bg-surface-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirmar Importación
          </Button>
        </div>
      </div>
    </div>
  )
}
