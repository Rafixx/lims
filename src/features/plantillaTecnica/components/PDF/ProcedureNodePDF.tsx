// src/features/plantillaTecnica/components/PDF/ProcedureNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ProcedureNode } from '../../interfaces/template.types'
import { colors } from './styles'

interface Props {
  node: ProcedureNode
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.surface[800],
    marginBottom: 6
  },
  stepsList: {
    paddingLeft: 0
  },
  step: {
    flexDirection: 'row',
    marginBottom: 3
  },
  stepNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.surface[600],
    width: 18
  },
  stepText: {
    fontSize: 9,
    color: colors.surface[700],
    flex: 1,
    lineHeight: 1.3
  }
})

export const ProcedureNodePDF = ({ node }: Props) => {
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>{node.label}</Text>
      <View style={localStyles.stepsList}>
        {node.steps.map((step, index) => (
          <View key={index} style={localStyles.step}>
            <Text style={localStyles.stepNumber}>{index + 1}.</Text>
            <Text style={localStyles.stepText}>
              {step.label && `${step.label}: `}
              {step.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
