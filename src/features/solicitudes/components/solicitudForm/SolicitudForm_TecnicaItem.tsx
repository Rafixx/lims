import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical, Plus } from 'lucide-react'

type Variant = 'default' | 'deleted'

interface TecnicaItemProps {
  id: number
  label: string
  onDelete: () => void // para delete o reinsert, según el variant
  variant?: Variant // controla estilo y comportamientos
}

export const SolicitudForm_TecnicaItem = ({
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
        ${isDeleted ? 'bg-gray-100 border border-gray-300' : 'bg-white border'}
        rounded shadow-sm text-sm
        transition-opacity duration-200 ease-in-out
      `}
    >
      <span className="flex items-center gap-2">
        {/* Oculta el drag handle si es deleted */}
        {!isDeleted && (
          <span {...listeners} className="cursor-grab text-gray-400">
            <GripVertical size={16} />
          </span>
        )}
        {label}
      </span>

      <button
        type="button"
        onClick={onDelete}
        className={`
          ml-2 rounded-full p-1
          ${
            isDeleted
              ? 'bg-gray-200 text-blue-500 hover:bg-gray-300'
              : 'text-danger hover:text-danger/50'
          }
        `}
        aria-label={isDeleted ? 'Reinsertar técnica' : 'Eliminar técnica'}
      >
        {isDeleted ? <Plus size={14} /> : <X size={14} />}
      </button>
    </li>
  )
}
