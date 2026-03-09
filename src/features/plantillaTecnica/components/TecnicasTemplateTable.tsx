// src/features/plantillaTecnica/components/TecnicasTemplateTable.tsx
//
// Tabla de entrada de datos por muestra para plantillas con scope TECNICA.
// Estado centralizado en el padre. Botón global de guardado. Paginación PAGE_SIZE=12.

import { useState, useMemo, useCallback } from 'react'
import { Save, FlaskConical, ChevronLeft, ChevronRight, AlertCircle, TestTube } from 'lucide-react'
import { evaluateExpression } from '../utils/expressionEvaluator'
import type {
  Template,
  TemplateNode,
  InputNode,
  CalcNode,
  TemplateValues
} from '../interfaces/template.types'
import type { Tecnica } from '@/features/workList/interfaces/worklist.types'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flattenInputNodes(nodes: TemplateNode[]): InputNode[] {
  const result: InputNode[] = []
  for (const node of nodes) {
    if (node.type === 'input') result.push(node)
    else if (node.type === 'group') result.push(...flattenInputNodes(node.children))
  }
  return result
}

function flattenCalcNodes(nodes: TemplateNode[]): CalcNode[] {
  const result: CalcNode[] = []
  for (const node of nodes) {
    if (node.type === 'calc') result.push(node)
    else if (node.type === 'group') result.push(...flattenCalcNodes(node.children))
  }
  return result
}

function computeCalcs(calcNodes: CalcNode[], inputValues: TemplateValues): TemplateValues {
  const result: TemplateValues = {}
  const MAX_PASSES = 3
  let pass = 0
  let hasChanges = true

  while (pass < MAX_PASSES && hasChanges) {
    hasChanges = false
    pass++
    const allVals = { ...inputValues, ...result }
    for (const node of calcNodes) {
      if (result[node.key] !== undefined) continue
      const val = evaluateExpression(node.expr.value, allVals)
      if (val !== undefined) {
        result[node.key] = val
        hasChanges = true
      }
    }
  }
  return result
}

function initRowValues(inputNodes: InputNode[], saved?: TemplateValues): TemplateValues {
  const values: TemplateValues = {}
  for (const node of inputNodes) {
    if (saved?.[node.key] !== undefined) {
      values[node.key] = saved[node.key]
    } else if (node.default !== undefined) {
      values[node.key] = node.default
    }
  }
  return values
}

function formatCalcValue(val: number | string | boolean | undefined): string {
  if (val === undefined) return '—'
  if (typeof val === 'number') {
    return Number.isInteger(val) ? String(val) : val.toFixed(2)
  }
  return String(val)
}

function valuesAreEqual(a: TemplateValues, b: TemplateValues, keys: string[]): boolean {
  return keys.every(k => String(a[k] ?? '') === String(b[k] ?? ''))
}

// ---------------------------------------------------------------------------
// Tipos de estado centralizado
// ---------------------------------------------------------------------------

type RowState = {
  values: TemplateValues
  savedVals: TemplateValues
  justSaved: boolean
}

type TableState = Map<number, RowState>

function buildInitialState(tecnicas: Tecnica[], inputNodes: InputNode[]): TableState {
  const map: TableState = new Map()
  for (const t of tecnicas) {
    if (t.id_tecnica === undefined) continue
    const initial = initRowValues(inputNodes, t.datos_plantilla)
    map.set(t.id_tecnica, { values: initial, savedVals: initial, justSaved: false })
  }
  return map
}

// ---------------------------------------------------------------------------
// Fila individual (presentacional — sin estado propio)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Celda de resultados (solo lectura)
// ---------------------------------------------------------------------------

