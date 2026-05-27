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
 * Genera la plantilla CSV de una placa completa (width×height posiciones).
 * Las posiciones que tienen muestra llevan codigo_epi; el resto lo dejan vacío.
 */
export const generateFullPlateTemplate = (
  width: number,
  height: number,
  positions: { posicion_placa: string; codigo_epi?: string | null }[],
  codigoEpiPlaca?: string
): string => {
  const epiByPos = new Map(positions.map(p => [p.posicion_placa, p.codigo_epi ?? '']))
  const BOM = '﻿'
  const header = 'posicion_placa,codigo_epi,cod_externo,observaciones'
  const placaRow = `PLACA,${codigoEpiPlaca ?? ''},, `
  const rows: string[] = [header, placaRow]

  for (let r = 0; r < height; r++) {
    const letter = String.fromCharCode('A'.charCodeAt(0) + r)
    for (let c = 1; c <= width; c++) {
      const pos = `${letter}${String(c).padStart(2, '0')}`
      rows.push(`${pos},${epiByPos.get(pos) ?? ''},,`)
    }
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
