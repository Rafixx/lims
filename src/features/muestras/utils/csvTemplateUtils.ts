// src/features/muestras/utils/csvTemplateUtils.ts
//
// Utilidades para generar plantillas CSV descargables.
//
// Formato de salida (desde esta versión):
//   codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones
// Cada fila repite el código de placa en la primera columna.
// No se genera fila "PLACA" separada.

/**
 * Genera el contenido CSV de una plantilla de placa de 96 pocillos (A01–H12).
 * Devuelve un string con la cabecera y las 96 filas de posiciones vacías.
 * (Usado como plantilla genérica sin datos de muestra.)
 */
export const generatePlateTemplate = (codigoPlaca?: string): string => {
  const BOM = '﻿'
  const header = 'codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones'
  const rows: string[] = [header]
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const placa = codigoPlaca ?? ''
  for (const letter of letters) {
    for (let col = 1; col <= 12; col++) {
      rows.push(`${placa},${letter}${String(col).padStart(2, '0')},,,`)
    }
  }
  return BOM + rows.join('\n')
}

/**
 * Genera la plantilla CSV de una placa con las posiciones ordenadas por codigo_epi.
 * El orden EPI refleja el orden en que se generaron los pocillos (idéntico al orden
 * de llenado usado al crear el registro masivo).
 *
 * Posiciones sin codigo_epi van al final, ordenadas por posicion_placa.
 * La columna codigo_externo se deja vacía para que el usuario la rellene.
 */
export const generateFullPlateTemplate = (
  _width: number,
  _height: number,
  positions: { posicion_placa: string; codigo_epi?: string | null }[],
  codigoEpiPlaca?: string
): string => {
  const BOM = '﻿'
  const header = 'codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones'
  const placa = codigoEpiPlaca ?? ''
  const rows: string[] = [header]

  const sorted = [...positions].sort((a, b) => {
    const epiA = a.codigo_epi ?? ''
    const epiB = b.codigo_epi ?? ''
    if (epiA && epiB) return epiA.localeCompare(epiB)
    if (epiA) return -1
    if (epiB) return 1
    return (a.posicion_placa ?? '').localeCompare(b.posicion_placa ?? '')
  })

  for (const pos of sorted) {
    rows.push(`${placa},${pos.posicion_placa},,${pos.codigo_epi ?? ''},`)
  }

  return BOM + rows.join('\n')
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
