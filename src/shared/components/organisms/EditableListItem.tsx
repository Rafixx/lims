import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical, Plus } from 'lucide-react'

type Variant = 'default' | 'deleted'

interface TecnicaItemProps {
  id: number // id único de la técnica
  label: string
  onDelete: () => void // para delete o reinsert, según el variant
  variant?: Variant // controla estilo y comportamientos
}

export const EditableListItem = ({
  id,
  label,
  onDelete,
  variant = 'default'
}: TecnicaItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const isDeleted = variant === 'deleted'

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        flex justify-between items-center px-2 py-1
        ${isDeleted ? 'bg-surface-100 border border-surface-300' : 'bg-white border border-surface-200'}
        rounded-md shadow-soft text-sm
        transition-opacity duration-200 ease-in-out
      `}
    >
      <span className="flex items-center gap-2">
        {/* Oculta el drag handle si es deleted */}
        {!isDeleted && (
          <span {...listeners} className="cursor-grab text-surface-400">
            <GripVertical size={16} />
          </span>
        )}
        {label}
      </span>

      <button
        type="button"
        onClick={onDelete}
        className={`
          ml-2 rounded-full p-1 transition-colors
          ${
            isDeleted
              ? 'bg-surface-200 text-info-500 hover:bg-surface-300'
              : 'text-danger-600 hover:text-danger-400'
          }
        `}
        aria-label={isDeleted ? 'Reinsertar técnica' : 'Eliminar técnica'}
      >
        {isDeleted ? <Plus size={14} /> : <X size={14} />}
      </button>
    </li>
  )
}
