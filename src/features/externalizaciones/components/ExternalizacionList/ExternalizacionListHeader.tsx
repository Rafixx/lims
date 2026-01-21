import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export type SortField = 'muestra' | 'tecnica' | 'agencia' | 'fecha' | 'estado'
export type SortDirection = 'asc' | 'desc' | null

export type ExternalizacionListHeaderProps = {
  sortField: SortField | null
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export const ExternalizacionListHeader = ({
  sortField,
  sortDirection,
  onSort
}: ExternalizacionListHeaderProps) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-surface-400" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 text-primary-600" />
    }
    return <ArrowDown className="w-3 h-3 text-primary-600" />
  }

  const getSortableClass = (field: SortField) => {
    const baseClass = 'flex items-center gap-1 cursor-pointer hover:text-primary-600 transition-colors'
    return sortField === field ? `${baseClass} text-primary-600` : baseClass
  }

  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-surface-100 rounded-lg shadow-soft">
      <div className="col-span-1 text-sm font-semibold text-surface-700"></div>

      <div className="col-span-2 text-sm font-semibold text-surface-700">
        <button onClick={() => onSort('muestra')} className={getSortableClass('muestra')}>
          Muestra
          {renderSortIcon('muestra')}
        </button>
      </div>

      <div className="col-span-2 text-sm font-semibold text-surface-700">
        <button onClick={() => onSort('tecnica')} className={getSortableClass('tecnica')}>
          Técnica
          {renderSortIcon('tecnica')}
        </button>
      </div>

      <div className="col-span-2 text-sm font-semibold text-surface-700">
        <button onClick={() => onSort('agencia')} className={getSortableClass('agencia')}>
          Agencia / Centro
          {renderSortIcon('agencia')}
        </button>
      </div>

      <div className="col-span-2 text-sm font-semibold text-surface-700">
        <button onClick={() => onSort('fecha')} className={getSortableClass('fecha')}>
          F. Envío
          {renderSortIcon('fecha')}
        </button>
      </div>

      <div className="col-span-2 text-sm font-semibold text-surface-700">
        <button onClick={() => onSort('estado')} className={getSortableClass('estado')}>
          Estado
          {renderSortIcon('estado')}
        </button>
      </div>

      <div className="col-span-1 text-sm font-semibold text-surface-700 text-right">Acciones</div>
    </div>
  )
}
