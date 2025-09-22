// src/features/workList/pages/CreateWorklistPage.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useProcesosDisponibles,
  useTecnicasSinAsignar,
  useCreateWorklist
} from '../hooks/useWorklists'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, Search, CheckCircle, Circle, User, Calendar, AlertTriangle } from 'lucide-react'
import type { TecnicaSinAsignar, TecnicaSeleccionable } from '../interfaces/worklist.types'

export const CreateWorklistPage = () => {
  const navigate = useNavigate()

  // Estados del formulario
  const [nombre, setNombre] = useState('')
  const [selectedProceso, setSelectedProceso] = useState('')
  const [tecnicasSeleccionadas, setTecnicasSeleccionadas] = useState<TecnicaSeleccionable[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const { data: procesos, isLoading: loadingProcesos } = useProcesosDisponibles()
  const { data: tecnicasSinAsignar, isLoading: loadingTecnicas } =
    useTecnicasSinAsignar(selectedProceso)

  // Mutations
  const createWorklist = useCreateWorklist()

  // Actualizar técnicas seleccionables cuando cambien las técnicas sin asignar
  useEffect(() => {
    if (tecnicasSinAsignar) {
      const tecnicasConSeleccion: TecnicaSeleccionable[] = tecnicasSinAsignar.map(tecnica => ({
        ...tecnica,
        seleccionada: false
      }))
      setTecnicasSeleccionadas(tecnicasConSeleccion)
    }
  }, [tecnicasSinAsignar])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim() || !selectedProceso) {
      return
    }

    const tecnicasIds = tecnicasSeleccionadas.filter(t => t.seleccionada).map(t => t.id)

    if (tecnicasIds.length === 0) {
      return
    }

    try {
      await createWorklist.mutateAsync({
        nombre: nombre.trim(),
        dim_tecnicas_proc: selectedProceso,
        tecnicas_seleccionadas: tecnicasIds
      })

      navigate('/worklist')
    } catch (error) {
      console.error('Error creating worklist:', error)
    }
  }

  const toggleTecnica = (id: number) => {
    setTecnicasSeleccionadas(prev =>
      prev.map(tecnica =>
        tecnica.id === id ? { ...tecnica, seleccionada: !tecnica.seleccionada } : tecnica
      )
    )
  }

  const toggleAll = () => {
    const allSelected = tecnicasSeleccionadas.every(t => t.seleccionada)
    setTecnicasSeleccionadas(prev =>
      prev.map(tecnica => ({
        ...tecnica,
        seleccionada: !allSelected
      }))
    )
  }

  const filteredTecnicas = tecnicasSeleccionadas.filter(
    tecnica =>
      (tecnica.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tecnica.paciente_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tecnica.proceso_nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCount = tecnicasSeleccionadas.filter(t => t.seleccionada).length
  const totalCount = tecnicasSeleccionadas.length

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Worklist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Worklist *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Análisis Microbiología - Lunes"
                required
              />
            </div>

            {/* Selección de Proceso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Proceso *
              </label>
              <select
                value={selectedProceso}
                onChange={e => setSelectedProceso(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loadingProcesos}
              >
                <option value="">Seleccionar proceso...</option>
                {procesos?.map(proceso => (
                  <option key={proceso.dim_tecnicas_proc} value={proceso.tecnica_proc}>
                    {proceso.tecnica_proc || proceso.dim_tecnicas_proc}(
                    {proceso.total_tecnicas_disponibles} técnicas disponibles)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Selección de Técnicas */}
        {selectedProceso && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Seleccionar Técnicas ({selectedCount}/{totalCount})
              </h2>

              {totalCount > 0 && (
                <Button
                  type="button"
                  variant="accent"
                  onClick={toggleAll}
                  className="flex items-center gap-2"
                >
                  {tecnicasSeleccionadas.every(t => t.seleccionada) ? (
                    <>
                      <CheckCircle size={16} /> Desmarcar todas
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Marcar todas
                    </>
                  )}
                </Button>
              )}
            </div>

            {loadingTecnicas ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando técnicas...</span>
              </div>
            ) : totalCount === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay técnicas disponibles
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No existen técnicas sin asignar para este proceso.
                </p>
              </div>
            ) : (
              <>
                {/* Búsqueda */}
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por código, paciente o proceso..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Lista de Técnicas */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTecnicas.map(tecnica => (
                    <TecnicaItem
                      key={tecnica.id}
                      tecnica={tecnica}
                      onToggle={() => toggleTecnica(tecnica.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="primary" onClick={() => navigate('/worklist')}>
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={
              !nombre.trim() || !selectedProceso || selectedCount === 0 || createWorklist.isPending
            }
          >
            {createWorklist.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              `Crear Worklist (${selectedCount} técnicas)`
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Componente para cada item de técnica
interface TecnicaItemProps {
  tecnica: TecnicaSeleccionable
  onToggle: () => void
}

const TecnicaItem: React.FC<TecnicaItemProps> = ({ tecnica, onToggle }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div
      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
        tecnica.seleccionada
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center">
        {tecnica.seleccionada ? (
          <CheckCircle className="text-blue-600" size={20} />
        ) : (
          <Circle className="text-gray-400" size={20} />
        )}
      </div>

      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-gray-900">{tecnica.codigo}</div>
            <div className="text-sm text-gray-600 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User size={14} />
                {tecnica.paciente_nombre}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(tecnica.fecha_creacion)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{tecnica.proceso_nombre}</div>
            <div className="text-xs text-gray-500">Prioridad: {tecnica.prioridad}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
