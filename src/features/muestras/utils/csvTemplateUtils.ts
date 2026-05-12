// src/features/muestras/utils/csvTemplateUtils.ts
//
// Utilidades para generar plantillas CSV descargables.

/**
 * Genera el contenido CSV de una plantilla de placa de 96 pocillos (A01–H12).
 * Devuelve un string con la cabecera y las 96 filas de posiciones vacías.
 */
export const generatePlateTemplate = (): string => {
  const rows = ['posicion_placa,codigo_externo,observaciones']
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  for (const letter of letters) {
    for (let col = 1; col <= 12; col++) {
      rows.push(`${letter}${String(col).padStart(2, '0')},,`)
    }
  }
  return rows.join('\n')
}

/**
 * Descarga un string como fichero CSV en el navegador.
 */
export const downloadCsv = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
