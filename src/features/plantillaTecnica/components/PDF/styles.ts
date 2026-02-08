// src/features/plantillaTecnica/components/PDF/styles.ts

import { StyleSheet } from '@react-pdf/renderer'

/**
 * Colores del sistema de diseño
 */
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  surface: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  success: {
    100: '#dcfce7',
    600: '#16a34a'
  },
  danger: {
    600: '#dc2626',
    700: '#b91c1c'
  },
  info: {
    100: '#dbeafe',
    600: '#2563eb'
  },
  warning: {
    100: '#fef3c7',
    600: '#d97706'
  },
  white: '#ffffff'
}

/**
 * Estilos compartidos para el documento PDF
 * NOTA: @react-pdf/renderer NO soporta la propiedad 'gap' de flexbox
 * Se deben usar margin en su lugar
 */
export const styles = StyleSheet.create({
  // Página
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: colors.white
  },

  // Header
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
    borderBottomStyle: 'solid'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.surface[600]
  },
  headerInfo: {
    flexDirection: 'row',
    marginTop: 8
  },
  headerInfoItem: {
    flexDirection: 'row',
    marginRight: 20
  },
  headerInfoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.surface[600]
  },
  headerInfoValue: {
    fontSize: 9,
    color: colors.surface[900]
  },

  // Secciones
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginBottom: 4
  },
  sectionSubtitle: {
    fontSize: 9,
    color: colors.surface[500],
    marginBottom: 10
  },

  // Tablas
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
    borderBottomStyle: 'solid'
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.surface[700],
    textTransform: 'uppercase'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
    borderBottomStyle: 'solid'
  },
  tableRowAlternate: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
    borderBottomStyle: 'solid',
    backgroundColor: colors.surface[50]
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    color: colors.surface[700]
  },
  tableCellBold: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.primary[600]
  },

  // Cards/Items
  card: {
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 8,
    color: colors.surface[500]
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: 4
  },
  cardLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.surface[600],
    marginRight: 4
  },
  cardValue: {
    fontSize: 8,
    color: colors.surface[700]
  },

  // Grid de 2 columnas
  grid2Cols: {
    flexDirection: 'row'
  },
  gridColumnLeft: {
    width: '48%',
    marginRight: '4%'
  },
  gridColumnRight: {
    width: '48%'
  },

  // Pasos del protocolo
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  stepNumber: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white
  },
  stepContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.surface[900],
    marginBottom: 4
  },
  stepDescription: {
    fontSize: 9,
    color: colors.surface[700],
    lineHeight: 1.4
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    borderTopStyle: 'solid',
    paddingTop: 10
  },
  footerText: {
    fontSize: 8,
    color: colors.surface[400]
  },

  // Utilidades
  flexRow: {
    flexDirection: 'row'
  },
  textCenter: {
    textAlign: 'center'
  },
  textRight: {
    textAlign: 'right'
  },
  mb4: {
    marginBottom: 4
  },
  mb8: {
    marginBottom: 8
  },
  mb12: {
    marginBottom: 12
  },

  // Estado vacío
  emptyState: {
    padding: 20,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 9,
    color: colors.surface[400],
    fontStyle: 'italic'
  }
})
