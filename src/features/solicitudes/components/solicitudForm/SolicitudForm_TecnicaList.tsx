// src/features/solicitudes/components/solicitudForm/TecnicaList.tsx
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
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SolicitudForm_TecnicaItem } from './SolicitudForm_TecnicaItem'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Tecnica {
  id: string
  tecnica_proc: string
}

interface Props {
  tecnicas: Tecnica[]
  pruebaId?: number
}

export const SolicitudForm_TecnicaList = ({ tecnicas: initialTecnicas, pruebaId }: Props) => {
  const queryClient = useQueryClient()
  const [tecnicas, setTecnicas] = useState(initialTecnicas)
  const [parentRef] = useAutoAnimate()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const updateCache = (updatedTecnicas: Tecnica[]) => {
    setTecnicas(updatedTecnicas)
    queryClient.setQueryData(['tecnicasPorPrueba', pruebaId], updatedTecnicas)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = tecnicas.findIndex(t => t.id === active.id)
      const newIndex = tecnicas.findIndex(t => t.id === over?.id)
      const reordered = arrayMove(tecnicas, oldIndex, newIndex)
      updateCache(reordered)
    }
  }

  const handleDelete = (id: string) => {
    const updated = tecnicas.filter(t => t.id !== id)
    updateCache(updated)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tecnicas.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul ref={parentRef} className="space-y-1">
          {tecnicas.map(t => (
            <SolicitudForm_TecnicaItem
              key={t.id}
              id={t.id}
              onDelete={() => handleDelete(t.id)}
              label={t.tecnica_proc}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
