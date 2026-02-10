// src/features/muestras/components/MuestraList/MuestraGroupRow.tsx
//
// Fila agrupadora (padre) para muestras con el mismo estudio.
// - Ocupa las mismas 12 columnas que las filas normales (mismo grid).
// - NO tiene acciones de editar/eliminar.
// - Al hacer click expande/colapsa sus filas hijas.

import { useState } from 'react'
import { ChevronRight, ChevronDown, Layers, Upload } from 'lucide-react'
import { MuestraGroup } from '../../interfaces/muestras.types'
import { MuestraListDetail } from './MuestraListDetail'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { formatDateTime } from '@/shared/utils/helpers'
import { ImportCodExternoModal } from './ImportCodExternoModal'

// Spans de las filas hijas (compactas):
// indent(1) cód_ext(2) cód_epi(2) placa_icon(1) estado(4) acciones(2) = 12
const CHILD_FIELD_SPANS = [2, 2, 1, 4, 2, 1]

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
  // Bloquear importación si todas las muestras ya tienen código externo
  const allHaveCodExterno = children.every(m => !!m.codigo_externo)

  // Construir los campos del padre con los mismos spans que las filas normales.
  // Cols 1-2 → icon + estudio (en lugar de cód_ext + cód_epi)
  // Cols 3-10 → Cliente, Paciente, Tipo, Prueba(2), N muestras, Recepción
  // Cols 11-12 → vacío (no estado, no acciones en agrupador)
  // Layout del padre alineado con COLUMN_CONFIG de MuestrasPage:
  // [0] Cód EXT(1)  → botón importar CSV
  // [1] Cód EPI(1)  → toggle expandir + icono grupo + nombre estudio
  // [2] Cliente(1)
  // [3] Paciente(1)
  // [4] Tipo(1)
  // [5] Prueba(2)
  // [6] Estudio(1)  → badge contador muestras
  // [7] Recepción(1)
  // [8] Estado(2)
  // [9] Acciones(1) → vacío (sin editar/eliminar en agrupador)
  const cols = [
    // [0] Cód EXT — botón importar CSV (izquierda)
    <div key="import" className="flex items-center">
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
    </div>,
    // [1] Cód EPI — toggle expandir + icono grupo + nombre estudio
    <button
      key="toggle"
      type="button"
      onClick={() => setExpanded(v => !v)}
      className="flex items-center gap-1 text-primary-600 hover:text-primary-800 transition-colors min-w-0 w-full"
      aria-label={expanded ? 'Contraer grupo' : 'Expandir grupo'}
    >
      {expanded ? (
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
      )}
      <Layers className="w-3.5 h-3.5 shrink-0" />
      <span className="block text-xs font-bold text-surface-900 truncate ml-0.5" title={key}>
        {key}
      </span>
    </button>,
    // [2] Cliente
    <span
      key="cliente"
      className="block text-xs text-surface-600 truncate"
      title={parent.solicitud?.cliente?.nombre ?? ''}
    >
      {parent.solicitud?.cliente?.nombre || '—'}
    </span>,
    // [3] Paciente
    <span
      key="paciente"
      className="block text-xs text-surface-700 font-medium truncate"
      title={parent.paciente?.nombre ?? ''}
    >
      {parent.paciente?.nombre || '—'}
    </span>,
    // [4] Tipo muestra
    <span
      key="tipo"
      className="block text-xs text-surface-500 truncate"
      title={parent.tipo_muestra?.tipo_muestra ?? ''}
    >
      {parent.tipo_muestra?.tipo_muestra || '—'}
    </span>,
    // [5] Prueba (span 2)
    <span
      key="prueba"
      className="block text-xs text-surface-700 truncate"
      title={parent.prueba?.prueba ?? ''}
    >
      {parent.prueba?.prueba || '—'}
    </span>,
    // [6] Estudio → badge con el contador de muestras del grupo
    <span
      key="count"
      className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-2 py-0.5 text-xs font-semibold text-primary-700"
    >
      {total} muestras
    </span>,
    // [7] Recepción
    <span key="fecha" className="block text-xs text-surface-500 font-mono whitespace-nowrap">
      {formatDateTime(parent.f_recepcion)}
    </span>,
    // [8] Estado (span 2)
    <div key="estado" className="min-w-0">
      {parent.estadoInfo ? (
        <EstadoBadge estado={parent.estadoInfo} size="sm" />
      ) : (
        <span className="text-surface-300 text-xs">—</span>
      )}
    </div>,
    // [9] Acciones — vacío (el agrupador no tiene editar/eliminar)
    <span key="actions" />
  ]

  return (
    <div>
      {/* Fila padre */}
      <div
        className={[
          'grid gap-x-2 items-center px-3 py-2 cursor-pointer select-none',
          'border-b border-surface-100 transition-colors',
          expanded
            ? 'bg-primary-50 border-l-4 border-l-primary-400'
            : 'bg-surface-50 hover:bg-primary-50 border-l-4 border-l-transparent'
        ].join(' ')}
        style={{ gridTemplateColumns: parentFieldSpans.map(s => `${s}fr`).join(' ') }}
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
          <div key={i} style={{ gridColumn: `span ${parentFieldSpans[i]} / span ${parentFieldSpans[i]}` }}>
            {col}
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
          {/* Sub-cabecera de hijos */}
          <div
            className="grid gap-x-2 items-center px-3 py-1 border-b border-surface-100 bg-surface-50"
            style={{ gridTemplateColumns: CHILD_FIELD_SPANS.map(s => `${s}fr`).join(' ') }}
          >
            <div className="col-span-2" />
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide col-span-2">
              Cód Externo
            </span>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide col-span-2">
              Cód EPI
            </span>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide" />
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide col-span-4">
              Estado
            </span>
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide col-span-2" />
            <span className="text-xs font-medium text-surface-500 uppercase tracking-wide" />
          </div>

          {children.map(child => (
            <MuestraListDetail
              key={child.id_muestra}
              muestra={child}
              onEdit={onEdit}
              onDelete={onDelete}
              fieldSpans={CHILD_FIELD_SPANS}
              isChild
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
