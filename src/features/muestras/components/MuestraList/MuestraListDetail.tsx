import { ReactNode, useState } from 'react'
import {
  Edit,
  Trash2,
  Plus,
  Grid3X3,
  Upload,
  TestTube2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Pencil
} from 'lucide-react'
import { Muestra } from '../../interfaces/muestras.types'
import { canCompleteMuestra } from '../../utils/canCompleteMuestra'
import { useNavigate } from 'react-router-dom'
import { useTecnicasAgrupadasByMuestra, useMuestraArray } from '../../hooks/useMuestras'
import { TecnicasSummaryExpanded, TecnicaStateChips } from './TecnicasSummaryExpanded'
import { aggregateTecnicaStates } from '../../utils/aggregateTecnicaStates'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { formatDateTime } from '@/shared/utils/helpers'
import { ImportArrayCodExternoModal } from './ImportArrayCodExternoModal'
import { EditPlacaCodigosModal } from './EditPlacaCodigosModal'

interface MuestraListDetailProps {
  muestra: Muestra
  onEdit: (muestra: Muestra) => void
  onDelete: (muestra: Muestra) => void
  onComplete?: (muestra: Muestra) => void
  fieldSpans: number[]
  /** Modo hijo dentro de un grupo: layout compacto (cod_ext + cod_epi + estado + acciones) */
  isChild?: boolean
  /** Permite expandir técnicas incluso en modo hijo (e.g. placas dentro de un grupo) */
  childCanExpand?: boolean
  /** Oculta los botones Editar y Duplicar (para hijas de grupo masivo) */
  hideEditAndDuplicate?: boolean
}

/**
 * Componente específico para renderizar el detalle de una Muestra.
 * Wrapper sobre el componente genérico ListDetail.
 */
