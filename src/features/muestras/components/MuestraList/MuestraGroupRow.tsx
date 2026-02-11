// src/features/muestras/components/MuestraList/MuestraGroupRow.tsx
//
// Fila agrupadora (padre) para muestras con el mismo estudio.
// - Ocupa las mismas 12 columnas que las filas normales (mismo grid).
// - Acciones: sólo botón de importar CSV; sin editar/eliminar/duplicar.
// - Al hacer click expande/colapsa sus filas hijas.
// - Hijas usan los mismos spans que el padre (parentFieldSpans).

import { useState } from 'react'
import { ChevronRight, ChevronDown, Layers, Upload } from 'lucide-react'
import { MuestraGroup } from '../../interfaces/muestras.types'
import { MuestraListDetail } from './MuestraListDetail'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { formatDateTime, getColSpanClass } from '@/shared/utils/helpers'
import { ImportCodExternoModal } from './ImportCodExternoModal'

interface Props {
  group: MuestraGroup
  onEdit: (m: import('../../interfaces/muestras.types').Muestra) => void
  onDelete: (m: import('../../interfaces/muestras.types').Muestra) => void
  parentFieldSpans: number[]
}

export const MuestraGroupRow = ({ group, onEdit, onDelete, parentFieldSpans }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const { parent, children, key } = group

  const total = children.length
  const allHaveCodExterno = children.every(m => !!m.codigo_externo)

  // Layout del padre — se usan spans propios (suma = 12):
  // Estudio(2) Cliente(1) Paciente(1) Tipo(1) Prueba(2) Count(1) Recepción(1) Estado(1) Acciones(2)
  // Col[0] toma span 2 (fusiona CódEXT + CódEPI) para acomodar mejor el estudio.
  const cols: { content: React.ReactNode; span: number }[] = [
    // [0+1] Chevron + Layers + badge contador de muestras (span 2)
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
            {total} muestras
          </span>
        </div>
      )
    },
    // [2] Cliente
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
    // [3] Paciente
    {
      span: 1,
      content: (
        <span
          className="block text-xs text-surface-700 font-medium truncate"
          title={parent.paciente?.nombre ?? ''}
        >
          {parent.paciente?.nombre || '—'}
        </span>
      )
    },
    // [4] Tipo muestra
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
    // [5] Prueba (span 2)
    {
      span: 2,
      content: (
        <span
          className="block text-xs text-surface-700 truncate"
          title={parent.prueba?.prueba ?? ''}
        >
          {parent.prueba?.prueba || '—'}
        </span>
      )
    },
    // [6] Nombre del estudio
    {
      span: 1,
      content: (
        <span className="block text-xs font-bold text-surface-900 truncate" title={key}>
          {key}
        </span>
      )
    },
    // [7] Recepción
    {
      span: 1,
      content: (
        <span className="block text-xs text-surface-500 font-mono whitespace-nowrap">
          {formatDateTime(parent.f_recepcion)}
        </span>
      )
    },
    // [8] Estado (span 1)
    {
      span: 1,
      content: (
        <div className="min-w-0">
          {parent.estadoInfo ? (
            <EstadoBadge estado={parent.estadoInfo} size="sm" />
          ) : (
            <span className="text-surface-300 text-xs">—</span>
          )}
        </div>
      )
    },
    // [9] Acciones (span 2) — Upload alineado a la derecha
    {
      span: 2,
      content: (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              if (!allHaveCodExterno) setImportModalOpen(true)
            }}
            disabled={allHaveCodExterno}
            title={
              allHaveCodExterno
                ? 'Todas las muestras ya tienen código externo'
                : 'Importar códigos externos desde CSV'
            }
            className={[
              'rounded p-1 transition-colors',
              allHaveCodExterno
                ? 'cursor-not-allowed text-surface-300'
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
      <ImportCodExternoModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        estudio={key}
        muestras={children}
      />

      {/* Filas hijas — visibles sólo cuando expanded */}
      {expanded ? (
        <div className="border-l-4 border-l-primary-200 bg-white">
          {children.map(child => (
            <MuestraListDetail
              key={child.id_muestra}
              muestra={child}
              onEdit={onEdit}
              onDelete={onDelete}
              fieldSpans={parentFieldSpans}
              isChild
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
