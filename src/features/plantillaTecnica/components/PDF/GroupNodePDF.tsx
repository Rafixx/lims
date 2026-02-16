// src/features/plantillaTecnica/components/PDF/GroupNodePDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { GroupNode, TemplateNode, TemplateValues } from '../../interfaces/template.types'
import { TemplateNodePDF } from './TemplateNodePDF'
import { colors } from './styles'

interface Props {
  node: GroupNode
  values: TemplateValues
  calculatedValues: TemplateValues
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 3
  },
  header: {
    backgroundColor: colors.surface[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface[200],
    borderBottomStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerAccent: {
    width: 2,
    height: 10,
    backgroundColor: colors.primary[500],
    borderRadius: 1,
    marginRight: 5
  },
  title: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[600],
    textTransform: 'uppercase'
  },
  body: {
    padding: 6
  },
  otherChildren: {
    marginBottom: 4
  },
  // Layout mixto: inputs (40%) + calcs (60%)
  splitRow: {
    flexDirection: 'row'
  },
  inputsCol: {
    width: '40%',
    paddingRight: 6
  },
  calcsCol: {
    width: '60%',
    paddingLeft: 6,
    borderLeftWidth: 0.5,
    borderLeftColor: colors.surface[200],
    borderLeftStyle: 'solid'
  },
  // Solo inputs: 2 columnas
  inputPairRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  inputPairLeft: {
    width: '48%',
    marginRight: '4%'
  },
  inputPairRight: {
    width: '48%'
  }
})

const renderChildren = (children: TemplateNode[], values: TemplateValues, calculatedValues: TemplateValues) =>
  children.map((child, index) => (
    <TemplateNodePDF
      key={child.key || `child-${index}`}
      node={child}
      values={values}
      calculatedValues={calculatedValues}
    />
  ))

export const GroupNodePDF = ({ node, values, calculatedValues }: Props) => {
  const inputChildren = node.children.filter(c => c.type === 'input')
  const calcChildren = node.children.filter(c => c.type === 'calc')
  const otherChildren = node.children.filter(c => c.type !== 'input' && c.type !== 'calc')

  const hasInputs = inputChildren.length > 0
  const hasCalcs = calcChildren.length > 0
  const hasBoth = hasInputs && hasCalcs

  // Agrupar inputs en filas de 2 cuando no hay calcs
  const inputPairs: TemplateNode[][] = []
  for (let i = 0; i < inputChildren.length; i += 2) {
    inputPairs.push(inputChildren.slice(i, i + 2))
  }

  return (
    <View style={localStyles.container}>
      {/* Header */}
      <View style={localStyles.header}>
        <View style={localStyles.headerAccent} />
        <Text style={localStyles.title}>{node.label}</Text>
      </View>

      <View style={localStyles.body}>
        {/* Grupos anidados y procedimientos: ancho completo */}
        {otherChildren.length > 0 && (
          <View style={localStyles.otherChildren}>
            {renderChildren(otherChildren, values, calculatedValues)}
          </View>
        )}

        {/* Layout según combinación de hijos */}
        {hasBoth ? (
          // Inputs (40%) + Calcs (60%) en la misma fila
          <View style={localStyles.splitRow}>
            <View style={localStyles.inputsCol}>
              {renderChildren(inputChildren, values, calculatedValues)}
            </View>
            <View style={localStyles.calcsCol}>
              {renderChildren(calcChildren, values, calculatedValues)}
            </View>
          </View>
        ) : hasInputs ? (
          // Solo inputs: cuadrícula de 2 columnas
          <View>
            {inputPairs.map((pair, rowIdx) => (
              <View key={rowIdx} style={localStyles.inputPairRow}>
                <View style={localStyles.inputPairLeft}>
                  <TemplateNodePDF node={pair[0]} values={values} calculatedValues={calculatedValues} />
                </View>
                {pair[1] && (
                  <View style={localStyles.inputPairRight}>
                    <TemplateNodePDF node={pair[1]} values={values} calculatedValues={calculatedValues} />
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : hasCalcs ? (
          // Solo calcs: columna completa
          <View>
            {renderChildren(calcChildren, values, calculatedValues)}
          </View>
        ) : null}
      </View>
    </View>
  )
}
