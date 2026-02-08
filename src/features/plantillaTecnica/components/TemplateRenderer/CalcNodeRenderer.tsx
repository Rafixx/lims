// src/features/plantillaTecnica/components/TemplateRenderer/CalcNodeRenderer.tsx

import { Label } from '@/shared/components/atoms/Label'
import { Calculator } from 'lucide-react'
import { CalcNode } from '../../interfaces/template.types'

interface Props {
  node: CalcNode
  value: number | string | undefined
}

export const CalcNodeRenderer = ({ node, value }: Props) => {
  const displayValue =
    value !== undefined ? (typeof value === 'number' ? value.toFixed(1) : value) : '—'

  return (
    <div className="space-y-2">
      <Label htmlFor={node.key} className="flex items-center gap-2">
        <Calculator className="w-4 h-4 text-purple-600" />
        {node.label}
      </Label>
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-md">
        <span className="flex-1 text-purple-900 font-mono font-semibold">{displayValue}</span>
        {node.unit && <span className="text-sm text-purple-600 font-medium">{node.unit}</span>}
      </div>
      <p className="text-xs text-gray-500 italic">Calculado: {node.expr.value}</p>
    </div>
  )
}
