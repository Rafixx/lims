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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    borderWidth: 0.5,
    borderColor: colors.primary[100],
    borderStyle: 'solid',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 3
  },
  labelContainer: {
    flex: 1,
    marginRight: 8
  },
  label: {
    fontSize: 7,
    color: colors.surface[500]
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary[700]
  },
  valuePending: {
    fontSize: 8,
    color: colors.surface[300]
  },
  unit: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.primary[500],
    marginLeft: 2
  }
})

export const CalcNodePDF = ({ node, value }: Props) => {
  const hasValue = value !== undefined

  const displayValue = hasValue
    ? typeof value === 'number'
      ? Number.isInteger(value)
        ? value.toString()
        : value.toFixed(2)
      : String(value)
    : null

  return (
    <View style={localStyles.container}>
      <View style={localStyles.labelContainer}>
        <Text style={localStyles.label}>{node.label}</Text>
      </View>
      <View style={localStyles.valueContainer}>
        {hasValue ? (
          <>
            <Text style={localStyles.value}>{displayValue}</Text>
            {node.unit && <Text style={localStyles.unit}>{node.unit}</Text>}
          </>
        ) : (
          <Text style={localStyles.valuePending}>—</Text>
        )}
      </View>
    </View>
  )
}
