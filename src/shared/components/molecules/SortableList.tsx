//src/shared/components/molecules/SortableList.tsx
import React, { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import Button, { ButtonVariants } from '../atoms/Button'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'

interface ListItem {
  descripcion: string
}

export interface SelectedItem {
  id: string
  posicion: number
  valor: string
}

interface SortableListProps {
  list_in: ListItem[]
  allowDuplicates?: boolean
  onChange?: (items: SelectedItem[]) => void
}

const SortableList: React.FC<SortableListProps> = ({
  list_in,
  allowDuplicates = false,
  onChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [idCounter, setIdCounter] = useState<number>(0)

  // Inicializamos drag and drop con animaciones para suavizar los cambios visuales
  const [parentRef, dndItems, setDndItems] = useDragAndDrop<HTMLUListElement, SelectedItem>([], {
    sortable: true,
    plugins: [animations()]
  })

  const handleAdd = () => {
    if (selectedOption) {
      const newItem: SelectedItem = {
        id: (idCounter + 1).toString(),
        posicion: dndItems.length,
        valor: selectedOption
      }
      setIdCounter(prev => prev + 1)
      const updatedItems = [...dndItems, newItem]
      setDndItems(updatedItems)
      setSelectedOption(null)
      if (onChange) onChange(updatedItems)
    }
  }

  const handleDelete = (id: string) => {
    const updatedItems = dndItems
      .filter(item => item.id !== id)
      .map((item, newIndex) => ({ ...item, posicion: newIndex }))
    setDndItems(updatedItems)
    if (onChange) onChange(updatedItems)
  }

  // Si no se permiten duplicados, filtramos las opciones para que no aparezcan elementos ya seleccionados
  const availableOptions = allowDuplicates
    ? list_in
    : list_in.filter(item => !dndItems.some(selected => selected.valor === item.descripcion))

  return (
    <div className="space-y-4 w-80">
      <div className="flex items-center">
        <select
          className="p-3 border border-gray-400 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedOption || ''}
          onChange={e => setSelectedOption(e.target.value)}
        >
          <option value="" disabled>
            Selecciona un elemento
          </option>
          {availableOptions.map((item, index) => (
            <option key={index} value={item.descripcion}>
              {item.descripcion}
            </option>
          ))}
        </select>
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={handleAdd}
          disabled={!selectedOption}
          className="ml-3"
        >
          <FiPlus className="h-5 w-5" />
        </Button>
      </div>
      <ul
        ref={parentRef}
        className="mt-4 space-y-2 w-full p-2 border border-gray-200 rounded bg-white"
      >
        {dndItems.map(item => (
          <li
            className="flex items-center justify-between p-2 bg-gray-100 rounded shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-move"
            key={item.id}
            data-label={item.valor}
          >
            <span>{item.valor}</span>
            <Button
              variant={ButtonVariants.SECONDARY}
              onClick={() => handleDelete(item.id)}
              className="ml-2"
            >
              <FiMinus />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SortableList
