import { getColSpanClass } from '@/shared/utils/helpers'
import { ArrowUp, ArrowDown } from 'lucide-react'

export interface ListHeaderField {
  label: string
  span: number
  sortKey?: string // Clave para ordenar por este campo
}

export interface ListHeaderProps {
  fieldList: ListHeaderField[]
  className?: string
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (sortKey: string) => void
}

/**
 * Componente genérico para renderizar encabezados de listas en formato grid
 * Utiliza grid-cols-12 y permite especificar el span de cada columna
 * Soporta ordenamiento por columnas cuando se proporciona onSort
 */
export const ListHeader = ({
  fieldList,
  className = '',
  sortKey,
  sortDirection,
  onSort
}: ListHeaderProps) => {
  const defaultClassName = 'grid grid-cols-12 gap-4 p-2 border-b font-semibold text-sm bg-gray-200'
  const finalClassName = className || defaultClassName

  const handleSort = (field: ListHeaderField) => {
    if (field.sortKey && onSort) {
      onSort(field.sortKey)
    }
  }

  return (
    <div className={finalClassName}>
      {fieldList.map((field, index) => {
        const isSortable = field.sortKey && onSort
        const isActive = sortKey === field.sortKey

        return (
          <div key={index} className={getColSpanClass(field.span)}>
            {isSortable ? (
              <button
                onClick={() => handleSort(field)}
                className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                title={`Ordenar por ${field.label}`}
              >
                <span>{field.label}</span>
                {isActive && (
                  <span className="text-primary-600">
                    {sortDirection === 'asc' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
            ) : (
              field.label
            )}
          </div>
        )
      })}
    </div>
  )
}
