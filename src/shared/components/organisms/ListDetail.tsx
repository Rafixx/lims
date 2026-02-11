import { ReactNode, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getColSpanClass } from '@/shared/utils/helpers'

export interface ListDetailAction {
  icon: ReactNode
  onClick: () => void
  title: string
  className?: string
  disabled?: boolean
}

export interface ListDetailProps<T> {
  item: T
  fieldSpans: number[]
  renderFields: (item: T) => ReactNode[]
  actions?: ListDetailAction[]
  expandedContent?: ReactNode
  rowClassName?: string
  onExpandChange?: (expanded: boolean) => void
}

/**
 * Componente genérico para renderizar filas de detalle en listas con formato grid
 * Soporta:
 * - Grid de 12 columnas con spans configurables
 * - Acciones personalizables (editar, eliminar, etc.)
 * - Contenido expandible opcional
 * - Estilos personalizables
 */
export function ListDetail<T>({
  item,
  fieldSpans,
  renderFields,
  actions = [],
  expandedContent,
  rowClassName = '',
  onExpandChange
}: ListDetailProps<T>) {
  const [expanded, setExpanded] = useState(false)

  const handleExpandToggle = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const defaultRowClassName =
    'grid grid-cols-12 gap-2 px-3 py-2.5 border-b hover:bg-surface-50 transition-colors items-center text-sm'
  const finalRowClassName = rowClassName || defaultRowClassName

  const fields = renderFields(item)
  const hasExpandContent = !!expandedContent

  return (
    <>
      <div className={finalRowClassName}>
        {/* Renderizar campos dinámicos */}
        {fields.map((field, index) => (
          <div key={index} className={`${getColSpanClass(fieldSpans[index])} min-w-0 overflow-hidden`}>
            {field}
          </div>
        ))}

        {/* Columna de acciones - siempre la última */}
        {(actions.length > 0 || hasExpandContent) && (
          <div className={getColSpanClass(fieldSpans[fieldSpans.length - 1])}>
            <div className="flex items-center gap-2 justify-end">
              {/* Renderizar acciones personalizadas */}
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={
                    action.className ||
                    'p-1 text-surface-500 hover:bg-surface-100 rounded transition-colors'
                  }
                  title={action.title}
                >
                  {action.icon}
                </button>
              ))}

              {/* Botón de expandir/contraer si hay contenido expandible */}
              {hasExpandContent && (
                <button
                  onClick={handleExpandToggle}
                  className="p-1 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded transition-colors"
                  title={expanded ? 'Contraer' : 'Expandir'}
                >
                  {expanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido expandido */}
      {hasExpandContent && expanded && (
        <div className="px-4 pb-4 border-t border-surface-200 bg-surface-50">
          <div className="mt-2">{expandedContent}</div>
        </div>
      )}
    </>
  )
}
