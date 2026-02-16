// src/features/plantillaTecnica/components/PDF/ProcedureNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ProcedureNode } from '../../interfaces/template.types'
import { colors } from './styles'

interface Props {
  node: ProcedureNode
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: colors.info[200],
    borderStyle: 'solid',
    borderRadius: 3
  },
  header: {
    backgroundColor: colors.info[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.info[200],
    borderBottomStyle: 'solid'
  },
  title: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700],
    textTransform: 'uppercase'
  },
  stepsList: {
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  step: {
    flexDirection: 'row',
    marginBottom: 2
  },
  stepNumber: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[500],
    width: 12
  },
  stepText: {
    fontSize: 7,
    color: colors.surface[600],
    flex: 1,
    lineHeight: 1.3
  }
})

export const ProcedureNodePDF = ({ node }: Props) => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <Text style={localStyles.title}>{node.label}</Text>
      </View>
      <View style={localStyles.stepsList}>
        {node.steps.map((step, index) => (
          <View key={index} style={localStyles.step}>
            <Text style={localStyles.stepNumber}>{index + 1}.</Text>
            <Text style={localStyles.stepText}>
              {step.label && step.text !== step.label ? `${step.label}: ` : ''}
              {step.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
