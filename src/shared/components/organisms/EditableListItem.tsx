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

const SortableItem = ({
  id,
  label,
  onDelete
}: Omit<TecnicaItemProps, 'variant'>) => {
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
      className="flex justify-between items-center px-2 py-1 bg-white border border-surface-200 rounded-md shadow-soft text-sm"
    >
      <span className="flex items-center gap-2">
        <span {...listeners} className="cursor-grab text-surface-400">
          <GripVertical size={16} />
        </span>
        {label}
      </span>
      <button
        type="button"
        onClick={onDelete}
        className="ml-2 rounded-full p-1 transition-colors text-danger-600 hover:text-danger-400"
        aria-label="Eliminar técnica"
      >
        <X size={14} />
      </button>
    </li>
  )
}

const DeletedItem = ({ label, onDelete }: { label: string; onDelete: () => void }) => (
  <li className="flex justify-between items-center px-2 py-1 bg-surface-100 border border-surface-300 rounded-md shadow-soft text-sm">
    <span className="flex items-center gap-2 text-surface-500">{label}</span>
    <button
      type="button"
      onClick={onDelete}
      className="ml-2 rounded-full p-1 transition-colors bg-surface-200 text-info-500 hover:bg-surface-300"
      aria-label="Reinsertar técnica"
    >
      <Plus size={14} />
    </button>
  </li>
)

export const EditableListItem = ({
  id,
  label,
  onDelete,
  variant = 'default'
}: TecnicaItemProps) => {
  if (variant === 'deleted') {
    return <DeletedItem label={label} onDelete={onDelete} />
  }
  return <SortableItem id={id} label={label} onDelete={onDelete} />
}
