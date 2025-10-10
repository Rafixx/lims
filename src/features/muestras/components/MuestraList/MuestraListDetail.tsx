import { ReactNode } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Muestra } from '../../interfaces/muestras.types'
import { useTecnicasByMuestra } from '../../hooks/useMuestras'
import { TecnicaListHeader } from './TecnicaListHeader'
import { TecnicaListDetail } from './TecnicaListDetail'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { formatDateTime } from '@/shared/utils/helpers'

interface MuestraListDetailProps {
  muestra: Muestra
  onEdit: (muestra: Muestra) => void
  onDelete: (muestra: Muestra) => void
  fieldSpans: number[]
}

// Configuración de columnas para las técnicas
const TECNICA_COLUMNS = [
  { label: 'Fecha', span: 2 },
  { label: 'Técnica', span: 3 },
  { label: 'Worklist', span: 2 },
  { label: 'Técnico', span: 3 },
  { label: 'Estado', span: 2 }
]

const getEstadoBadgeColor = (estado: string): string => {
  const estadoColors: Record<string, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    'EN PROCESO': 'bg-blue-100 text-blue-800',
    COMPLETADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800'
  }
  return estadoColors[estado] || 'bg-gray-100 text-gray-800'
}

/**
 * Componente específico para renderizar el detalle de una Muestra
 * Wrapper sobre el componente genérico ListDetail
 */
export const MuestraListDetail = ({
  muestra,
  onEdit,
  onDelete,
  fieldSpans
}: MuestraListDetailProps) => {
  const { tecnicas } = useTecnicasByMuestra(muestra.id_muestra)

  // Definir los campos a renderizar
  const renderFields = (): ReactNode[] => [
    // Código EXTERNO
    <span key={muestra.id_muestra} className="font-medium text-blue-600">
      {muestra.codigo_externo || '-'}
    </span>,
    // Código EPI
    <span key={muestra.id_muestra} className="font-medium text-blue-600">
      {muestra.codigo_epi || '-'}
    </span>,
    // Cliente
    <span key={muestra.solicitud?.cliente?.id} className="text-gray-700">
      {muestra.solicitud?.cliente?.nombre || '-'}
    </span>,
    // Paciente
    <span key={muestra.paciente?.id} className="text-gray-700">
      {muestra.paciente?.nombre || '-'}
    </span>,
    // Tipo de muestra
    <span key={muestra.tipo_muestra?.id} className="text-gray-700">
      {muestra.tipo_muestra?.tipo_muestra || '-'}
    </span>,
    // Prueba
    <span key={muestra.prueba?.id} className="text-gray-700">
      {muestra.prueba?.prueba || '-'}
    </span>,
    // Fecha Recepción
    <span key={muestra.solicitud?.f_creacion} className="text-gray-600">
      {formatDateTime(muestra.f_recepcion)}
    </span>,
    // Estado
    <span
      key={muestra.id_muestra}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(muestra.estado_muestra)}`}
    >
      {muestra.estado_muestra}
    </span>
  ]

  // Definir las acciones
  const actions: ListDetailAction[] = [
    {
      icon: <Edit className="w-4 h-4" />,
      onClick: () => onEdit(muestra),
      title: 'Editar',
      className: 'p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(muestra),
      title: 'Eliminar',
      className: 'p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
    }
  ]

  // Contenido expandido con las técnicas
  const expandedContent = (
    <div className="space-y-2">
      {tecnicas && tecnicas.length > 0 ? (
        <>
          <TecnicaListHeader fieldList={TECNICA_COLUMNS} />
          {tecnicas.map((tecnica, index) => (
            <TecnicaListDetail
              key={index}
              tecnica={tecnica}
              fieldSpans={TECNICA_COLUMNS.map(col => col.span)}
            />
          ))}
        </>
      ) : (
        <p className="text-sm text-surface-600">No hay técnicas asociadas a esta muestra.</p>
      )}
    </div>
  )

  return (
    <ListDetail
      item={muestra}
      fieldSpans={fieldSpans}
      renderFields={renderFields}
      actions={actions}
      expandedContent={expandedContent}
    />
  )
}