export const MuestraListDetail = ({
  muestra,
  onEdit,
  onDelete,
  onComplete,
  fieldSpans,
  isChild = false,
  childCanExpand = false,
  hideEditAndDuplicate = false
}: MuestraListDetailProps) => {
  const navigate = useNavigate()
  const [importArrayModalOpen, setImportArrayModalOpen] = useState(false)
  const [editCodigosModalOpen, setEditCodigosModalOpen] = useState(false)
  // Estado de expansión gestionado aquí (no en ListDetail) para poder colocar el chevron en field[0]
  const [expanded, setExpanded] = useState(false)
  const { tecnicas, isLoading } = useTecnicasAgrupadasByMuestra(muestra.id_muestra)

  // Para muestras tipo placa: obtener posiciones para saber si ya tienen todos los códigos
  const { arrayPositions } = useMuestraArray(
    muestra.tipo_array === true ? muestra.id_muestra : undefined
  )
  const allArrayPositionsHaveCodes =
    arrayPositions.length > 0 && arrayPositions.every(p => !!p.codigo_externo)

  // Icono de tipo: Grid3X3 para PLACA, TestTube2 para TUBO
  const typeIcon =
    muestra.tipo_array === true ? (
      <Grid3X3 className="w-3 h-3 shrink-0 text-accent-600" />
    ) : (
      <TestTube2 className="w-3 h-3 shrink-0 text-primary-400" />
    )

  // Para placas: el código EXT visible es codigo_externo si existe, sino array_config.code
  const displayCodExt =
    muestra.tipo_array === true
      ? (muestra.codigo_externo || muestra.array_config?.code || null)
      : (muestra.codigo_externo || null)

  // Modo hijo (dentro de un grupo): mismas columnas que el padre, pero sólo
  // cod_ext + cod_epi + técnicas chips + estado en los campos; el resto vacío.
  // fieldSpans = parentFieldSpans = [1,1,1,1,2,1,1,1,1,2]
  // renderChildFields → 9 elementos (el span de acciones es el último del array)
  const renderChildFields = (): ReactNode[] => {
    const counts = aggregateTecnicaStates(tecnicas)
    return [
      // [0] Cód EXT (span 1) — icono de tipo + (chevron si childCanExpand) + código
      <div key={`ext-${muestra.id_muestra}`} className="flex items-center gap-1 min-w-0">
        {typeIcon}
        {childCanExpand && (
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="p-0.5 shrink-0 rounded text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
            aria-label={expanded ? 'Contraer técnicas' : 'Expandir técnicas'}
            title={expanded ? 'Contraer' : 'Expandir'}
          >
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
        <span
          className="block font-mono text-xs font-semibold text-primary-600 truncate"
          title={displayCodExt || ''}
        >
          {displayCodExt || '—'}
        </span>
      </div>,
      // [1] Cód EPI (span 1)
      <span
        key={`epi-${muestra.id_muestra}`}
        className="block font-mono text-xs font-semibold text-primary-700 truncate"
        title={muestra.codigo_epi || ''}
      >
        {muestra.codigo_epi || '—'}
      </span>,
      // [2] Cliente (span 1) — vacío
      <span key={`c2-${muestra.id_muestra}`} />,
      // [3] TipoMuestra (span 1) — vacío  [era [4], Paciente eliminado]
      <span key={`c3-${muestra.id_muestra}`} />,
      // [4] Prueba (span 2) — vacío  [era [5]]
      <span key={`c4-${muestra.id_muestra}`} />,
      // [5] Estudio (span 1) — vacío  [era [6]]
      <span key={`c5-${muestra.id_muestra}`} />,
      // [6] Recepción (span 1) — vacío  [era [7]]
      <span key={`c6-${muestra.id_muestra}`} />,
      // [7] Técnicas chips (span 1) — NUEVO
      <div key={`tecnicas-${muestra.id_muestra}`} className="min-w-0">
        <TecnicaStateChips counts={counts} />
      </div>,
      // [8] Estado (span 1)  [era [8]]
      <div key={`estado-${muestra.id_muestra}`} className="min-w-0">
        {muestra.estadoInfo ? (
          <EstadoBadge estado={muestra.estadoInfo} size="sm" showTooltip={true} />
        ) : (
          <span className="text-surface-300 text-xs">—</span>
        )}
      </div>
    ]
  }

  // Modo standalone: 9 campos — orden idéntico al COLUMN_CONFIG de MuestrasPage:
  // CódEXT(1) CódEPI(1) Cliente(1) TipoMuestra(1) Prueba(2) Estudio(1) Recepción(1) Técnicas(1) Estado(1) Actions(2)
  const renderStandaloneFields = (): ReactNode[] => {
    const counts = aggregateTecnicaStates(tecnicas)
    return [
      // [0] Código EXTERNO (span 1) — icono de tipo + chevron expand + código
      // Chevron va justo después del typeIcon para consistencia con MuestraGroupRow (Layers → chevron)
      <div key={`ext-${muestra.id_muestra}`} className="flex items-center gap-1 min-w-0">
        {typeIcon}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="p-0.5 shrink-0 rounded text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          aria-label={expanded ? 'Contraer técnicas' : 'Expandir técnicas'}
          title={expanded ? 'Contraer' : 'Expandir'}
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        <span
          className="font-mono text-xs font-semibold text-primary-600 truncate"
          title={displayCodExt || ''}
        >
          {displayCodExt || '—'}
        </span>
      </div>,
      // [1] Código EPI (span 1)
      <span
        key={`epi-${muestra.id_muestra}`}
        className="block font-mono text-xs font-semibold text-primary-700 truncate"
        title={muestra.codigo_epi || ''}
      >
        {muestra.codigo_epi || '—'}
      </span>,
      // [2] Cliente (span 1)
      <span
        key={`cliente-${muestra.solicitud?.cliente?.id}`}
        className="block text-xs text-surface-700 truncate"
        title={muestra.solicitud?.cliente?.nombre || ''}
      >
        {muestra.solicitud?.cliente?.nombre || '—'}
      </span>,
      // [3] Tipo de muestra (span 1)  [era [4], Paciente eliminado]
      <span
        key={`tipo-${muestra.tipo_muestra?.id}`}
        className="block text-xs text-surface-600 truncate"
        title={muestra.tipo_muestra?.tipo_muestra || ''}
      >
        {muestra.tipo_muestra?.tipo_muestra || '—'}
      </span>,
      // [4] Prueba (span 2)  [era [5]]
      <span
        key={`prueba-${muestra.prueba?.id}`}
        className="block text-xs text-surface-700 truncate"
        title={muestra.prueba?.prueba || ''}
      >
        {muestra.prueba?.prueba || '—'}
      </span>,
      // [5] Estudio (span 1)  [era [6]]
      <span
        key={`estudio-${muestra.id_muestra}`}
        className="block text-xs text-surface-600 truncate"
        title={muestra.estudio || ''}
      >
        {muestra.estudio || '—'}
      </span>,
      // [6] Fecha Recepción (span 1)  [era [7]]
      <span
        key={`fecha-${muestra.id_muestra}`}
        className="block text-xs text-surface-500 font-mono whitespace-nowrap"
      >
        {formatDateTime(muestra.f_recepcion)}
      </span>,
      // [7] Técnicas chips (span 1) — NUEVO
      <div key={`tecnicas-${muestra.id_muestra}`} className="min-w-0">
        {isLoading ? (
          <span className="text-xs text-surface-400">...</span>
        ) : (
          <TecnicaStateChips counts={counts} />
        )}
      </div>,
      // [8] Estado (span 1)  [era [8]]
      <div key={`estado-${muestra.id_muestra}`} className="min-w-0">
        {muestra.estadoInfo ? (
          <EstadoBadge estado={muestra.estadoInfo} size="sm" showTooltip={true} />
        ) : (
          <span className="text-surface-300 text-xs">—</span>
        )}
      </div>
    ]
  }

  const renderFields = isChild ? renderChildFields : renderStandaloneFields

  // Handler para duplicar muestra
  const handleDuplicate = () => {
    navigate(`/muestras/nueva?duplicar=${muestra.id_muestra}`)
  }

  // Acciones: Upload + Editar códigos (sólo tipo_array), Duplicar/Editar (si no hideEditAndDuplicate), Completar, Eliminar
  const actions: ListDetailAction[] = [
    ...(muestra.tipo_array === true
      ? [
          {
            icon: <Upload className="w-4 h-4" />,
            onClick: () => setImportArrayModalOpen(true),
            title: allArrayPositionsHaveCodes
              ? 'Reimportar códigos externos de placa (sobreescribir existentes)'
              : 'Importar códigos externos de placa desde CSV',
            className: allArrayPositionsHaveCodes
              ? 'p-1 text-success-600 hover:bg-success-50 rounded transition-colors'
              : 'p-1 text-accent-600 hover:bg-accent-50 rounded transition-colors'
          },
          {
            icon: <Pencil className="w-4 h-4" />,
            onClick: () => setEditCodigosModalOpen(true),
            title: 'Editar códigos de placa',
            className: 'p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors'
          }
        ]
      : []),
    ...(!hideEditAndDuplicate
      ? [
          {
            icon: <Plus className="w-4 h-4" />,
            onClick: handleDuplicate,
            title: 'Nueva prueba para esta muestra',
            className: 'p-1 text-success-600 hover:bg-success-50 rounded transition-colors'
          },
          {
            icon: <Edit className="w-4 h-4" />,
            onClick: () => onEdit(muestra),
            title: 'Editar',
            className: 'p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors'
          }
        ]
      : []),
    ...(onComplete && canCompleteMuestra(muestra)
      ? [
          {
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: () => onComplete(muestra),
            title: 'Completar proceso',
            className: 'p-1 text-success-600 hover:bg-success-50 rounded transition-colors'
          }
        ]
      : []),
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(muestra),
      title: 'Eliminar',
      className: 'p-1 text-danger-600 hover:bg-danger-50 rounded transition-colors'
    }
  ]

  // Contenido expandido con las técnicas (sólo en modo standalone o cuando childCanExpand)
  const expandedContent =
    isChild && !childCanExpand ? undefined : (
      <TecnicasSummaryExpanded
        tecnicas={tecnicas}
        muestraId={muestra.id_muestra}
        isLoading={isLoading}
      />
    )

  // rowClassName para filas hijas: fondo ligeramente diferenciado
  const childRowClassName =
    'grid grid-cols-12 gap-2 px-3 py-2 border-b border-surface-100 hover:bg-surface-50/60 transition-colors items-center text-sm'

  return (
    <>
      <ListDetail
        item={muestra}
        fieldSpans={fieldSpans}
        renderFields={renderFields}
        actions={actions}
        // expandedContent omitido intencionalmente: el chevron vive en field[0] (junto al typeIcon),
        // no en la columna de acciones, para consistencia con MuestraGroupRow.
        rowClassName={isChild ? childRowClassName : ''}
      />

      {/* Contenido expandido — en modo standalone o cuando childCanExpand, gestionado con estado local */}
      {(!isChild || childCanExpand) && expanded && expandedContent && (
        <div className="px-4 pb-4 border-t border-surface-200 bg-surface-50">
          <div className="mt-2">{expandedContent}</div>
        </div>
      )}

      {muestra.tipo_array === true && (
        <ImportArrayCodExternoModal
          isOpen={importArrayModalOpen}
          onClose={() => setImportArrayModalOpen(false)}
          muestraId={muestra.id_muestra}
          codigoEpi={muestra.codigo_epi}
          plateWidth={muestra.plate_width}
          plateHeight={muestra.plate_height}
        />
      )}

      {muestra.tipo_array === true && (
        <EditPlacaCodigosModal
          isOpen={editCodigosModalOpen}
          onClose={() => setEditCodigosModalOpen(false)}
          muestra={muestra}
        />
      )}
    </>
  )
}
