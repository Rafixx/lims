// src/features/plantillaTecnica/components/TemplateRenderer/CalcNodeRenderer.tsx

import { Calculator } from 'lucide-react'
import { CalcNode } from '../../interfaces/template.types'

interface Props {
  node: CalcNode
  value: number | string | undefined
}

export const CalcNodeRenderer = ({ node, value }: Props) => {
  const hasValue = value !== undefined

  const displayValue = hasValue
    ? typeof value === 'number'
      ? Number.isInteger(value)
        ? value.toString()
        : value.toFixed(2)
      : String(value)
    : null

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-md bg-primary-50 border border-primary-100">
      {/* Etiqueta */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Calculator className="w-3 h-3 text-primary-300 flex-shrink-0" />
        <span className="text-xs text-surface-500 truncate leading-tight">{node.label}</span>
      </div>

      {/* Valor calculado */}
      <div className="flex items-baseline gap-1 flex-shrink-0">
        {hasValue ? (
          <>
            <span className="text-base font-bold font-mono tabular-nums text-primary-800 leading-none">
              {displayValue}
            </span>
            {node.unit && (
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
                {node.unit}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-surface-300 font-mono">—</span>
        )}
      </div>
    </div>
  )
}
