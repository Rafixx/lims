// src/features/plantillaTecnica/components/PDF/PasosListPDF.tsx

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { DimPasos } from '../../interfaces/plantillaTecnica.types'
import { styles, colors } from './styles'

interface PasosListPDFProps {
  pasos: DimPasos[]
}

const localStyles = StyleSheet.create({
  section: {
    marginTop: 10
  },
  stepRow: {
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
  stepNumberContainer: {
    width: 14,
    height: 14,
    backgroundColor: colors.primary[500],
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },
  stepNumber: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.white
  },
  stepTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginRight: 6
  },
  stepDescription: {
    fontSize: 7,
    color: colors.surface[700]
  }
})

/**
 * Componente PDF para la lista de pasos del protocolo
 */
export const PasosListPDF = ({ pasos }: PasosListPDFProps) => {
  const pasosOrdenados = [...pasos].sort((a, b) => a.orden - b.orden)

  return (
    <View style={localStyles.section}>
      <Text style={styles.sectionTitle}>Protocolo Paso a Paso</Text>
      <Text style={styles.sectionSubtitle}>
        {pasosOrdenados.length} {pasosOrdenados.length === 1 ? 'paso' : 'pasos'} del protocolo
      </Text>

      {pasosOrdenados.length > 0 ? (
        <View>
          {pasosOrdenados.map(paso => (
            <View key={paso.id} style={localStyles.stepRow} wrap={false}>
              <View style={localStyles.stepNumberContainer}>
                <Text style={localStyles.stepNumber}>{paso.orden}</Text>
              </View>
              {paso.codigo && <Text style={localStyles.stepTitle}>{paso.codigo}</Text>}
              <Text style={localStyles.stepDescription}>{paso.descripcion}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay pasos definidos para este protocolo</Text>
        </View>
      )}
    </View>
  )
}
