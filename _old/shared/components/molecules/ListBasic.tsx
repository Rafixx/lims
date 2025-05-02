//src/shared/components/molecules/ListBasic.tsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal } from '../atoms/Modal'
import { TableBasic, Column } from './TableBasic'
import Button, { ButtonVariants } from '../atoms/Button'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'

interface ListBasicProps<T> {
  queryKey: (string | number)[]
  queryFn: () => Promise<T[]>
  columns: Column<T>[]
  FormComponent: React.ComponentType<{
    initialData?: T
    onSubmit: (data: T) => void
  }>
  mutationFn: (data: T) => Promise<T>
  title: string
}

export const ListBasic = <T,>({
  queryKey,
  queryFn,
  columns,
  FormComponent,
  mutationFn,
  title
}: ListBasicProps<T>) => {
  const queryClient = useQueryClient()

  // Obtenemos la lista de items mediante el hook de react-query
  const { data, isLoading, error } = useQuery<T[]>({
    queryKey,
    queryFn
  })

  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleEdit = (item: T) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleNew = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      setShowModal(false)
    }
  })

  const handleSubmit = (data: T) => {
    mutation.mutate(data)
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar los datos</div>

  // Columna de acciones para editar
  const actionsColumn: Column<T> = {
    header: 'Acciones',
    cell: (item: T) => (
      <div className="w-24 flex">
        <Button
          onClick={() => handleEdit(item)}
          className="font-medium text-primary hover:bg-primary hover:text-white"
        >
          <FiEdit2 />
        </Button>
        <Button
          onClick={() => handleEdit(item)}
          className="font-medium text-primary hover:bg-primary hover:text-white"
        >
          <FiTrash2 />
        </Button>
      </div>
    )
  }

  const finalColumns = [...columns, actionsColumn]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Button onClick={handleNew} variant={ButtonVariants.PRIMARY}>
        <span className="flex items-center  gap-2">
          <FiPlus /> {title}
        </span>
      </Button>

      <div className="mt-6">
        <TableBasic<T> columns={finalColumns} data={data || []} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-xl font-bold mb-4">
          {editingItem ? `Editar ${title}` : `Nuevo ${title}`}
        </h3>
        <FormComponent initialData={editingItem || undefined} onSubmit={handleSubmit} />
      </Modal>
    </div>
  )
}
