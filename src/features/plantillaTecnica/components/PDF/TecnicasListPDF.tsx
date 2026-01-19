// src/features/plantillaTecnica/components/PDF/TecnicasListPDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { styles, colors } from './styles'

interface TecnicasListPDFProps {
  tecnicas: Tecnica[]
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 20
  },
  columnsContainer: {
    flexDirection: 'row'
  },
  columnLeft: {
    width: '48%',
    marginRight: '4%'
  },
  columnRight: {
    width: '48%'
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
  headerCellCodigo: {
    width: '25%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  headerCellTipo: {
    width: '35%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  headerCellValor: {
    width: '20%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700],
    textAlign: 'right'
  },
  headerCellUnidades: {
    width: '20%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[700]
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surface[100],
    borderBottomStyle: 'solid'
  },
  cellCodigo: {
    width: '25%',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.primary[600]
  },
  cellTipo: {
    width: '35%',
    padding: 3,
    fontSize: 7,
    color: colors.surface[700]
  },
  cellValor: {
    width: '20%',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.success[600],
    textAlign: 'right'
  },
  cellUnidades: {
    width: '20%',
    padding: 3,
    fontSize: 7,
    color: colors.surface[600]
  },
  emptyCell: {
    color: colors.surface[400],
    fontStyle: 'italic'
  }
})

/**
 * Componente PDF para la lista de técnicas/muestras y resultados
 */
export const TecnicasListPDF = ({ tecnicas }: TecnicasListPDFProps) => {
  const mitad = Math.ceil(tecnicas.length / 2)
  const columna1 = tecnicas.slice(0, mitad)
  const columna2 = tecnicas.slice(mitad)

  const renderTabla = (tecnicasColumna: Tecnica[]) => {
    if (tecnicasColumna.length === 0) return null

    return (
      <View style={localStyles.tableContainer}>
        <View style={localStyles.headerRow}>
          <Text style={localStyles.headerCellCodigo}>CÓDIGO</Text>
          <Text style={localStyles.headerCellTipo}>TIPO RESULTADO</Text>
          <Text style={localStyles.headerCellValor}>VALOR</Text>
          <Text style={localStyles.headerCellUnidades}>UNIDADES</Text>
        </View>

        {tecnicasColumna.map((tecnica, tecnicaIndex) => {
          const codigoMuestra =
            tecnica.muestra?.codigo_epi || tecnica.muestra?.codigo_externo || '-'

          if (!tecnica.resultados || tecnica.resultados.length === 0) {
            return (
              <View key={tecnicaIndex} style={localStyles.dataRow}>
                <Text style={localStyles.cellCodigo}>{codigoMuestra}</Text>
                <Text style={[localStyles.cellTipo, localStyles.emptyCell]}>Sin resultados</Text>
                <Text style={[localStyles.cellValor, localStyles.emptyCell]}>-</Text>
                <Text style={[localStyles.cellUnidades, localStyles.emptyCell]}>-</Text>
              </View>
            )
          }

          return tecnica.resultados.map((resultado, resultadoIndex) => (
            <View key={`${tecnicaIndex}-${resultadoIndex}`} style={localStyles.dataRow}>
              <Text style={localStyles.cellCodigo}>
                {resultadoIndex === 0 ? codigoMuestra : ''}
              </Text>
              <Text style={localStyles.cellTipo}>{resultado.tipo_res || '-'}</Text>
              <Text style={localStyles.cellValor}>
                {resultado.valor !== null && resultado.valor !== undefined
                  ? String(resultado.valor)
                  : '-'}
              </Text>
              <Text style={localStyles.cellUnidades}>{resultado.unidades || '-'}</Text>
            </View>
          ))
        })}
      </View>
    )
  }

  return (
    <View style={localStyles.section}>
      <Text style={styles.sectionTitle}>Muestras y Resultados</Text>
      <Text style={styles.sectionSubtitle}>
        {tecnicas.length} {tecnicas.length === 1 ? 'técnica' : 'técnicas'}
      </Text>

      {tecnicas.length > 0 ? (
        <View style={localStyles.columnsContainer}>
          <View style={localStyles.columnLeft}>{renderTabla(columna1)}</View>
          {columna2.length > 0 && (
            <View style={localStyles.columnRight}>{renderTabla(columna2)}</View>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay técnicas en este worklist</Text>
        </View>
      )}
    </View>
  )
}
