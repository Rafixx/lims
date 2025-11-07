// src/features/tecnicasReactivos/pages/LotesPage.tsx

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  useWorklistTecnicasReactivosOptimizado,
  useBatchUpsertLotes
} from '../hooks/useTecnicasReactivos'
import type { BatchUpdateItem } from '../interfaces/tecnicaReactivo.types'
import { Button } from '@/shared/components/molecules/Button'
import { Modal } from '@/shared/components/molecules/Modal'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

interface LoteFormData {
  [key: string]: {
    // key es "idTecnicaReactivo"
    idTecnicaReactivo: number
    idTecnica: number
    idReactivo: number
    lote: string
    volumen: string
  }
}

export default function LotesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const worklistId = id ? parseInt(id) : 0
  const { notify } = useNotification()

  const { data: worklistData, isLoading, error, refetch } =
    useWorklistTecnicasReactivosOptimizado(worklistId)
  const batchMutation = useBatchUpsertLotes()

  const [formData, setFormData] = useState<LoteFormData>({})
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formData cuando se cargan los datos (ESTRUCTURA OPTIMIZADA)
  useEffect(() => {
    if (!worklistData) return

    console.log('🔍 [LotesPage] worklistData optimizada recibida:', worklistData)
    console.log('📊 [LotesPage] Estadísticas:', worklistData.estadisticas)

    const initialData: LoteFormData = {}

    worklistData.tecnicas.forEach(tecnica => {
      console.log('🔍 [LotesPage] Procesando técnica:', {
        idTecnica: tecnica.idTecnica,
        nombreTecnica: tecnica.nombreTecnica,
        muestra: tecnica.muestra
      })

      tecnica.reactivos.forEach(reactivo => {
        console.log('🔍 [LotesPage] Reactivo:', {
          id: reactivo.id,
          idTecnicaReactivo: reactivo.idTecnicaReactivo,
          nombre: reactivo.nombre,
          lote: reactivo.lote,
          volumen: reactivo.volumen
        })

        const key = reactivo.idTecnicaReactivo.toString()
        initialData[key] = {
          idTecnicaReactivo: reactivo.idTecnicaReactivo,
          idTecnica: tecnica.idTecnica,
          idReactivo: reactivo.id,
          lote: reactivo.lote || '',
          volumen: reactivo.volumen || ''
        }
      })
    })

    console.log('🔍 [LotesPage] FormData inicializada:', initialData)
    setFormData(initialData)
  }, [worklistData])

  const handleInputChange = (key: string, field: 'lote' | 'volumen', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    console.log('💾 [LotesPage] Iniciando guardado con BATCH UPDATE...')
    console.log('💾 [LotesPage] FormData a guardar:', formData)

    try {
      // Preparar array de updates para el batch endpoint
      const updates: BatchUpdateItem[] = Object.values(formData).map((data, index) => {
        console.log(`💾 [LotesPage] Preparando update ${index + 1}:`, {
          id: data.idTecnicaReactivo,
          lote: data.lote,
          volumen: data.volumen
        })

        return {
          id: data.idTecnicaReactivo,
          lote: data.lote,
          volumen: data.volumen
        }
      })

      console.log(`💾 [LotesPage] Enviando batch con ${updates.length} items`)

      // UNA SOLA LLAMADA para todos los updates
      const result = await batchMutation.mutateAsync(updates)

      console.log('✅ [LotesPage] Batch completado:', result)

      // Refrescar datos
      await refetch()

      // Notificación detallada
      if (result.success) {
        const messages = []
        if (result.updated > 0)
          messages.push(`${result.updated} actualizado${result.updated !== 1 ? 's' : ''}`)
        if (result.created > 0)
          messages.push(`${result.created} creado${result.created !== 1 ? 's' : ''}`)

        notify(messages.join(', '), 'success')

        if (result.failed > 0) {
          notify(
            `⚠️ ${result.failed} operación${result.failed !== 1 ? 'es' : ''} fallaron`,
            'warning'
          )
        }
      }

      handleClose()
    } catch (error) {
      console.error('❌ [LotesPage] Error en batch update:', error)
      notify('Error al actualizar lotes. Por favor, revise e intente nuevamente.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    navigate(`/worklist/${worklistId}`)
  }

  if (isLoading) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Gestión de Lotes"
        widthClass="w-full max-w-6xl"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando lotes...</div>
        </div>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Gestión de Lotes"
        widthClass="w-full max-w-6xl"
      >
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error al cargar los lotes: {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </Modal>
    )
  }

  if (!worklistData || worklistData.tecnicas.length === 0) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Gestión de Lotes"
        widthClass="w-full max-w-6xl"
      >
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          No hay técnicas disponibles para este worklist
        </div>
      </Modal>
    )
  }

  // Mostrar estadísticas del worklist
  const { estadisticas } = worklistData
  const progreso =
    estadisticas.totalReactivos > 0
      ? (estadisticas.lotesCompletos / estadisticas.totalReactivos) * 100
      : 0

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Gestión de Lotes y Volúmenes"
      widthClass="w-full max-w-6xl"
    >
      {/* Estadísticas globales */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Progreso de Lotes</h3>
          <span className="text-sm text-gray-600">
            {estadisticas.lotesCompletos} / {estadisticas.totalReactivos} completados
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {worklistData.tecnicas.map(tecnica => {
          const codigoMuestra =
            tecnica.muestra.codigoEpi || tecnica.muestra.codigoExterno || 'Sin código'
          const nombreTecnica = tecnica.nombreTecnica

          return (
            <div key={tecnica.idTecnica} className="bg-gray-50 rounded-lg p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Muestra: <span className="font-mono text-blue-600">{codigoMuestra}</span>
                </h2>
                <h3 className="text-sm text-gray-600">
                  Técnica: <span className="font-mono">{nombreTecnica}</span>
                </h3>
              </div>

              {tecnica.reactivos.length === 0 ? (
                <p className="text-gray-500 italic text-sm">
                  No hay reactivos asignados a esta técnica
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 bg-white rounded">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                          Reactivo
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                          Lote
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                          Volumen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tecnica.reactivos.map(reactivo => {
                        const key = reactivo.idTecnicaReactivo.toString()
                        const currentData = formData[key] || {
                          idTecnicaReactivo: reactivo.idTecnicaReactivo,
                          idTecnica: tecnica.idTecnica,
                          idReactivo: reactivo.id,
                          lote: reactivo.lote || '',
                          volumen: reactivo.volumen || ''
                        }

                        return (
                          <tr key={reactivo.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {reactivo.nombre}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={currentData.lote}
                                onChange={e => handleInputChange(key, 'lote', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Número de lote"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={currentData.volumen}
                                onChange={e => handleInputChange(key, 'volumen', e.target.value)}
                                className="w-32 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Volumen"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar todos los cambios'}
        </Button>
      </div>
    </Modal>
  )
}
