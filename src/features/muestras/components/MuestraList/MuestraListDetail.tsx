import { ReactNode, useMemo } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Muestra, Tecnica, TecnicaAgrupada } from '../../interfaces/muestras.types'
import { useNavigate } from 'react-router-dom'
import { useTecnicasAgrupadasByMuestra } from '../../hooks/useMuestras'
import { TecnicaListHeader } from './TecnicaListHeader'
import { TecnicaListDetail } from './TecnicaListDetail'
import { TecnicaAgrupadaListDetail } from './TecnicaAgrupadaListDetail'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { formatDateTime } from '@/shared/utils/helpers'

interface MuestraListDetailProps {
  muestra: Muestra
  onEdit: (muestra: Muestra) => void
  onDelete: (muestra: Muestra) => void
  fieldSpans: number[]
}

// Configuración de columnas para las técnicas SIN resultados
const TECNICA_COLUMNS_WITHOUT_RESULTS = [
  { label: 'Fecha', span: 2 },
  { label: 'Técnica', span: 2 },
  { label: 'Worklist', span: 2 },
  { label: 'Técnico', span: 2 },
  { label: 'Estado', span: 3 },
  { label: 'Acciones', span: 1 }
]

// Configuración de columnas para las técnicas CON resultados
const TECNICA_COLUMNS_WITH_RESULTS = [
  { label: 'Fecha', span: 1 },
  { label: 'Técnica', span: 2 },
  { label: 'Worklist', span: 1 },
  { label: 'Técnico', span: 1 },
  { label: 'Resultados', span: 4 },
  { label: 'Estado', span: 2 },
  { label: 'Acciones', span: 1 }
]

// const getEstadoBadgeColor = (estado: string): string => {
//   const estadoColors: Record<string, string> = {
//     PENDIENTE: 'bg-yellow-100 text-yellow-800',
//     'EN PROCESO': 'bg-blue-100 text-blue-800',
//     COMPLETADO: 'bg-green-100 text-green-800',
//     CANCELADO: 'bg-red-100 text-red-800'
//   }
//   return estadoColors[estado] || 'bg-gray-100 text-gray-800'
// }

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
  const navigate = useNavigate()
  const { tecnicas, isLoading } = useTecnicasAgrupadasByMuestra(muestra.id_muestra)

  // Determinar si son técnicas agrupadas o normales
  const isTecnicasAgrupadas = tecnicas.length > 0 && 'proceso_nombre' in tecnicas[0]

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
    // Estudio
    <span key={`estudio-${muestra.id_muestra}`} className="text-gray-700">
      {muestra.estudio || '-'}
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
    </span>
    // Estado
    // <span
    //   key={muestra.id_muestra}
    //   className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(muestra.estado_muestra)}`}
    // >
    // {/* {muestra.estado_muestra} */}
    // </span>
  ]

  // Handler para duplicar muestra
  const handleDuplicate = () => {
    navigate(`/muestras/nueva?duplicar=${muestra.id_muestra}`)
  }

  // Definir las acciones
  const actions: ListDetailAction[] = [
    {
      icon: <Plus className="w-4 h-4" />,
      onClick: handleDuplicate,
      title: 'Nueva prueba para esta muestra',
      className: 'p-1 text-green-600 hover:bg-green-50 rounded transition-colors'
    },
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

  // ✅ Determinar si alguna técnica tiene resultados (solo para técnicas normales)
  const hasAnyResultados = useMemo(() => {
    if (isTecnicasAgrupadas) return false
    return (tecnicas as Tecnica[])?.some(
      (tecnica: Tecnica) =>
        tecnica.resultados &&
        tecnica.resultados.length > 0 &&
        tecnica.resultados.some(
          resultado =>
            resultado.valor !== null ||
            resultado.valor_texto ||
            resultado.valor_fecha ||
            resultado.tipo_res
        )
    )
  }, [tecnicas, isTecnicasAgrupadas])

  // Configuración de columnas para técnicas agrupadas
  const TECNICA_COLUMNS_AGRUPADAS = [
    { label: 'Técnica/Proceso', span: 2 },
    { label: 'Total', span: 2 },
    { label: 'Estados', span: 4 },
    { label: 'Técnico', span: 2 },
    { label: 'Estado', span: 1 },
    { label: 'Acciones', span: 1 }
  ]

  // ✅ Usar configuración de columnas según el tipo
  const TECNICA_COLUMNS = isTecnicasAgrupadas
    ? TECNICA_COLUMNS_AGRUPADAS
    : hasAnyResultados
      ? TECNICA_COLUMNS_WITH_RESULTS
      : TECNICA_COLUMNS_WITHOUT_RESULTS

  // Contenido expandido con las técnicas
  const expandedContent = (
    <div className="space-y-2">
      {isLoading ? (
        <p className="text-sm text-surface-600">Cargando técnicas...</p>
      ) : tecnicas && tecnicas.length > 0 ? (
        <>
          <TecnicaListHeader fieldList={TECNICA_COLUMNS} />
          {isTecnicasAgrupadas
            ? // Renderizar técnicas agrupadas
              (tecnicas as TecnicaAgrupada[]).map(tecnicaAgrupada => (
                <TecnicaAgrupadaListDetail
                  key={`agrupada-${tecnicaAgrupada.primera_tecnica_id}`}
                  tecnicaAgrupada={tecnicaAgrupada}
                  fieldSpans={TECNICA_COLUMNS.map(col => col.span)}
                  muestraId={muestra.id_muestra}
                />
              ))
            : // Renderizar técnicas normales
              (tecnicas as Tecnica[]).map((tecnica: Tecnica) => (
                <TecnicaListDetail
                  key={`tecnica-${tecnica.id_tecnica}`}
                  tecnica={tecnica}
                  fieldSpans={TECNICA_COLUMNS.map(col => col.span)}
                  hasResultados={hasAnyResultados}
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
