// src/features/plantillaTecnica/components/PDF/DynamicTemplatePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { Template, TemplateValues, TemplateNode } from '../../interfaces/template.types'
import { TemplateNodePDF } from './TemplateNodePDF'
import { colors } from './styles'

interface Props {
  template: Template
  values: TemplateValues
  calculatedValues: TemplateValues
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 20
  },
  grid2Cols: {
    flexDirection: 'row'
  },
  gridColumnLeft: {
    flex: 1,
    marginRight: 16
  },
  gridColumnRight: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.surface[800],
    marginBottom: 8
  }
})

/**
 * Renderiza la plantilla dinámica en PDF
 * Muestra los nodos en grid de 2 columnas como en pantalla
 */
export const DynamicTemplatePDF = ({ template, values, calculatedValues }: Props) => {
  const procedureAndInputNodes: TemplateNode[] = []
  const calcNodes: TemplateNode[] = []

  template.nodes.forEach(node => {
    if (node.type === 'calc') {
      calcNodes.push(node)
    } else {
      procedureAndInputNodes.push(node)
    }
  })

  return (
    <View style={localStyles.section}>
      <View style={localStyles.grid2Cols}>
        <View style={localStyles.gridColumnLeft}>
          {procedureAndInputNodes.map(node => (
            <TemplateNodePDF
              key={node.key}
              node={node}
              values={values}
              calculatedValues={calculatedValues}
            />
          ))}
        </View>
        <View style={localStyles.gridColumnRight}>
          {calcNodes.length > 0 && (
            <>
              <Text style={localStyles.sectionTitle}>Cálculos</Text>
              {calcNodes.map(node => (
                <TemplateNodePDF
                  key={node.key}
                  node={node}
                  values={values}
                  calculatedValues={calculatedValues}
                />
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  )
}
