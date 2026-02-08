// src/features/plantillaTecnica/components/PDF/GroupNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { GroupNode, TemplateValues } from '../../interfaces/template.types'
import { TemplateNodePDF } from './TemplateNodePDF'
import { colors } from './styles'

interface Props {
  node: GroupNode
  values: TemplateValues
  calculatedValues: TemplateValues
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 12
  },
  header: {
    backgroundColor: colors.surface[100],
    borderLeft: `3pt solid ${colors.primary[500]}`,
    padding: 8,
    marginBottom: 8
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.surface[800]
  },
  childrenContainer: {
    paddingLeft: 12
  }
})

export const GroupNodePDF = ({ node, values, calculatedValues }: Props) => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <Text style={localStyles.title}>{node.label}</Text>
      </View>
      <View style={localStyles.childrenContainer}>
        {node.children.map((childNode, index) => (
          <TemplateNodePDF
            key={childNode.key || `child-${index}`}
            node={childNode}
            values={values}
            calculatedValues={calculatedValues}
          />
        ))}
      </View>
    </View>
  )
}
