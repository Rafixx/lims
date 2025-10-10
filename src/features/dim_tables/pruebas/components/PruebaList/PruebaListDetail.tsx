import { Edit, Trash2 } from 'lucide-react'
import { Prueba } from '@/shared/interfaces/dim_tables.types'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { useTecnicasProcByPrueba } from '@/shared/hooks/useDim_tables'
import { TecnicaProcCard } from '../TecnicaProcCard'
import { ReactNode } from 'react'

interface PruebaListDetailProps {
  prueba: Prueba
  onEdit: () => void
  onDelete: () => void
  fieldSpans: number[]
}

export const PruebaListDetail = ({
  prueba,
  onEdit,
  onDelete,
  fieldSpans
}: PruebaListDetailProps) => {
  const { data: tecnicas } = useTecnicasProcByPrueba(prueba.id)

  const renderFields = (): ReactNode[] => [
    <span key={prueba.id} className="font-mono text-sm text-gray-600">
      {prueba.cod_prueba || 'Sin código'}
    </span>,
    <span key={prueba.id} className="text-sm text-gray-900">
      {prueba.prueba || 'Sin descripción'}
    </span>
  ]

  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      title: 'Editar prueba',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-800'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: 'Eliminar prueba',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-800'
    }
  ]

  const expandedContent = (
    <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
      <div className="mt-2 space-y-1">
        {tecnicas && tecnicas.length > 0 ? (
          tecnicas.map((tecnica, index) => <TecnicaProcCard key={index} tecnica={tecnica} />)
        ) : (
          <p className="text-sm text-gray-600">No hay técnicas asociadas a esta prueba.</p>
        )}
      </div>
    </div>
  )

  return (
    <ListDetail
      item={prueba}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
      expandedContent={expandedContent}
    />
  )
}
