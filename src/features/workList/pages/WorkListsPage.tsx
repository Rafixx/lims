// src/features/workList/pages/WorkListsPage.tsx

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorklists, useDeleteWorklist } from '../hooks/useWorklists'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { Plus, Search, ClipboardList } from 'lucide-react'
import { WorkListListHeader } from '../components/WorkListList/WorkListListHeader'
import { WorkListListDetail } from '../components/WorkListList/WorkListListDetail'
import { Worklist } from '../interfaces/worklist.types'
import { ESTADO_TECNICA } from '@/shared/interfaces/estados.types'

// 4 + 3 + 3 + 1 + 1 = 12
const WORKLIST_COLUMNS = [
  { label: 'Lista de trabajo', span: 4, sortKey: 'nombre' },
  { label: 'Técnica / Proceso', span: 3, sortKey: 'tecnica_proc' },
  { label: 'Avance', span: 3, sortKey: 'progreso' },
  { label: 'Creado', span: 1, sortKey: 'create_dt' },
  { label: 'Acciones', span: 1, className: 'text-right' }
]

export const WorkListsPage = () => {
  const navigate = useNavigate()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string>('create_dt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const { worklists, isLoading, error, refetch } = useWorklists()
  const deleteWorklist = useDeleteWorklist()

  const handleEditWorklist = (worklist: Worklist) => {
    navigate(`/worklist/${worklist.id_worklist}/editar`)
  }

  const handleDeleteWorklist = async (id: number, nombre: string) => {
    const confirmed = await confirm({
      title: 'Eliminar lista de trabajo',
      message: `¿Está seguro de eliminar "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todas las asignaciones asociadas.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })
    if (!confirmed) return
    try {
      await deleteWorklist.mutateAsync(id)
      notify('Lista de trabajo eliminada correctamente', 'success')
      refetch()
    } catch (error) {
      notify('Error al eliminar la lista de trabajo', 'error')
      console.error('Error deleting worklist:', error)
    }
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredWorklists = useMemo(
    () =>
      worklists?.filter(
        w =>
          w.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.tecnica_proc?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [worklists, searchTerm]
  )

  const sortedWorklists = useMemo(() => {
    return [...filteredWorklists].sort((a, b) => {
      let v = 0
      switch (sortKey) {
        case 'nombre':
          v = a.nombre.localeCompare(b.nombre)
          break
        case 'tecnica_proc':
          v = (a.tecnica_proc || '').localeCompare(b.tecnica_proc || '')
          break
        case 'progreso': {
          const pct = (w: Worklist) => {
            const t = w.tecnicas?.length || 0
            const c = w.tecnicas?.filter(x => x.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA).length || 0
            return t > 0 ? c / t : 0
          }
          v = pct(a) - pct(b)
          break
        }
        case 'create_dt':
          v = new Date(a.create_dt).getTime() - new Date(b.create_dt).getTime()
          break
        default:
          v = 0
      }
      return sortDirection === 'asc' ? v : -v
    })
  }, [filteredWorklists, sortKey, sortDirection])

  // Stats rápidas
  const stats = useMemo(() => {
    const total = worklists?.length || 0
    const inProgress = worklists?.filter(w => {
      const t = w.tecnicas?.length || 0
      const c = w.tecnicas?.filter(x => x.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA).length || 0
      return t > 0 && c > 0 && c < t
    }).length || 0
    const completed = worklists?.filter(w => {
      const t = w.tecnicas?.length || 0
      const c = w.tecnicas?.filter(x => x.id_estado === ESTADO_TECNICA.COMPLETADA_TECNICA).length || 0
      return t > 0 && c === t
    }).length || 0
    return { total, inProgress, completed }
  }, [worklists])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-surface-500">Cargando listas de trabajo…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <p className="text-danger-600 text-sm">Error al cargar las listas de trabajo</p>
          <Button variant="soft" onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            Listas de trabajo
          </h1>
          {worklists && worklists.length > 0 && (
            <div className="flex items-center gap-5 mt-1.5 text-sm text-surface-500">
              <span>
                <span className="font-semibold text-surface-700">{stats.total}</span> listas
              </span>
              {stats.inProgress > 0 && (
                <span>
                  <span className="font-semibold text-primary-700">{stats.inProgress}</span> en progreso
                </span>
              )}
              {stats.completed > 0 && (
                <span>
                  <span className="font-semibold text-success-700">{stats.completed}</span> completadas
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          variant="accent"
          onClick={() => navigate('/worklist/nuevo')}
          className="flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          Nueva lista
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="relative w-72">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
          size={15}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o proceso…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-lg bg-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista */}
      {sortedWorklists.length === 0 ? (
        <div className="text-center py-16 bg-white border border-surface-100 rounded-xl">
          <ClipboardList size={40} className="mx-auto text-surface-300 mb-3" />
          <h3 className="text-sm font-semibold text-surface-700 mb-1">
            {searchTerm ? 'Sin resultados' : 'No hay listas de trabajo'}
          </h3>
          <p className="text-sm text-surface-400 max-w-xs mx-auto">
            {searchTerm
              ? `No se encontraron listas que coincidan con "${searchTerm}".`
              : 'Crea tu primera lista de trabajo para comenzar.'}
          </p>
          {!searchTerm && (
            <Button
              variant="soft"
              className="mt-4"
              onClick={() => navigate('/worklist/nuevo')}
            >
              Crear primera lista
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-100 overflow-hidden shadow-soft">
          <WorkListListHeader
            fieldList={WORKLIST_COLUMNS}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          {sortedWorklists.map((worklist, index) => (
            <WorkListListDetail
              key={worklist.id_worklist}
              worklist={worklist}
              onEdit={handleEditWorklist}
              onDelete={handleDeleteWorklist}
              fieldSpans={WORKLIST_COLUMNS.map(col => col.span)}
              isLast={index === sortedWorklists.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
