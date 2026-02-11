import { ReactNode, useMemo, useState } from 'react'
import { Edit, Trash2, Plus, Grid3X3, Upload, TestTube2 } from 'lucide-react'
import { Muestra, Tecnica, TecnicaAgrupada } from '../../interfaces/muestras.types'
import { useNavigate } from 'react-router-dom'
import { useTecnicasAgrupadasByMuestra, useMuestraArray } from '../../hooks/useMuestras'
import { TecnicaListHeader } from './TecnicaListHeader'
import { TecnicaListDetail } from './TecnicaListDetail'
import { TecnicaAgrupadaListDetail } from './TecnicaAgrupadaListDetail'
import { ListDetail, ListDetailAction } from '@/shared/components/organisms/ListDetail'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { formatDateTime } from '@/shared/utils/helpers'
import { ImportArrayCodExternoModal } from './ImportArrayCodExternoModal'

interface MuestraListDetailProps {
  muestra: Muestra
  onEdit: (muestra: Muestra) => void
  onDelete: (muestra: Muestra) => void
  fieldSpans: number[]
  /** Modo hijo dentro de un grupo: layout compacto (cod_ext + cod_epi + estado + acciones) */
  isChild?: boolean
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

/**
 * Componente específico para renderizar el detalle de una Muestra.
 * Wrapper sobre el componente genérico ListDetail.
 */
export const MuestraListDetail = ({
  muestra,
  onEdit,
  onDelete,
  fieldSpans,
  isChild = false
}: MuestraListDetailProps) => {
  const navigate = useNavigate()
  const [importArrayModalOpen, setImportArrayModalOpen] = useState(false)
  const { tecnicas, isLoading } = useTecnicasAgrupadasByMuestra(muestra.id_muestra)

  // Para muestras tipo placa: obtener posiciones para saber si ya tienen todos los códigos
  const { arrayPositions } = useMuestraArray(muestra.tipo_array === true ? muestra.id_muestra : undefined)
  const allArrayPositionsHaveCodes =
    arrayPositions.length > 0 && arrayPositions.every(p => !!p.codigo_externo)

  // Determinar si son técnicas agrupadas o normales
  const isTecnicasAgrupadas = tecnicas.length > 0 && 'proceso_nombre' in tecnicas[0]

  // Icono de tipo: Grid3X3 para PLACA, TestTube2 para TUBO
  const typeIcon =
    muestra.tipo_array === true ? (
      <Grid3X3 className="w-3 h-3 shrink-0 text-accent-600" />
    ) : (
      <TestTube2 className="w-3 h-3 shrink-0 text-primary-400" />
    )

  // Modo hijo (dentro de un grupo): mismas columnas que el padre, pero sólo
  // cod_ext + cod_epi + estado en los campos; el resto vacío.
  // fieldSpans = parentFieldSpans = [1,1,1,1,1,2,1,1,1,2]
  // renderChildFields → 9 elementos (el span de acciones es el último del array)
  const renderChildFields = (): ReactNode[] => [
    // [0] Cód EXT (span 1) — icono de tipo + código
    <div key={`ext-${muestra.id_muestra}`} className="flex items-center gap-1 min-w-0">
      {typeIcon}
      <span
        className="block font-mono text-xs font-semibold text-primary-600 truncate"
        title={muestra.codigo_externo || ''}
      >
        {muestra.codigo_externo || '—'}
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
    // [3] Paciente (span 1) — vacío
    <span key={`c3-${muestra.id_muestra}`} />,
    // [4] TipoMuestra (span 1) — vacío
    <span key={`c4-${muestra.id_muestra}`} />,
    // [5] Prueba (span 2) — vacío
    <span key={`c5-${muestra.id_muestra}`} />,
    // [6] Estudio (span 1) — vacío
    <span key={`c6-${muestra.id_muestra}`} />,
    // [7] Recepción (span 1) — vacío
    <span key={`c7-${muestra.id_muestra}`} />,
    // [8] Estado (span 1)
    <div key={`estado-${muestra.id_muestra}`} className="min-w-0">
      {muestra.estadoInfo ? (
        <EstadoBadge estado={muestra.estadoInfo} size="sm" showTooltip={true} />
      ) : (
        <span className="text-surface-300 text-xs">—</span>
      )}
    </div>
  ]

  // Modo standalone: 9 campos — orden idéntico al COLUMN_CONFIG de MuestrasPage:
  // CódEXT(1) CódEPI(1) Cliente(1) Paciente(1) TipoMuestra(1) Prueba(2) Estudio(1) Recepción(1) Estado(1) Actions(2)
  const renderStandaloneFields = (): ReactNode[] => [
    // [0] Código EXTERNO (span 1) — icono de tipo + código
    <div key={`ext-${muestra.id_muestra}`} className="flex items-center gap-1 min-w-0">
      {typeIcon}
      <span
        className="font-mono text-xs font-semibold text-primary-600 truncate"
        title={muestra.codigo_externo || ''}
      >
        {muestra.codigo_externo || '—'}
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
    // [3] Paciente (span 1)
    <span
      key={`paciente-${muestra.paciente?.id}`}
      className="block text-xs text-surface-800 font-medium truncate"
      title={muestra.paciente?.nombre || ''}
    >
      {muestra.paciente?.nombre || '—'}
    </span>,
    // [4] Tipo de muestra (span 1)
    <span
      key={`tipo-${muestra.tipo_muestra?.id}`}
      className="block text-xs text-surface-600 truncate"
      title={muestra.tipo_muestra?.tipo_muestra || ''}
    >
      {muestra.tipo_muestra?.tipo_muestra || '—'}
    </span>,
    // [5] Prueba (span 2)
    <span
      key={`prueba-${muestra.prueba?.id}`}
      className="block text-xs text-surface-700 truncate"
      title={muestra.prueba?.prueba || ''}
    >
      {muestra.prueba?.prueba || '—'}
    </span>,
    // [6] Estudio (span 1)
    <span
      key={`estudio-${muestra.id_muestra}`}
      className="block text-xs text-surface-600 truncate"
      title={muestra.estudio || ''}
    >
      {muestra.estudio || '—'}
    </span>,
    // [7] Fecha Recepción (span 1)
    <span
      key={`fecha-${muestra.id_muestra}`}
      className="block text-xs text-surface-500 font-mono whitespace-nowrap"
    >
      {formatDateTime(muestra.f_recepcion)}
    </span>,
    // [8] Estado (span 1)
    <div key={`estado-${muestra.id_muestra}`} className="min-w-0">
      {muestra.estadoInfo ? (
        <EstadoBadge estado={muestra.estadoInfo} size="sm" showTooltip={true} />
      ) : (
        <span className="text-surface-300 text-xs">—</span>
      )}
    </div>
  ]

  const renderFields = isChild ? renderChildFields : renderStandaloneFields

  // Handler para duplicar muestra
  const handleDuplicate = () => {
    navigate(`/muestras/nueva?duplicar=${muestra.id_muestra}`)
  }

  // Acciones: Upload (sólo tipo_array), Duplicar, Editar, Eliminar
  const actions: ListDetailAction[] = [
    ...(muestra.tipo_array === true
      ? [
          {
            icon: <Upload className="w-4 h-4" />,
            onClick: () => setImportArrayModalOpen(true),
            title: allArrayPositionsHaveCodes
              ? 'Todas las posiciones ya tienen código externo'
              : 'Importar códigos externos de placa desde CSV',
            disabled: allArrayPositionsHaveCodes,
            className: allArrayPositionsHaveCodes
              ? 'p-1 text-surface-300 cursor-not-allowed rounded transition-colors'
              : 'p-1 text-accent-600 hover:bg-accent-50 rounded transition-colors'
          }
        ]
      : []),
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
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(muestra),
      title: 'Eliminar',
      className: 'p-1 text-danger-600 hover:bg-danger-50 rounded transition-colors'
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

  // Contenido expandido con las técnicas (sólo en modo standalone)
  const expandedContent = isChild ? undefined : (
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
        expandedContent={expandedContent}
        rowClassName={isChild ? childRowClassName : ''}
      />
      {muestra.tipo_array === true && (
        <ImportArrayCodExternoModal
          isOpen={importArrayModalOpen}
          onClose={() => setImportArrayModalOpen(false)}
          muestraId={muestra.id_muestra}
          codigoEpi={muestra.codigo_epi}
        />
      )}
    </>
  )
}
