// src/features/plantillaTecnica/components/TemplateRenderer/TemplateNodeRenderer.tsx

import { TemplateNode, TemplateValues, ValidationResult } from '../../interfaces/template.types'
import { ProcedureNodeRenderer } from './ProcedureNodeRenderer'
import { InputNodeRenderer } from './InputNodeRenderer'
import { CalcNodeRenderer } from './CalcNodeRenderer'
import { GroupNodeRenderer } from './GroupNodeRenderer'

interface Props {
  node: TemplateNode
  values: TemplateValues
  calculatedValues: TemplateValues
  validation: ValidationResult
  onChange: (key: string, value: number | string | boolean | undefined) => void
}

/**
 * Componente recursivo que renderiza un nodo según su tipo
 */
export const TemplateNodeRenderer = ({
  node,
  values,
  calculatedValues,
  validation,
  onChange
}: Props) => {
  switch (node.type) {
    case 'procedure':
      return <ProcedureNodeRenderer node={node} />

    case 'input': {
      const value = values[node.key]
      const error = validation.errors[node.key]
      return <InputNodeRenderer node={node} value={value} error={error} onChange={onChange} />
    }

    case 'calc': {
      const raw = calculatedValues[node.key]
      const value = typeof raw === 'boolean' ? undefined : raw
      return <CalcNodeRenderer node={node} value={value} />
    }

    case 'group':
      return (
        <GroupNodeRenderer
          node={node}
          values={values}
          calculatedValues={calculatedValues}
          validation={validation}
          onChange={onChange}
        />
      )

    default: {
      // Type guard exhaustivo
      const _exhaustive: never = node
      return null
    }
  }
}
