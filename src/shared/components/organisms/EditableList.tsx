// EditableList.tsx
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { EditableListItem } from './EditableListItem'

export interface EditableListProps<T> {
  items: T[]
  deletedItems: T[]
  /** Cómo extraer el identificador único de cada T */
  getItemId: (item: T) => number
  /** Cómo extraer el texto que quieres mostrar */
  getItemLabel: (item: T) => string
  onOrderChange: (newItems: T[]) => void
  onDelete: (id: number) => void
  onReinsert: (id: number) => void
}

export const EditableList = <T,>({
  items,
  deletedItems,
  getItemId,
  getItemLabel,
  onOrderChange,
  onDelete,
  onReinsert
}: EditableListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over?.id && active.id !== over.id) {
      const oldIndex = items.findIndex(i => getItemId(i) === active.id)
      const newIndex = items.findIndex(i => getItemId(i) === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)
      onOrderChange(reordered)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => getItemId(i))} strategy={verticalListSortingStrategy}>
        <ul className="space-y-1">
          {items.map(item => {
            const id = getItemId(item)
            return (
              <EditableListItem
                key={id}
                id={id}
                label={getItemLabel(item)}
                onDelete={() => onDelete(id)}
              />
            )
          })}

          {deletedItems.map(item => {
            const id = getItemId(item)
            return (
              <EditableListItem
                key={id}
                id={id}
                label={getItemLabel(item)}
                variant="deleted"
                onDelete={() => onReinsert(id)}
              />
            )
          })}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
