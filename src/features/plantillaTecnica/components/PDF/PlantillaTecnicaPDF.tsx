// src/features/plantillaTecnica/components/PDF/PlantillaTecnicaPDF.tsx

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { TecnicaProc } from '../../interfaces/plantillaTecnica.types'
import { Template, TemplateValues } from '../../interfaces/template.types'
import { TecnicasListPDF } from './TecnicasListPDF'
import { PipetasListPDF } from './PipetasListPDF'
import { ReactivosListPDF } from './ReactivosListPDF'
import { PasosListPDF } from './PasosListPDF'
import { DynamicTemplatePDF } from './DynamicTemplatePDF'
import { styles, colors } from './styles'

interface PlantillaTecnicaPDFProps {
  tecnicas: Tecnica[]
  plantillaTecnica: TecnicaProc
  fecha: string
  hora: string
  template?: Template | null
  templateValues?: TemplateValues
  calculatedValues?: TemplateValues
}

const localStyles = StyleSheet.create({
  // Layout principal: Cálculos (2/3) + Checklist/Pasos (1/3)
  mainGrid: {
    flexDirection: 'row',
    marginBottom: 16
  },
  calcColumn: {
    width: '65%',
    marginRight: 12
  },
  checklistColumn: {
    width: '33%'
  },
  // Grid de 2 columnas para Pipetas y Reactivos
  grid2Cols: {
    flexDirection: 'row',
    marginBottom: 20
  },
  gridColumnLeft: {
    width: '48%',
    marginRight: '4%'
  },
  gridColumnRight: {
    width: '48%'
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    borderTopStyle: 'solid',
    paddingTop: 8
  },
  footerText: {
    fontSize: 7,
    color: colors.surface[400]
  },
  pageNumber: {
    fontSize: 7,
    color: colors.surface[400]
  }
})

/**
 * Documento PDF completo de la Plantilla Técnica
 */
export const PlantillaTecnicaPDF = ({
  tecnicas,
  plantillaTecnica,
  fecha,
  hora,
  template,
  templateValues,
  calculatedValues
}: PlantillaTecnicaPDFProps) => {
  const codigoPlantilla = plantillaTecnica.plantillaTecnica?.cod_plantilla_tecnica || ''
  const tecnicaProc = plantillaTecnica.tecnica_proc || ''
  const pipetas = plantillaTecnica.plantillaTecnica?.dimPipetas || []
  const reactivos = plantillaTecnica.plantillaTecnica?.dimReactivos || []
  const pasos = plantillaTecnica.plantillaTecnica?.dimPlantillaPasos || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{tecnicaProc}</Text>
          <View style={styles.headerInfo}>
            {codigoPlantilla && (
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>Código plantilla: </Text>
                <Text style={styles.headerInfoValue}>{codigoPlantilla}</Text>
              </View>
            )}
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Fecha: </Text>
              <Text style={styles.headerInfoValue}>{fecha}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Hora: </Text>
              <Text style={styles.headerInfoValue}>{hora}</Text>
            </View>
          </View>
        </View>

        {/* Sección: Técnicas del Worklist */}
        <TecnicasListPDF tecnicas={tecnicas} />

        {/* Grid principal: Cálculos (2/3) + Checklist/Pasos (1/3) */}
        <View style={localStyles.mainGrid}>
          <View style={localStyles.calcColumn}>
            {template && templateValues && calculatedValues && (
              <DynamicTemplatePDF
                template={template}
                values={templateValues}
                calculatedValues={calculatedValues}
              />
            )}
          </View>
          <View style={localStyles.checklistColumn}>
            <PasosListPDF pasos={pasos} />
          </View>
        </View>

        {/* Grid de 2 columnas para Pipetas y Reactivos */}
        <View style={localStyles.grid2Cols}>
          <View style={localStyles.gridColumnLeft}>
            <PipetasListPDF pipetas={pipetas} />
          </View>
          <View style={localStyles.gridColumnRight}>
            <ReactivosListPDF reactivos={reactivos} />
          </View>
        </View>

        {/* Footer */}
        <View style={localStyles.footer} fixed>
          <Text style={localStyles.footerText}>LIMS - Plantilla Técnica</Text>
          <Text
            style={localStyles.pageNumber}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
