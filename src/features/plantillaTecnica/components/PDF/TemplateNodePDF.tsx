// src/features/plantillaTecnica/components/PDF/TemplateNodePDF.tsx

import { TemplateNode, TemplateValues } from '../../interfaces/template.types'
import { ProcedureNodePDF } from './ProcedureNodePDF'
import { InputNodePDF } from './InputNodePDF'
import { CalcNodePDF } from './CalcNodePDF'
import { GroupNodePDF } from './GroupNodePDF'

interface Props {
  node: TemplateNode
  values: TemplateValues
  calculatedValues: TemplateValues
}

/**
 * Componente recursivo que renderiza un nodo en PDF según su tipo
 */
export const TemplateNodePDF = ({ node, values, calculatedValues }: Props) => {
  switch (node.type) {
    case 'procedure':
      return <ProcedureNodePDF node={node} />

    case 'input': {
      const value = values[node.key]
      return <InputNodePDF node={node} value={value} />
    }

    case 'calc': {
      const value = calculatedValues[node.key]
      return <CalcNodePDF node={node} value={value as number | string | undefined} />
    }

    case 'group':
      return <GroupNodePDF node={node} values={values} calculatedValues={calculatedValues} />

    default:
      return null
  }
}
