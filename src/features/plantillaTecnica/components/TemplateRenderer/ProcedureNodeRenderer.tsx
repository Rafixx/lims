// src/features/plantillaTecnica/components/TemplateRenderer/ProcedureNodeRenderer.tsx

import { ClipboardList } from 'lucide-react'
import { ProcedureNode } from '../../interfaces/template.types'

interface Props {
  node: ProcedureNode
}

export const ProcedureNodeRenderer = ({ node }: Props) => {
  return (
    <div className="rounded-lg border border-info-200 bg-info-50 overflow-hidden shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-info-100 border-b border-info-200">
        <ClipboardList className="w-3.5 h-3.5 text-info-600 flex-shrink-0" />
        <h3 className="text-xs font-semibold text-info-800 uppercase tracking-wider">{node.label}</h3>
      </div>

      {/* Pasos del procedimiento */}
      <div className="px-4 py-3 space-y-2">
        {node.steps.map((step, index) => (
          <div key={index} className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-info-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-info-900">{step.label}</p>
              {step.text && step.text !== step.label && (
                <p className="text-xs text-info-700 mt-0.5 leading-relaxed">{step.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
