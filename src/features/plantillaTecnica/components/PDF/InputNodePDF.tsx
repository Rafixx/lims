// src/features/plantillaTecnica/components/PDF/InputNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { InputNode } from '../../interfaces/template.types'
import { colors } from './styles'

interface Props {
  node: InputNode
  value: number | string | boolean | undefined
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 4
  },
  label: {
    fontSize: 7,
    color: colors.surface[500],
    marginBottom: 1
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end'
  },
  value: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.surface[800]
  },
  unit: {
    fontSize: 7,
    color: colors.surface[400],
    marginLeft: 2
  }
})

export const InputNodePDF = ({ node, value }: Props) => {
  const hasValue = value !== undefined && value !== null && value !== ''
  const displayValue = hasValue ? String(value) : '—'

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.label}>
        {node.label}{node.required ? ' *' : ''}
      </Text>
      <View style={localStyles.valueRow}>
        <Text style={localStyles.value}>{displayValue}</Text>
        {node.unit && hasValue && (
          <Text style={localStyles.unit}>{node.unit}</Text>
        )}
      </View>
    </View>
  )
}
