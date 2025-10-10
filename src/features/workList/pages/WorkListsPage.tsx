// src/features/workList/pages/WorkListsPage.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorklists } from '../hooks/useWorklists'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, Search, BarChart3 } from 'lucide-react'
import { WorkListListHeader } from '../components/WorkListList/WorkListListHeader'
import { WorkListListDetail } from '../components/WorkListList/WorkListListDetail'
import { Worklist } from '@/features/muestras/interfaces/muestras.types'

// Configuración de columnas para los WorkLists
const WORKLIST_COLUMNS = [
  { label: 'Nombre', span: 3 },
  { label: 'Técnica/Proceso', span: 2 },
  { label: 'Total', span: 1 },
  { label: 'Completadas', span: 1 },
  { label: 'Progreso', span: 2 },
  { label: 'Fecha Creación', span: 2 },
  { label: '', span: 1 }
]

export const WorkListsPage = () => {
  const navigate = useNavigate()
  // const { notify } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const { worklists, isLoading, error, refetch } = useWorklists()

  // Mutations
  // const deleteWorklist = useDeleteWorklist()
  const handleEditWorklist = (worklist: Worklist) => {
    navigate(`/worklist/${worklist.id_worklist}/editar`)
  }

  const handleDeleteWorklist = async (id: number, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el worklist "${nombre}"?`)) {
      try {
        // await deleteWorklist.mutateAsync(id)
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
        worklist.tecnica_proc?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

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
            <h1 className="text-3xl font-bold text-gray-900">Listas de trabajo</h1>
            <p className="text-gray-600 mt-2">Gestiona las listas de trabajo del laboratorio</p>
          </div>
          <Button
            variant="accent"
            onClick={() => navigate('/worklist/nuevo')}
            className="flex items-center gap-2"
          >
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

      {/* Worklists List */}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <WorkListListHeader fieldList={WORKLIST_COLUMNS} />
          {filteredWorklists.map(worklist => (
            <WorkListListDetail
              key={worklist.id_worklist}
              worklist={worklist}
              onEdit={handleEditWorklist}
              onDelete={handleDeleteWorklist}
              // onView={() => navigate(`/worklist/${worklist.id_worklist}`)}
              fieldSpans={WORKLIST_COLUMNS.map(col => col.span)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
