// src/features/workList/pages/CreateWorklistPage.tsx

import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import {
  usePosiblesTecnicasProc,
  usePosiblesTecnicas,
  useCreateWorklist,
  useNextWorklistCodigo
} from '../hooks/useWorklists'
import { CreateWorklistRequest } from '../interfaces/worklist.types'
import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { TecnicasTable } from '../components/WorkListCreate/TecnicasTable'
import { useUser } from '@/shared/contexts/UserContext'
export const CreateWorklistPage = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  const [nombre, setNombre] = useState('')
  const [selectedTecnicaProc, setSelectedTecnicaProc] = useState('')
  const [selectedTecnicas, setSelectedTecnicas] = useState<Set<number>>(new Set())

  const { posiblesTecnicasProc, isLoading: loadingPosiblesTecnicasProc } = usePosiblesTecnicasProc()

  const {
    fetchCodigo: fetchWorklistCodigo,
    isLoading: isGeneratingCodigo,
    error: worklistCodigoError
  } = useNextWorklistCodigo()

  // 🎲 Generar nombre automáticamente cuando se selecciona un proceso
  const handleGenerateNombre = useCallback(
    async (tecnicaProc?: string) => {
      const proceso = tecnicaProc ?? selectedTecnicaProc
      if (!proceso) {
        return
      }

      try {
        const generated = await fetchWorklistCodigo()
        setNombre(generated.codigo_worklist)
      } catch (err) {
        console.error('Error al generar código de worklist:', err)
        alert('No se pudo generar el código del worklist. Por favor, intenta de nuevo.')
      }
    },
    [fetchWorklistCodigo, selectedTecnicaProc]
  )

  // Hook para crear worklist
  const createWorklist = useCreateWorklist()

  // Hook para obtener técnicas basado en el proceso seleccionado
  const {
    posiblesTecnicas,
    isLoading: loadingTecnicas,
    error: errorTecnicas
  } = usePosiblesTecnicas(selectedTecnicaProc)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim() || !selectedTecnicaProc) {
      alert('Por favor completa el nombre del worklist y selecciona un proceso.')
      return
    }

    if (selectedTecnicas.size === 0) {
      alert('Por favor selecciona al menos una técnica.')
      return
    }

    try {
      // Crear el worklist con la estructura exacta que espera el endpoint
      const worklistData: CreateWorklistRequest = {
        nombre,
        tecnica_proc: selectedTecnicaProc,
        tecnicas: Array.from(selectedTecnicas),
        created_by: user?.id || 0
      }

      await createWorklist.mutateAsync(worklistData)
      navigate('/worklist')
    } catch (error) {
      console.error('Error creating worklist:', error)
      alert('Error al crear el worklist. Por favor intenta de nuevo.')
    }
  }
  const handleTecnicaToggle = (tecnicaId: number) => {
    setSelectedTecnicas(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tecnicaId)) {
        newSet.delete(tecnicaId)
      } else {
        newSet.add(tecnicaId)
      }
      return newSet
    })
  }

  const handleSelectAll = (tecnicaIds: number[]) => {
    setSelectedTecnicas(prev => {
      const newSet = new Set(prev)
      tecnicaIds.forEach(id => newSet.add(id))
      return newSet
    })
  }

  const clearSelection = () => {
    setSelectedTecnicas(new Set())
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="accent"
            onClick={() => navigate('/worklist')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Worklist</h1>
            <p className="text-gray-600 mt-1">
              Selecciona un proceso y las técnicas que deseas incluir
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selección de Proceso */}
              <div>
                <Label htmlFor="proceso">Tipo de Proceso *</Label>
                <select
                  id="proceso"
                  value={selectedTecnicaProc}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const procesoNombre = e.target.value
                    setSelectedTecnicaProc(procesoNombre)

                    // Limpiar técnicas seleccionadas al cambiar de proceso
                    setSelectedTecnicas(new Set())

                    if (procesoNombre) {
                      handleGenerateNombre(procesoNombre)
                    } else {
                      setNombre('')
                    }
                  }}
                  required
                  disabled={loadingPosiblesTecnicasProc}
                  className="mt-1 block w-full border border-surface-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecciona un proceso</option>
                  {posiblesTecnicasProc?.map(proceso => (
                    <option key={proceso.tecnica_proc} value={proceso.tecnica_proc}>
                      {proceso.tecnica_proc}
                    </option>
                  ))}
                </select>
                {loadingPosiblesTecnicasProc && (
                  <p className="text-sm text-gray-500 mt-1">Cargando procesos...</p>
                )}
              </div>

              {/* Nombre del Worklist (auto-generado) */}
              <div>
                <Label htmlFor="nombre">Nombre del Worklist *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    disabled
                    placeholder="Se generará automáticamente"
                    required
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleGenerateNombre()}
                    disabled={!selectedTecnicaProc || isGeneratingCodigo}
                    title="Regenerar nombre"
                  >
                    <RefreshCw size={16} className={isGeneratingCodigo ? 'animate-spin' : ''} />
                  </Button>
                </div>
                {isGeneratingCodigo && (
                  <p className="text-xs text-gray-500 mt-1">Generando código...</p>
                )}
                {worklistCodigoError && (
                  <p className="text-xs text-danger-600 mt-1">
                    No se pudo generar el código. Inténtalo de nuevo.
                  </p>
                )}
                {nombre && !isGeneratingCodigo && !worklistCodigoError && (
                  <p className="text-xs text-gray-500 mt-1">Patrón: LYY.NNNNN</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Listar las Tecnicas asociadas al proceso seleccionado */}
        {selectedTecnicaProc && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Muestras Disponibles</h2>

            {loadingTecnicas ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando técnicas...</span>
              </div>
            ) : errorTecnicas ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">
                  Error al cargar las técnicas: {errorTecnicas.message}
                </p>
              </div>
            ) : posiblesTecnicas.length === 0 ? (
              <p className="text-gray-600">
                No hay técnicas disponibles para el proceso seleccionado.
              </p>
            ) : (
              <TecnicasTable
                tecnicas={posiblesTecnicas}
                selectedTecnicas={selectedTecnicas}
                onToggle={handleTecnicaToggle}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
              />
            )}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="ghost" onClick={() => navigate('/worklist')}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              !nombre.trim() ||
              !selectedTecnicaProc ||
              selectedTecnicas.size === 0 ||
              createWorklist.isPending
            }
          >
            {createWorklist.isPending ? 'Creando...' : 'Crear Worklist'}
          </Button>
        </div>
      </form>
    </div>
  )
}
