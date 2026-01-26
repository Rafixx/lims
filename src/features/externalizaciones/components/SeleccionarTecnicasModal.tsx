import { useMemo, useState } from 'react'
import { X, ChevronDown, ChevronRight, Grid3x3 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Input } from '@/shared/components/molecules/Input'
import { useTecnicasPendientesExternalizacion } from '@/features/muestras/hooks/useMuestras'
import { useExternalizarTecnicas } from '../hooks/useExternalizaciones'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Tecnica, MuestraArray } from '@/features/muestras/interfaces/muestras.types'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'

interface SeleccionarTecnicasModalProps {
  onClose: () => void
  onSuccess: () => void
}

// Extendemos Tecnica para incluir muestraArray si es tipo array
type TecnicaExtendida = Tecnica & {
  muestraArray?: MuestraArray
}

type TecnicaConSeleccion = TecnicaExtendida & {
  isArray?: boolean
}

export const SeleccionarTecnicasModal = ({ onClose, onSuccess }: SeleccionarTecnicasModalProps) => {
  const { tecnicas, isLoading } = useTecnicasPendientesExternalizacion()
  const externalizarMutation = useExternalizarTecnicas()
  const { notify } = useNotification()

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [busqueda, setBusqueda] = useState('')
  const [ordenamiento, setOrdenamiento] = useState<'estudio' | 'tecnica'>('estudio')
  const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set())

  // Convertir técnicas a técnicas extendidas
  const tecnicasExtendidas = tecnicas as TecnicaExtendida[]

  // Filtrar técnicas por búsqueda
  const searchFilter = useMemo(
    () =>
      createMultiFieldSearchFilter<Tecnica>(tecnica => [
        tecnica.muestra?.estudio,
        tecnica.muestra?.codigo_epi,
        tecnica.muestra?.codigo_externo,
        tecnica.tecnica_proc?.tecnica_proc
      ]),
    []
  )

  const tecnicasFiltradas = useMemo(() => {
    if (!busqueda) return tecnicasExtendidas
    return tecnicasExtendidas.filter(tecnica => searchFilter(tecnica, busqueda))
  }, [tecnicasExtendidas, busqueda, searchFilter])

  // Ordenar técnicas
  const tecnicasOrdenadas = useMemo(() => {
    const sorted = [...tecnicasFiltradas]
    sorted.sort((a, b) => {
      if (ordenamiento === 'estudio') {
        const estudioA = a.muestra?.estudio?.toLowerCase() || ''
        const estudioB = b.muestra?.estudio?.toLowerCase() || ''
        if (estudioA !== estudioB) return estudioA.localeCompare(estudioB)
      }
      const tecnicaA = a.tecnica_proc?.tecnica_proc?.toLowerCase() || ''
      const tecnicaB = b.tecnica_proc?.tecnica_proc?.toLowerCase() || ''
      return tecnicaA.localeCompare(tecnicaB)
    })
    return sorted
  }, [tecnicasFiltradas, ordenamiento])

  // Agrupar técnicas por muestra tipo array
  const tecnicasAgrupadas = useMemo(() => {
    const grupos: { [key: string]: TecnicaConSeleccion[] } = {}
    const individuales: TecnicaConSeleccion[] = []

    tecnicasOrdenadas.forEach(tecnica => {
      if (tecnica.muestra?.tipo_array) {
        const key = `${tecnica.muestra.id_muestra}-${tecnica.tecnica_proc?.id || 0}`
        if (!grupos[key]) {
          grupos[key] = []
        }
        grupos[key].push({
          ...tecnica,
          isArray: true
        })
      } else {
        individuales.push({ ...tecnica, isArray: false })
      }
    })

    return { grupos, individuales }
  }, [tecnicasOrdenadas])

  // Handlers de selección
  const handleSelectTecnica = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleArrayExpanded = (key: string) => {
    const newExpanded = new Set(expandedArrays)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedArrays(newExpanded)
  }

  const handleSelectArray = (tecnicas: TecnicaConSeleccion[]) => {
    const newSelected = new Set(selectedIds)
    const allSelected = tecnicas.every(t => newSelected.has(t.id_tecnica))

    if (allSelected) {
      tecnicas.forEach(t => newSelected.delete(t.id_tecnica))
    } else {
      tecnicas.forEach(t => newSelected.add(t.id_tecnica))
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === tecnicasOrdenadas.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(tecnicasOrdenadas.map(t => t.id_tecnica)))
    }
  }

  // Handler para externalizar
  const handleExternalizar = async () => {
    if (selectedIds.size === 0) {
      notify('Debe seleccionar al menos una técnica', 'warning')
      return
    }

    try {
      const result = await externalizarMutation.mutateAsync(Array.from(selectedIds))

      // Mostrar resultados según éxitos y fallos
      if (result.failed.length === 0) {
        // Todas exitosas
        notify(`${result.successful.length} técnica(s) externalizada(s) correctamente`, 'success')
        onSuccess()
        onClose()
      } else if (result.successful.length === 0) {
        // Todas fallaron
        if (result.failed.length === 1) {
          // Una sola técnica, mostrar el error específico del backend
          notify(result.failed[0].error, 'error')
        } else {
          // Múltiples técnicas fallaron - agrupar por tipo de error
          const errorCounts = result.failed.reduce(
            (acc, f) => {
              acc[f.error] = (acc[f.error] || 0) + 1
              return acc
            },
            {} as Record<string, number>
          )

          // Si todos los errores son del mismo tipo, mostrar ese mensaje
          const uniqueErrors = Object.keys(errorCounts)
          if (uniqueErrors.length === 1) {
            notify(`${uniqueErrors[0]} (${result.failed.length} técnicas)`, 'error')
          } else {
            // Mostrar resumen de errores
            notify(
              `No se pudo externalizar ninguna técnica. ${result.failed.length} error(es) encontrado(s). Revisa la consola para detalles.`,
              'error'
            )
          }

          // Log de errores para debugging
          console.error('Errores de externalización:', result.failed)
          console.table(
            result.failed.map(f => ({
              'ID Técnica': f.id_tecnica,
              Error: f.error
            }))
          )
        }
      } else {
        // Éxito parcial
        notify(
          `${result.successful.length} técnica(s) externalizada(s), ${result.failed.length} fallaron. Revisa la consola para detalles.`,
          'warning'
        )
        console.warn('Errores de externalización:', result.failed)

        // Refrescar datos y cerrar modal después de éxito parcial
        onSuccess()
        onClose()
      }
    } catch (error: unknown) {
      console.error('Error externalizando técnicas:', error)
      notify('Error inesperado al externalizar las técnicas', 'error')
    }
  }

  const allSelected = tecnicasOrdenadas.length > 0 && selectedIds.size === tecnicasOrdenadas.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">
            Añadir Muestras/Técnicas a Externalización
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros y acciones */}
        <div className="p-6 border-b border-surface-200 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Buscar por estudio, código, técnica..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={ordenamiento === 'estudio' ? 'primary' : 'secondary'}
                onClick={() => setOrdenamiento('estudio')}
              >
                Ordenar por Estudio
              </Button>
              <Button
                variant={ordenamiento === 'tecnica' ? 'primary' : 'secondary'}
                onClick={() => setOrdenamiento('tecnica')}
              >
                Ordenar por Técnica
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-surface-700">
                {selectedIds.size > 0
                  ? `${selectedIds.size} técnica(s) seleccionada(s)`
                  : 'Seleccionar todas'}
              </span>
            </div>
            <span className="text-sm text-surface-500">
              Total: {tecnicasOrdenadas.length} técnica(s) disponible(s)
            </span>
          </div>
        </div>

        {/* Lista de técnicas */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8 text-surface-500">Cargando técnicas...</div>
          ) : tecnicasOrdenadas.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              No hay técnicas pendientes de externalización
            </div>
          ) : (
            <div className="space-y-4">
              {/* Técnicas tipo array agrupadas */}
              {Object.entries(tecnicasAgrupadas.grupos).map(([key, tecnicas]) => {
                const allGroupSelected = tecnicas.every(t => selectedIds.has(t.id_tecnica))
                const someGroupSelected = tecnicas.some(t => selectedIds.has(t.id_tecnica))
                const muestra = tecnicas[0].muestra
                const tecnicaProc = tecnicas[0].tecnica_proc
                const codigoPlaca = tecnicas[0].muestraArray?.codigo_placa
                const isExpanded = expandedArrays.has(key)
                const selectedCount = tecnicas.filter(t => selectedIds.has(t.id_tecnica)).length

                return (
                  <div
                    key={key}
                    className="border border-primary-200 rounded-lg bg-primary-50/30 overflow-hidden"
                  >
                    {/* Header colapsable */}
                    <div className="flex items-center gap-3 p-4">
                      <input
                        type="checkbox"
                        checked={allGroupSelected}
                        ref={input => {
                          if (input) {
                            input.indeterminate = someGroupSelected && !allGroupSelected
                          }
                        }}
                        onChange={() => handleSelectArray(tecnicas)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />

                      <button
                        onClick={() => toggleArrayExpanded(key)}
                        className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        )}

                        <Grid3x3 className="w-4 h-4 text-primary-600 flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-surface-900 flex items-center gap-2 flex-wrap">
                            <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-xs font-medium">
                              PLACA
                            </span>
                            <span>{muestra?.estudio} - {tecnicaProc?.tecnica_proc}</span>
                          </div>
                          <div className="text-sm text-surface-600 mt-1">
                            {codigoPlaca && (
                              <span className="font-mono bg-white px-2 py-0.5 rounded mr-2">
                                {codigoPlaca}
                              </span>
                            )}
                            Código: {muestra?.codigo_epi || muestra?.codigo_externo}
                            <span className="mx-2">•</span>
                            {tecnicas.length} posiciones
                            {selectedCount > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="text-primary-600 font-medium">
                                  {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Técnicas individuales del array (colapsable) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 ml-7">
                        <div className="grid grid-cols-8 gap-2">
                          {tecnicas.map(tecnica => {
                            const tooltipParts = [
                              `Posición: ${tecnica.muestraArray?.posicion_placa || '-'}`
                            ]
                            if (tecnica.muestraArray?.codigo_epi) {
                              tooltipParts.push(`EPI: ${tecnica.muestraArray.codigo_epi}`)
                            }
                            if (tecnica.muestraArray?.codigo_externo) {
                              tooltipParts.push(`Ext: ${tecnica.muestraArray.codigo_externo}`)
                            }
                            const tooltipText = tooltipParts.join(' | ')

                            return (
                              <button
                                key={tecnica.id_tecnica}
                                onClick={() => handleSelectTecnica(tecnica.id_tecnica)}
                                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                  selectedIds.has(tecnica.id_tecnica)
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white border border-surface-300 text-surface-700 hover:bg-surface-50'
                                }`}
                                title={tooltipText}
                              >
                                {tecnica.muestraArray?.posicion_placa || `ID ${tecnica.id_tecnica}`}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Técnicas individuales */}
              {tecnicasAgrupadas.individuales.map(tecnica => {
                const isSelected = selectedIds.has(tecnica.id_tecnica)

                return (
                  <div
                    key={tecnica.id_tecnica}
                    className="border border-surface-200 rounded-lg p-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTecnica(tecnica.id_tecnica)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-semibold text-surface-900">
                            {tecnica.muestra?.estudio}
                          </div>
                          <div className="text-xs text-surface-500">
                            {tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-700">
                            {tecnica.tecnica_proc?.tecnica_proc}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-surface-500">
                            {tecnica.estadoInfo?.estado || 'Sin estado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-200 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExternalizar}
            disabled={selectedIds.size === 0 || externalizarMutation.isPending}
          >
            {externalizarMutation.isPending
              ? 'Externalizando...'
              : `Externalizar ${selectedIds.size > 0 ? `(${selectedIds.size})` : ''}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
