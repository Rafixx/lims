// src/features/workList/pages/WorkListsPage.tsx

import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorklists, useDeleteWorklist, useProcesosDisponibles } from '../hooks/useWorklistsNew'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, Search, Trash2, Settings, BarChart3, Clock, CheckCircle } from 'lucide-react'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import type { Worklist } from '../interfaces/worklist.types'

export const WorkListsPage = () => {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const { data: worklists, isLoading, error, refetch } = useWorklists()
  const { data: procesos } = useProcesosDisponibles()

  // Mutations
  const deleteWorklist = useDeleteWorklist()

  const handleDeleteWorklist = async (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el worklist "${nombre}"?`)) {
      try {
        await deleteWorklist.mutateAsync(id)
        refetch()
      } catch (error) {
        console.error('Error deleting worklist:', error)
      }
    }
  }

  const filteredWorklists =
    worklists?.filter(
      worklist =>
        worklist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worklist.dim_tecnicas_proc?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const getProcesoNombre = (dimTecnicasProc?: string) => {
    const proceso = procesos?.find(p => p.dim_tecnicas_proc === dimTecnicasProc)
    return proceso?.descripcion || dimTecnicasProc || 'Sin proceso'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando worklists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los worklists</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worklists</h1>
            <p className="text-gray-600 mt-2">Gestiona las listas de trabajo del laboratorio</p>
          </div>
          <Button onClick={() => navigate('/worklist/nuevo')} className="flex items-center gap-2">
            <Plus size={20} />
            Nuevo Worklist
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o proceso..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Worklists Grid */}
      {filteredWorklists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay worklists</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? 'No se encontraron worklists que coincidan con tu búsqueda.'
              : 'Comienza creando tu primer worklist.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate('/worklist/nuevo')}>Crear primer Worklist</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorklists.map(worklist => (
            <WorklistCard
              key={worklist.id_worklist}
              worklist={worklist}
              procesoNombre={getProcesoNombre(worklist.dim_tecnicas_proc)}
              onDelete={handleDeleteWorklist}
              onView={() => navigate(`/worklist/${worklist.id_worklist}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Componente para cada tarjeta de worklist
interface WorklistCardProps {
  worklist: Worklist
  procesoNombre: string
  onDelete: (id: number, nombre: string) => void
  onView: () => void
}

const WorklistCard: React.FC<WorklistCardProps> = ({
  worklist,
  procesoNombre,
  onDelete,
  onView
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const completionPercentage = worklist.total_tecnicas
    ? Math.round(((worklist.tecnicas_completadas || 0) / worklist.total_tecnicas) * 100)
    : 0

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div onClick={onView} className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{worklist.nombre}</h3>
            <div className="text-sm text-gray-600">{procesoNombre}</div>
          </div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              onClick={() => onDelete(worklist.id_worklist, worklist.nombre)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart3 size={16} />
              <span>Total técnicas</span>
            </div>
            <span className="font-medium">{worklist.total_tecnicas || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={16} />
              <span>Completadas</span>
            </div>
            <span className="font-medium">{worklist.tecnicas_completadas || 0}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {completionPercentage}% completado
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Creado: {formatDate(worklist.create_dt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
