// src/features/workList/utils/csvParser.ts

/**
 * Interface para una fila parseada del CSV
 */
export interface CsvRow {
  [key: string]: string
}

/**
 * Parsea un archivo CSV y retorna un array de objetos
 * @param file Archivo CSV a parsear
 * @returns Promise con array de filas parseadas
 */
export const parseCSV = async (file: File): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim() !== '')

        if (lines.length === 0) {
          reject(new Error('El archivo CSV está vacío'))
          return
        }

        // Primera línea son los headers
        const headers = lines[0].split(',').map(h => h.trim())

        // Parsear el resto de líneas
        const rows: CsvRow[] = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row: CsvRow = {}

          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })

          return row
        })

        resolve(rows)
      } catch {
        reject(new Error('Error al parsear el archivo CSV'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsText(file)
  })
}

/**
 * Cuenta el número de filas de datos en un CSV (sin contar el header)
 * @param file Archivo CSV
 * @returns Promise con el número de filas
 */
export const countCSVRows = async (file: File): Promise<number> => {
  const rows = await parseCSV(file)
  return rows.length
}
