// src/features/workList/utils/rawDataMapper.ts

import { RawNanoDrop, RawQubit, MappableRow, InstrumentType } from '../interfaces/worklist.types'

/**
 * Convierte datos RAW de Nanodrop a formato mapenable para el modal
 */
export const nanodropToMappableRows = (data: RawNanoDrop[]): MappableRow[] => {
  return data.map(row => ({
    id: row.id,
    sampleIdentifier: row.sample_code,
    posicionPlaca: row.position || undefined,
    displayData: {
      'Código Muestra': row.sample_code,
      ...(row.position && { 'Posición Placa': row.position }),
      Fecha: row.fecha,
      'A260/280': row.a260_280,
      'A260/230': row.a260_230,
      Concentración: row.an_cant
    }
  }))
}

/**
 * Convierte datos RAW de Qubit a formato mapenable para el modal
 */
export const qubitToMappableRows = (data: RawQubit[]): MappableRow[] => {
  return data.map(row => ({
    id: row.id,
    sampleIdentifier: row.test_name || '',
    posicionPlaca: row.position || undefined,
    displayData: {
      'Nombre Test': row.test_name || '',
      ...(row.position && { 'Posición Placa': row.position }),
      'Fecha Test': row.test_date || '',
      Concentración: row.qubit_tube_conc || '',
      Unidades: row.qubit_units || '',
      'Run ID': row.run_id || ''
    }
  }))
}

/**
 * Función principal que convierte datos RAW según el tipo de instrumento
 */
export const rawDataToMappableRows = (
  data: RawNanoDrop[] | RawQubit[],
  type: InstrumentType
): MappableRow[] => {
  switch (type) {
    case 'NANODROP':
      return nanodropToMappableRows(data as RawNanoDrop[])
    case 'QUBIT':
      return qubitToMappableRows(data as RawQubit[])
    default:
      return []
  }
}
