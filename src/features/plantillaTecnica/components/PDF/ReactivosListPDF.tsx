// src/features/plantillaTecnica/components/PDF/ReactivosListPDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { DimReactivo } from '../../interfaces/plantillaTecnica.types'
import { styles, colors } from './styles'

interface ReactivosListPDFProps {
  reactivos: DimReactivo[]
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginBottom: 2
  },
  itemTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginRight: 6
  },
  detailText: {
    fontSize: 7,
    color: colors.surface[500],
    marginRight: 4
  },
  separator: {
    fontSize: 7,
    color: colors.surface[300],
    marginRight: 4
  }
})

/**
 * Componente PDF para la lista de reactivos
 */
export const ReactivosListPDF = ({ reactivos }: ReactivosListPDFProps) => {
  return (
    <View style={localStyles.container}>
      <Text style={styles.sectionTitle}>Reactivos Necesarios</Text>
      <Text style={styles.sectionSubtitle}>
        {reactivos.length} {reactivos.length === 1 ? 'reactivo' : 'reactivos'}
      </Text>

      {reactivos.length > 0 ? (
        <View>
          {reactivos.map(reactivo => (
            <View key={reactivo.id} style={localStyles.itemRow} wrap={false}>
              <Text style={localStyles.itemTitle}>{reactivo.reactivo}</Text>
              <Text style={localStyles.detailText}>Ref: {reactivo.num_referencia}</Text>
              {reactivo.lote && (
                <>
                  <Text style={localStyles.separator}>•</Text>
                  <Text style={localStyles.detailText}>Lote: {reactivo.lote}</Text>
                </>
              )}
              {reactivo.volumen_formula && (
                <>
                  <Text style={localStyles.separator}>•</Text>
                  <Text style={localStyles.detailText}>Vol: {reactivo.volumen_formula}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay reactivos definidos</Text>
        </View>
      )}
    </View>
  )
}
