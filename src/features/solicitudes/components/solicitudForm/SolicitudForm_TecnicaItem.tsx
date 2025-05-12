import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, GripVertical } from 'lucide-react'

interface TecnicaItemProps {
  id: string
  label: string
  onDelete: () => void
}

export const SolicitudForm_TecnicaItem = ({ id, label, onDelete }: TecnicaItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex justify-between items-center px-2 py-1 bg-white border rounded shadow-sm text-sm transition-opacity duration-200 ease-in-out"
    >
      <span className="flex items-center gap-2">
        <span {...listeners} className="cursor-grab text-gray-400">
          <GripVertical size={16} />
        </span>
        {label}
      </span>

      <button
        type="button"
        onClick={onDelete}
        className="text-danger hover:text-danger/50 ml-2"
        aria-label="Eliminar técnica"
      >
        <X size={14} />
      </button>
    </li>
  )
}
