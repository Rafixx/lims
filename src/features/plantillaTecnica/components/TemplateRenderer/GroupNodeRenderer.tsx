// src/features/plantillaTecnica/components/TemplateRenderer/GroupNodeRenderer.tsx

import { Card } from '@/shared/components/molecules/Card'
import { FolderOpen } from 'lucide-react'
import { GroupNode, TemplateValues, ValidationResult } from '../../interfaces/template.types'
import { TemplateNodeRenderer } from './TemplateNodeRenderer'

interface Props {
  node: GroupNode
  values: TemplateValues
  calculatedValues: TemplateValues
  validation: ValidationResult
  onChange: (key: string, value: number | string | boolean | undefined) => void
}

export const GroupNodeRenderer = ({
  node,
  values,
  calculatedValues,
  validation,
  onChange
}: Props) => {
  return (
    <Card className="p-6 bg-gray-50 border-gray-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-200 rounded-lg">
          <FolderOpen className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{node.label}</h3>
      </div>

      <div className="space-y-4">
        {node.children.map(child => (
          <TemplateNodeRenderer
            key={child.key}
            node={child}
            values={values}
            calculatedValues={calculatedValues}
            validation={validation}
            onChange={onChange}
          />
        ))}
      </div>
    </Card>
  )
}
