// src/features/plantillaTecnica/components/PDF/TecnicasTemplatePDF.tsx
//
// Tabla PDF para plantillas con scope TECNICA.
// Replica la misma estructura que TecnicasTemplateTable en pantalla:
// Cód.Ext | Cód.EPI | [input cols] | [calc cols] | Tipo Resultado | Valor | Unidades

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { evaluateExpression } from '../../utils/expressionEvaluator'
import type {
  Template,
  TemplateNode,
  InputNode,
  CalcNode,
  TemplateValues
} from '../../interfaces/template.types'
import type { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { styles, colors } from './styles'

// ---------------------------------------------------------------------------
// Helpers (misma lógica que TecnicasTemplateTable)
// ---------------------------------------------------------------------------

function flattenInputNodes(nodes: TemplateNode[]): InputNode[] {
  const result: InputNode[] = []
  for (const node of nodes) {
    if (node.type === 'input') result.push(node)
    else if (node.type === 'group') result.push(...flattenInputNodes(node.children))
  }
  return result
}

function flattenCalcNodes(nodes: TemplateNode[]): CalcNode[] {
  const result: CalcNode[] = []
  for (const node of nodes) {
    if (node.type === 'calc') result.push(node)
    else if (node.type === 'group') result.push(...flattenCalcNodes(node.children))
  }
  return result
}

function computeCalcs(calcNodes: CalcNode[], inputValues: TemplateValues): TemplateValues {
  const result: TemplateValues = {}
  const MAX_PASSES = 3
  let pass = 0
  let hasChanges = true
  while (pass < MAX_PASSES && hasChanges) {
    hasChanges = false
    pass++
    const allVals = { ...inputValues, ...result }
    for (const node of calcNodes) {
      if (result[node.key] !== undefined) continue
      const val = evaluateExpression(node.expr.value, allVals)
      if (val !== undefined) {
        result[node.key] = val
        hasChanges = true
      }
    }
  }
  return result
}

function initRowValues(inputNodes: InputNode[], saved?: TemplateValues): TemplateValues {
  const values: TemplateValues = {}
  for (const node of inputNodes) {
    if (saved?.[node.key] !== undefined) {
      values[node.key] = saved[node.key]
    } else if (node.default !== undefined) {
      values[node.key] = node.default
    }
  }
  return values
}

function formatVal(val: number | string | boolean | undefined): string {
  if (val === undefined) return '—'
  if (typeof val === 'number') {
    return Number.isInteger(val) ? String(val) : val.toFixed(2)
  }
  return String(val)
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const COL_CODE = '10%'
const COL_RESULT_TIPO = '15%'
const COL_RESULT_VALOR = '8%'
const COL_RESULT_UNIDADES = '8%'

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 20
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 4
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
    borderBottomStyle: 'solid'
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface[100],
    borderBottomStyle: 'solid'
  },
  // Celdas de header fijas
  hCellCode: {
    width: COL_CODE,
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  hCellResultTipo: {
    width: COL_RESULT_TIPO,
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  hCellResultValor: {
    width: COL_RESULT_VALOR,
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700],
    textAlign: 'right'
  },
  hCellResultUnidades: {
    width: COL_RESULT_UNIDADES,
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  // Celdas de datos fijas
  dCellCodeExt: {
    width: COL_CODE,
    padding: 3,
    fontSize: 7,
    color: colors.surface[500],
    fontFamily: 'Helvetica'
  },
  dCellCodeEpi: {
    width: COL_CODE,
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.primary[700],
    fontFamily: 'Helvetica'
  },
  dCellResultTipo: {
    width: COL_RESULT_TIPO,
    padding: 3,
    fontSize: 7,
    color: colors.surface[700]
  },
  dCellResultValor: {
    width: COL_RESULT_VALOR,
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.success[600],
    textAlign: 'right'
  },
  dCellResultUnidades: {
    width: COL_RESULT_UNIDADES,
    padding: 3,
    fontSize: 7,
    color: colors.surface[500]
  },
  emptyCell: {
    color: colors.surface[300],
    fontStyle: 'italic'
  }
})

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

interface Props {
  tecnicas: Tecnica[]
  template: Template
}

export const TecnicasTemplatePDF = ({ tecnicas, template }: Props) => {
  const inputNodes = flattenInputNodes(template.nodes)
  const calcNodes = flattenCalcNodes(template.nodes)
  const hasCalcs = calcNodes.length > 0

  // Calcular el ancho flexible disponible para columnas dinámicas
  // Columnas fijas: 2 × COD (10% + 10%) + 3 resultado (15% + 8% + 8%) = 51%
  // Resto = 49% repartido entre inputs y calcs
  const dynamicCols = inputNodes.length + calcNodes.length
  const dynamicWidthPct = dynamicCols > 0 ? Math.floor(49 / dynamicCols) : 0
  const dynamicWidth = `${dynamicWidthPct}%`

  const hCellDynamic = {
    width: dynamicWidth,
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold' as const,
    color: colors.surface[700],
    textAlign: 'right' as const
  }
  const hCellCalc = {
    ...hCellDynamic,
    color: colors.primary[700],
    backgroundColor: colors.primary[50]
  }
  const dCellInput = {
    width: dynamicWidth,
    padding: 3,
    fontSize: 7,
    color: colors.surface[800],
    textAlign: 'right' as const,
    fontFamily: 'Helvetica-Bold' as const
  }
  const dCellCalc = {
    width: dynamicWidth,
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold' as const,
    color: colors.primary[700],
    textAlign: 'right' as const,
    backgroundColor: colors.primary[50]
  }

  return (
    <View style={localStyles.section}>
      <Text style={styles.sectionTitle}>Muestras y Resultados</Text>
      <Text style={styles.sectionSubtitle}>
        {tecnicas.length} {tecnicas.length === 1 ? 'técnica' : 'técnicas'}
      </Text>

      {tecnicas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay técnicas en este worklist</Text>
        </View>
      ) : (
        <View style={localStyles.tableContainer}>
          {/* Header */}
          <View style={localStyles.headerRow}>
            <Text style={localStyles.hCellCode}>CÓD.EXT</Text>
            <Text style={localStyles.hCellCode}>CÓD.EPI</Text>

            {inputNodes.map(node => (
              <Text key={node.key} style={hCellDynamic}>
                {node.label}
                {node.unit ? ` (${node.unit})` : ''}
              </Text>
            ))}

            {hasCalcs &&
              calcNodes.map(node => (
                <Text key={node.key} style={hCellCalc}>
                  {node.label}
                  {node.unit ? ` (${node.unit})` : ''}
                </Text>
              ))}

            <Text style={localStyles.hCellResultTipo}>TIPO RESULTADO</Text>
            <Text style={localStyles.hCellResultValor}>VALOR</Text>
            <Text style={localStyles.hCellResultUnidades}>UNID.</Text>
          </View>

          {/* Filas de datos */}
          {tecnicas.map((tecnica, tecnicaIdx) => {
            const inputValues = initRowValues(inputNodes, tecnica.datos_plantilla)
            const calcValues = computeCalcs(calcNodes, inputValues)

            const codigoExt =
              tecnica.muestraArray?.codigo_externo ?? tecnica.muestra?.codigo_externo ?? '—'
            const codigoEpi =
              tecnica.muestraArray?.codigo_epi ?? tecnica.muestra?.codigo_epi ?? '—'

            const resultados = tecnica.resultados ?? []
            const rowCount = resultados.length > 0 ? resultados.length : 1

            return Array.from({ length: rowCount }).map((_, resIdx) => {
              const resultado = resultados[resIdx]
              return (
                <View key={`${tecnicaIdx}-${resIdx}`} style={localStyles.dataRow}>
                  {/* Códigos: solo en primera sub-fila */}
                  <Text style={localStyles.dCellCodeExt}>
                    {resIdx === 0 ? codigoExt : ''}
                  </Text>
                  <Text style={localStyles.dCellCodeEpi}>
                    {resIdx === 0 ? codigoEpi : ''}
                  </Text>

                  {/* Inputs: solo en primera sub-fila */}
                  {inputNodes.map(node => (
                    <Text key={node.key} style={dCellInput}>
                      {resIdx === 0 ? formatVal(inputValues[node.key]) : ''}
                    </Text>
                  ))}

                  {/* Cálculos: solo en primera sub-fila */}
                  {hasCalcs &&
                    calcNodes.map(node => (
                      <Text key={node.key} style={dCellCalc}>
                        {resIdx === 0 ? formatVal(calcValues[node.key]) : ''}
                      </Text>
                    ))}

                  {/* Resultado */}
                  {resultado ? (
                    <>
                      <Text style={localStyles.dCellResultTipo}>{resultado.tipo_res || '—'}</Text>
                      <Text style={localStyles.dCellResultValor}>
                        {resultado.valor !== null && resultado.valor !== undefined
                          ? String(resultado.valor)
                          : '—'}
                      </Text>
                      <Text style={localStyles.dCellResultUnidades}>
                        {resultado.unidades || '—'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[localStyles.dCellResultTipo, localStyles.emptyCell]}>
                        Sin resultados
                      </Text>
                      <Text style={[localStyles.dCellResultValor, localStyles.emptyCell]}>—</Text>
                      <Text style={[localStyles.dCellResultUnidades, localStyles.emptyCell]}>—</Text>
                    </>
                  )}
                </View>
              )
            })
          })}
        </View>
      )}
    </View>
  )
}
