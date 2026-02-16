// src/features/plantillaTecnica/components/PDF/DynamicTemplatePDF.tsx

import { View, StyleSheet } from '@react-pdf/renderer'
import { Template, TemplateValues, TemplateNode } from '../../interfaces/template.types'
import { TemplateNodePDF } from './TemplateNodePDF'

interface Props {
  template: Template
  values: TemplateValues
  calculatedValues: TemplateValues
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 12
  },
  pairRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  pairLeft: {
    width: '48%',
    marginRight: '4%'
  },
  pairRight: {
    width: '48%'
  }
})

type Row =
  | { type: 'full'; node: TemplateNode }
  | { type: 'pair'; nodes: TemplateNode[] }

/**
 * Renderiza la plantilla dinámica en PDF siguiendo el mismo layout que la pantalla:
 * - Groups y procedures: ancho completo (su layout interno lo gestiona GroupNodePDF)
 * - Inputs y calcs sueltos al top-level: en pares de 2 columnas
 */
export const DynamicTemplatePDF = ({ template, values, calculatedValues }: Props) => {
  // Construir filas: grupos/procedimientos full-width, inputs/calcs en pares
  const rows: Row[] = []
  let buffer: TemplateNode[] = []

  const flushBuffer = () => {
    if (buffer.length === 0) return
    for (let i = 0; i < buffer.length; i += 2) {
      rows.push({ type: 'pair', nodes: buffer.slice(i, i + 2) })
    }
    buffer = []
  }

  template.nodes.forEach(node => {
    if (node.type === 'group' || node.type === 'procedure') {
      flushBuffer()
      rows.push({ type: 'full', node })
    } else {
      buffer.push(node)
    }
  })
  flushBuffer()

  return (
    <View style={localStyles.section}>
      {rows.map((row, idx) => {
        if (row.type === 'full') {
          return (
            <TemplateNodePDF
              key={row.node.key}
              node={row.node}
              values={values}
              calculatedValues={calculatedValues}
            />
          )
        }
        return (
          <View key={idx} style={localStyles.pairRow}>
            <View style={localStyles.pairLeft}>
              <TemplateNodePDF node={row.nodes[0]} values={values} calculatedValues={calculatedValues} />
            </View>
            {row.nodes[1] && (
              <View style={localStyles.pairRight}>
                <TemplateNodePDF node={row.nodes[1]} values={values} calculatedValues={calculatedValues} />
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}
