// src/features/muestras/components/MuestraList/MuestraGroupRow.tsx
//
// Fila agrupadora (padre) para muestras con el mismo estudio.
// - Ocupa las mismas 12 columnas que las filas normales (mismo grid).
// - Acciones: sólo botón de importar CSV; sin editar/eliminar/duplicar.
// - Al hacer click expande/colapsa sus filas hijas.
// - Hijas usan los mismos spans que el padre (parentFieldSpans).

import { useState } from 'react'
import { ChevronRight, ChevronDown, Layers, Upload, Edit } from 'lucide-react'
import { MuestraGroup } from '../../interfaces/muestras.types'
import { MuestraListDetail } from './MuestraListDetail'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { formatDateTime, getColSpanClass } from '@/shared/utils/helpers'
import { ImportCodExternoModal } from './ImportCodExternoModal'
import { ImportGroupArrayCodExternoModal } from './ImportGroupArrayCodExternoModal'

interface Props {
  group: MuestraGroup
  onEdit: (m: import('../../interfaces/muestras.types').Muestra) => void
  onDelete: (m: import('../../interfaces/muestras.types').Muestra) => void
  onComplete?: (m: import('../../interfaces/muestras.types').Muestra) => void
  onEditGroup: (group: MuestraGroup) => void
  parentFieldSpans: number[]
}

export const MuestraGroupRow = ({
  group,
  onEdit,
  onDelete,
  onComplete,
  onEditGroup,
  parentFieldSpans
}: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const { parent, children, key } = group

  const total = children.length
  const allHaveCodExterno = children.every(m => !!m.codigo_externo)
  const isAllPlacas = children.every(m => m.tipo_array === true)

  const cols: { content: React.ReactNode; span: number }[] = [
    // [0] Chevron + Layers + badge contador (span 2 — fusiona CódEXT+CódEPI)
    {
      span: 2,
      content: (
        <div className="flex items-center gap-1 min-w-0">
          <Layers className="w-3.5 h-3.5 shrink-0 text-primary-500" />
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-primary-600" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-primary-500" />
          )}
          <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-2 py-0.5 text-xs font-semibold text-primary-700 ml-0.5">
            {total} {isAllPlacas ? 'placas' : 'muestras'}
          </span>
        </div>
      )
    },
    // [1] Cliente
    {
      span: 1,
      content: (
        <span
          className="block text-xs text-surface-600 truncate"
          title={parent.solicitud?.cliente?.nombre ?? ''}
        >
          {parent.solicitud?.cliente?.nombre || '—'}
        </span>
      )
    },
    // [2] Tipo muestra  [era [3], Paciente eliminado]
    {
      span: 1,
      content: (
        <span
          className="block text-xs text-surface-500 truncate"
          title={parent.tipo_muestra?.tipo_muestra ?? ''}
        >
          {parent.tipo_muestra?.tipo_muestra || '—'}
        </span>
      )
    },
    // [3] Prueba (span 1)
    {
      span: 1,
      content: (
        <span
          className="block text-xs text-surface-700 truncate"
          title={parent.prueba?.prueba ?? ''}
        >
          {parent.prueba?.prueba || '—'}
        </span>
      )
    },
    // [4] Estudio
    {
      span: 1,
      content: (
        <span className="block text-xs font-bold text-surface-900 truncate" title={key}>
          {key}
        </span>
      )
    },
    // [5] Recepción
    {
      span: 1,
      content: (
        <div title={formatDateTime(parent.f_recepcion)}>
          {parent.f_recepcion ? (
            <>
              <span className="block text-xs text-surface-500 font-mono">
                {formatDateTime(parent.f_recepcion).split(' ')[0]}
              </span>
              <span className="block text-xs text-surface-400 font-mono">
                {formatDateTime(parent.f_recepcion).split(' ')[1]}
              </span>
            </>
          ) : (
            <span className="text-xs text-surface-300">—</span>
          )}
        </div>
      )
    },
    // [6] vacío — alinea con la columna Técnicas de las filas hijas
    {
      span: 1,
      content: <span />
    },
    // [7] Estado (span 2)
    {
      span: 2,
      content: (
        <div className="min-w-0 overflow-hidden" title={parent.estadoInfo?.estado || ''}>
          {parent.estadoInfo ? (
            <EstadoBadge estado={parent.estadoInfo} size="sm" showTooltip={false} />
          ) : (
            <span className="text-surface-300 text-xs">—</span>
          )}
        </div>
      )
    },
    // [8] Acciones (span 2)
    {
      span: 2,
      content: (
        <div className="flex items-center justify-end gap-1">
          {isAllPlacas && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onEditGroup(group)
              }}
              title="Editar datos compartidos del grupo"
              className="rounded p-1 transition-colors text-primary-600 hover:bg-primary-50"
              aria-label="Editar grupo"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setImportModalOpen(true)
            }}
            title={
              allHaveCodExterno
                ? 'Reimportar códigos externos (sobreescribir existentes)'
                : 'Importar códigos externos desde CSV'
            }
            className={[
              'rounded p-1 transition-colors',
              allHaveCodExterno
                ? 'text-success-600 hover:bg-success-50'
                : 'text-primary-600 hover:bg-primary-50'
            ].join(' ')}
            aria-label="Importar códigos externos"
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Fila padre */}
      <div
        className={[
          'grid grid-cols-12 gap-2 items-center px-3 py-2 cursor-pointer select-none',
          'border-b border-surface-100 transition-colors',
          expanded
            ? 'bg-primary-50 border-l-4 border-l-primary-400'
            : 'bg-surface-50 hover:bg-primary-50 border-l-4 border-l-transparent'
        ].join(' ')}
        onClick={() => setExpanded(v => !v)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded(v => !v)
          }
        }}
      >
        {cols.map((col, i) => (
          <div key={i} className={`${getColSpanClass(col.span)} min-w-0 overflow-hidden`}>
            {col.content}
          </div>
        ))}
      </div>

      {/* Modal de importación de códigos externos */}
      {isAllPlacas ? (
        <ImportGroupArrayCodExternoModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          estudio={key}
          muestras={children}
        />
      ) : (
        <ImportCodExternoModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          estudio={key}
          muestras={children}
        />
      )}

      {/* Filas hijas — visibles sólo cuando expanded */}
      {expanded ? (
        <div className="border-l-4 border-l-primary-200 bg-white">
          {children.map(child => (
            <MuestraListDetail
              key={child.id_muestra}
              muestra={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
              fieldSpans={parentFieldSpans}
              isChild
              childCanExpand={true}
              hideEditAndDuplicate={isAllPlacas}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
