// src/features/plantillaTecnica/components/PDF/CalcNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { CalcNode } from '../../interfaces/template.types'
import { colors } from './styles'

interface Props {
  node: CalcNode
  value: number | string | undefined
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.surface[700],
    marginRight: 4
  },
  value: {
    fontSize: 9,
    color: colors.surface[900]
  },
  unit: {
    fontSize: 8,
    color: colors.surface[600],
    marginLeft: 2
  }
})

export const CalcNodePDF = ({ node, value }: Props) => {
  const displayValue =
    value !== undefined ? (typeof value === 'number' ? value.toFixed(1) : value) : '—'

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.label}>{node.label}:</Text>
      <Text style={localStyles.value}>{displayValue}</Text>
      {node.unit && value !== undefined && <Text style={localStyles.unit}>{node.unit}</Text>}
    </View>
  )
}