const ResultadosCell = ({ tecnica }: { tecnica: Tecnica }) => {
  const resultados = tecnica.resultados

  if (!resultados || resultados.length === 0) {
    return (
      <td className="px-3 py-2 border-l border-surface-200" colSpan={3}>
        <span className="text-[10px] text-surface-300 italic">Sin resultados</span>
      </td>
    )
  }

  return (
    <>
      <td className="px-2 py-1 border-l border-surface-200 align-top">
        <div className="space-y-0.5">
          {resultados.map((r, i) => (
            <div key={i} className="text-[10px] text-surface-700 truncate max-w-[120px]" title={r.tipo_res}>
              {r.tipo_res}
            </div>
          ))}
        </div>
      </td>
      <td className="px-2 py-1 align-top">
        <div className="space-y-0.5">
          {resultados.map((r, i) => (
            <div key={i} className="text-[10px] font-semibold text-success-600 text-right tabular-nums">
              {r.valor !== null && r.valor !== undefined ? r.valor : '—'}
            </div>
          ))}
        </div>
      </td>
      <td className="px-2 py-1 align-top">
        <div className="space-y-0.5">
          {resultados.map((r, i) => (
            <div key={i} className="text-[10px] text-surface-500 truncate max-w-[60px]" title={r.unidades ?? ''}>
              {r.unidades || '—'}
            </div>
          ))}
        </div>
      </td>
    </>
  )
}

// ---------------------------------------------------------------------------
// Fila individual
// ---------------------------------------------------------------------------

interface RowProps {
  tecnica: Tecnica
  inputNodes: InputNode[]
  calcNodes: CalcNode[]
  rowState: RowState
  inputKeys: string[]
  onChangeValue: (tecnicaId: number, key: string, raw: string) => void
}

