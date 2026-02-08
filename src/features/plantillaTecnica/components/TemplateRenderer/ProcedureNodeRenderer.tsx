// src/features/plantillaTecnica/components/TemplateRenderer/ProcedureNodeRenderer.tsx

import { Card } from '@/shared/components/molecules/Card'
import { ClipboardList } from 'lucide-react'
import { ProcedureNode } from '../../interfaces/template.types'

interface Props {
  node: ProcedureNode
}

export const ProcedureNodeRenderer = ({ node }: Props) => {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ClipboardList className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-blue-900">{node.label}</h3>
      </div>

      <div className="space-y-3">
        {node.steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-blue-900">{step.label}</div>
              <div className="text-sm text-blue-700 mt-1">{step.text}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
