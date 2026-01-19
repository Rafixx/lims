// src/features/workList/pages/WorkListsPage.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorklists, useDeleteWorklist } from '../hooks/useWorklists'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, Search, BarChart3 } from 'lucide-react'
import { WorkListListHeader } from '../components/WorkListList/WorkListListHeader'
import { WorkListListDetail } from '../components/WorkListList/WorkListListDetail'
import { Worklist } from '@/features/muestras/interfaces/muestras.types'

// Configuración de columnas para los WorkLists
const WORKLIST_COLUMNS = [
  { label: 'Nombre', span: 3, sortKey: 'nombre' },
  { label: 'Técnica/Proceso', span: 2, sortKey: 'tecnica_proc' },
  { label: 'Total', span: 1, sortKey: 'total' },
  { label: 'Completadas', span: 1, sortKey: 'completadas' },
  { label: 'Progreso', span: 2, sortKey: 'progreso' },
  { label: 'Fecha Creación', span: 2, sortKey: 'create_dt' },
  { label: '', span: 1 }
]

export const WorkListsPage = () => {
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string>('create_dt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Queries
  const { worklists, isLoading, error, refetch } = useWorklists()

  // Mutations
  const deleteWorklist = useDeleteWorklist()
  
  const handleEditWorklist = (worklist: Worklist) => {
    navigate(`/worklist/${worklist.id_worklist}/editar`)
  }

  const handleDeleteWorklist = async (id: number, nombre: string) => {
    const confirmed = await confirm({
      title: 'Eliminar Worklist',
      message: `¿Está seguro de eliminar el worklist "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todas las asignaciones asociadas.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (!confirmed) return

    try {
      await deleteWorklist.mutateAsync(id)
      notify('Worklist eliminado correctamente', 'success')
      refetch()
    } catch (error) {
      notify('Error al eliminar el worklist', 'error')
      console.error('Error deleting worklist:', error)
    }
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Cambiar dirección si es la misma columna
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Nueva columna, ordenar ascendente por defecto
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredWorklists =
    worklists?.filter(
      worklist =>
        worklist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worklist.tecnica_proc?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Ordenar worklists
  const sortedWorklists = [...filteredWorklists].sort((a, b) => {
    let compareValue = 0

    switch (sortKey) {
      case 'nombre':
        compareValue = a.nombre.localeCompare(b.nombre)
        break
      case 'tecnica_proc':
        compareValue = (a.tecnica_proc || '').localeCompare(b.tecnica_proc || '')
        break
      case 'total':
        compareValue = (a.tecnicas?.length || 0) - (b.tecnicas?.length || 0)
        break
      case 'completadas': {
        const completadasA =
          a.tecnicas?.filter(t => t.id_estado === 10 /* COMPLETADA_TECNICA */).length || 0
        const completadasB =
          b.tecnicas?.filter(t => t.id_estado === 10 /* COMPLETADA_TECNICA */).length || 0
        compareValue = completadasA - completadasB
        break
      }
      case 'progreso': {
        const totalA = a.tecnicas?.length || 0
        const completadasA =
          a.tecnicas?.filter(t => t.id_estado === 10 /* COMPLETADA_TECNICA */).length || 0
        const progresoA = totalA > 0 ? (completadasA / totalA) * 100 : 0

        const totalB = b.tecnicas?.length || 0
        const completadasB =
          b.tecnicas?.filter(t => t.id_estado === 10 /* COMPLETADA_TECNICA */).length || 0
        const progresoB = totalB > 0 ? (completadasB / totalB) * 100 : 0

        compareValue = progresoA - progresoB
        break
      }
      case 'create_dt':
        compareValue = new Date(a.create_dt).getTime() - new Date(b.create_dt).getTime()
        break
      default:
        compareValue = 0
    }

    return sortDirection === 'asc' ? compareValue : -compareValue
  })

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
      {sortedWorklists.length === 0 ? (
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
          <WorkListListHeader
            fieldList={WORKLIST_COLUMNS}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          {sortedWorklists.map(worklist => (
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
