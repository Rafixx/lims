// src/features/plantillaTecnica/components/PDF/PipetasListPDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { DimPipeta } from '../../interfaces/plantillaTecnica.types'
import { styles, colors } from './styles'

interface PipetasListPDFProps {
  pipetas: DimPipeta[]
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%'
  },
  itemCard: {
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 6,
    marginBottom: 4
  },
  itemTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginBottom: 3
  },
  itemDetails: {
    flexDirection: 'row'
  },
  itemCode: {
    fontSize: 7,
    color: colors.surface[500],
    marginRight: 8
  },
  itemZona: {
    fontSize: 7,
    backgroundColor: colors.surface[200],
    color: colors.surface[700],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2
  }
})

/**
 * Componente PDF para la lista de pipetas
 */
export const PipetasListPDF = ({ pipetas }: PipetasListPDFProps) => {
  return (
    <View style={localStyles.container}>
      <Text style={styles.sectionTitle}>Pipetas Necesarias</Text>
      <Text style={styles.sectionSubtitle}>
        {pipetas.length} {pipetas.length === 1 ? 'pipeta' : 'pipetas'}
      </Text>

      {pipetas.length > 0 ? (
        <View>
          {pipetas.map(pipeta => (
            <View key={pipeta.id} style={localStyles.itemCard} wrap={false}>
              <Text style={localStyles.itemTitle}>{pipeta.modelo}</Text>
              <View style={localStyles.itemDetails}>
                <Text style={localStyles.itemCode}>{pipeta.codigo}</Text>
                <Text style={localStyles.itemZona}>{pipeta.zona}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay pipetas definidas</Text>
        </View>
      )}
    </View>
  )
}