const TecnicaTableRow = ({
  tecnica,
  inputNodes,
  calcNodes,
  rowState,
  inputKeys,
  onChangeValue
}: RowProps) => {
  const { values, savedVals, justSaved } = rowState
  const isDirty = !valuesAreEqual(values, savedVals, inputKeys)

  const calcValues = useMemo(
    () => computeCalcs(calcNodes, values),
    [calcNodes, values]
  )

  const codigoEpi =
    tecnica.muestraArray?.codigo_epi ?? tecnica.muestra?.codigo_epi ?? '—'
  const codigoExterno =
    tecnica.muestraArray?.codigo_externo ?? tecnica.muestra?.codigo_externo ?? '—'

  const tecnicaId = tecnica.id_tecnica!

  return (
    <tr
      className={`
        border-b border-surface-100 transition-colors
        hover:bg-surface-50/60
        ${justSaved ? 'bg-success-50/30' : isDirty ? 'bg-warning-50/30' : ''}
      `}
    >
      {/* Cód. Externo */}
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="font-mono text-[11px] font-medium text-surface-500 leading-none">
          {codigoExterno !== '—' ? codigoExterno : (
            <span className="italic text-surface-300">—</span>
          )}
        </span>
      </td>

      {/* Cód. EPI */}
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="font-mono text-[11px] font-semibold text-primary-700 leading-none">
          {codigoEpi}
        </span>
      </td>

      {/* Indicador de estado (dirty / saved) */}
      <td className="px-2 py-2 w-5">
        {isDirty && !justSaved && (
          <span
            className="block w-1.5 h-1.5 rounded-full bg-warning-500 mx-auto"
            title="Modificado, pendiente de guardar"
          />
        )}
        {justSaved && (
          <span
            className="block w-1.5 h-1.5 rounded-full bg-success-500 mx-auto"
            title="Guardado"
          />
        )}
      </td>

      {/* Celdas de input — estilo spreadsheet */}
      {inputNodes.map(node => (
        <td key={node.key} className="px-2 py-1">
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={values[node.key] !== undefined ? String(values[node.key]) : ''}
            onChange={e => onChangeValue(tecnicaId, node.key, e.target.value)}
            placeholder={node.default !== undefined ? String(node.default) : '·'}
            className="
              w-full min-w-[72px] max-w-[110px]
              text-right font-mono text-[12px] text-surface-900
              bg-transparent
              border-b border-surface-200
              hover:border-surface-400
              focus:border-primary-500 focus:outline-none
              placeholder:text-surface-300
              py-1 pr-0.5
              transition-colors duration-100
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        </td>
      ))}

      {/* Celdas de cálculo — solo lectura */}
      {calcNodes.map(node => (
        <td
          key={node.key}
          className="px-3 py-2 bg-primary-50/60 border-x border-primary-100/60"
        >
          <span
            className={`
              block text-right font-mono text-[12px] tabular-nums leading-none
              ${calcValues[node.key] !== undefined
                ? 'font-semibold text-primary-800'
                : 'text-surface-300 italic'}
            `}
          >
            {formatCalcValue(calcValues[node.key])}
          </span>
        </td>
      ))}

      {/* Columnas de resultado */}
      <ResultadosCell tecnica={tecnica} />
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Paginación
// ---------------------------------------------------------------------------

interface PaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  totalItems: number
  pageSize: number
}

const Pagination = ({ page, totalPages, onPrev, onNext, totalItems, pageSize }: PaginationProps) => {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-surface-200 bg-surface-50/60">
      <span className="text-[11px] text-surface-500">
        {start}–{end} de {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="
            p-1 rounded
            text-surface-500
            hover:bg-surface-100 hover:text-surface-800
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors
          "
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-medium text-surface-700 px-2">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="
            p-1 rounded
            text-surface-500
            hover:bg-surface-100 hover:text-surface-800
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors
          "
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export type SavePar = { tecnicaId: number; values: TemplateValues }

interface Props {
  tecnicas: Tecnica[]
  template: Template
  onSave: (pares: SavePar[]) => Promise<void>
  isSaving?: boolean
}

export const TecnicasTemplateTable = ({ tecnicas, template, onSave, isSaving = false }: Props) => {
  const inputNodes = useMemo(() => flattenInputNodes(template.nodes), [template.nodes])
  const calcNodes = useMemo(() => flattenCalcNodes(template.nodes), [template.nodes])
  const inputKeys = useMemo(() => inputNodes.map(n => n.key), [inputNodes])

  const hasCalcs = calcNodes.length > 0

  // Estado centralizado
  const [tableState, setTableState] = useState<TableState>(() =>
    buildInitialState(tecnicas, inputNodes)
  )
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(tecnicas.length / PAGE_SIZE))
  const paginated = tecnicas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Número de filas con cambios sin guardar (en TODAS las páginas)
  const dirtyCount = useMemo(() => {
    let count = 0
    for (const [, rowState] of tableState) {
      if (!valuesAreEqual(rowState.values, rowState.savedVals, inputKeys)) count++
    }
    return count
  }, [tableState, inputKeys])

  const handleChangeValue = useCallback((tecnicaId: number, key: string, raw: string) => {
    const num = parseFloat(raw)
    setTableState(prev => {
      const existing = prev.get(tecnicaId)
      if (!existing) return prev
      const next = new Map(prev)
      next.set(tecnicaId, {
        ...existing,
        values: {
          ...existing.values,
          [key]: raw === '' ? undefined : (isNaN(num) ? undefined : num)
        },
        justSaved: false
      })
      return next
    })
  }, [])

  const handleSaveAll = async () => {
    const pares: SavePar[] = []
    for (const [tecnicaId, rowState] of tableState) {
      if (!valuesAreEqual(rowState.values, rowState.savedVals, inputKeys)) {
        pares.push({ tecnicaId, values: rowState.values })
      }
    }
    if (pares.length === 0 || isSaving) return

    await onSave(pares)

    // Marcar como guardadas
    setTableState(prev => {
      const next = new Map(prev)
      for (const { tecnicaId, values } of pares) {
        const existing = next.get(tecnicaId)
        if (existing) {
          next.set(tecnicaId, { values, savedVals: { ...values }, justSaved: true })
        }
      }
      return next
    })

    // Limpiar justSaved después de 2.5s
    setTimeout(() => {
      setTableState(prev => {
        const next = new Map(prev)
        for (const { tecnicaId } of pares) {
          const existing = next.get(tecnicaId)
          if (existing?.justSaved) {
            next.set(tecnicaId, { ...existing, justSaved: false })
          }
        }
        return next
      })
    }, 2500)
  }

  const getRowState = (tecnica: Tecnica): RowState => {
    const id = tecnica.id_tecnica
    if (id !== undefined && tableState.has(id)) return tableState.get(id)!
    const initial = initRowValues(inputNodes, tecnica.datos_plantilla)
    return { values: initial, savedVals: initial, justSaved: false }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dirtyCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-warning-700 bg-warning-50 border border-warning-200 rounded-md px-2 py-1">
              <AlertCircle className="w-3 h-3" />
              {dirtyCount} {dirtyCount === 1 ? 'fila modificada' : 'filas modificadas'}
            </span>
          )}
        </div>
        <button
          onClick={handleSaveAll}
          disabled={dirtyCount === 0 || isSaving}
          className="
            inline-flex items-center gap-1.5
            px-3 py-1.5 rounded-md
            text-[11px] font-semibold
            bg-primary-600 text-white
            hover:bg-primary-700 active:bg-primary-800
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-100
          "
        >
          <Save className="w-3.5 h-3.5 stroke-[2]" />
          {isSaving
            ? 'Guardando···'
            : dirtyCount > 0
              ? `Guardar ${dirtyCount} ${dirtyCount === 1 ? 'cambio' : 'cambios'}`
              : 'Guardar cambios'}
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-surface-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-100">
              {/* Columnas de identidad */}
              <th className="px-3 py-2.5 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wide text-surface-500">
                  Cód. Ext
                </span>
              </th>
              <th className="px-3 py-2.5 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wide text-surface-500">
                  Cód. Epi
                </span>
              </th>
              {/* Columna de estado */}
              <th className="w-5" />

              {/* Columnas de input */}
              {inputNodes.map(node => (
                <th key={node.key} className="px-2 py-2.5 text-right min-w-[90px]">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-surface-700 leading-snug">
                    {node.label}
                    {node.unit && (
                      <span className="text-surface-400 font-normal normal-case ml-0.5">
                        ({node.unit})
                      </span>
                    )}
                    {node.required && (
                      <span className="text-danger-500 ml-0.5 font-bold">*</span>
                    )}
                  </div>
                </th>
              ))}

              {/* Columnas de cálculo */}
              {hasCalcs && calcNodes.map((node, i) => (
                <th
                  key={node.key}
                  className={`
                    px-3 py-2.5 text-right min-w-[90px]
                    bg-primary-50
                    ${i === 0 ? 'border-l border-primary-100' : ''}
                    ${i === calcNodes.length - 1 ? 'border-r border-primary-100' : ''}
                  `}
                >
                  <div className="flex items-center justify-end gap-1">
                    {i === 0 && (
                      <FlaskConical className="w-3 h-3 text-primary-400 shrink-0" />
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-wide text-primary-700 leading-snug">
                      {node.label}
                      {node.unit && (
                        <span className="text-primary-400 font-normal normal-case ml-0.5">
                          ({node.unit})
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}

              {/* Columnas de resultado */}
              <th className="px-2 py-2.5 text-left border-l border-surface-200 min-w-[110px]">
                <div className="flex items-center gap-1">
                  <TestTube className="w-3 h-3 text-surface-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-surface-500">
                    Tipo resultado
                  </span>
                </div>
              </th>
              <th className="px-2 py-2.5 text-right min-w-[70px]">
                <span className="text-[10px] font-bold uppercase tracking-wide text-surface-500">
                  Valor
                </span>
              </th>
              <th className="px-2 py-2.5 text-left min-w-[60px]">
                <span className="text-[10px] font-bold uppercase tracking-wide text-surface-500">
                  Unidades
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(tecnica => (
              <TecnicaTableRow
                key={tecnica.id_tecnica ?? tecnica.id_muestra}
                tecnica={tecnica}
                inputNodes={inputNodes}
                calcNodes={calcNodes}
                rowState={getRowState(tecnica)}
                inputKeys={inputKeys}
                onChangeValue={handleChangeValue}
              />
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          totalItems={tecnicas.length}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  )
}
