// src/shared/components/TableBasic.tsx
import React from 'react'

export interface Column<T> {
  header: string
  /**
   * Si no se define una función de renderizado (cell), se usa el valor obtenido
   * mediante este accessor.
   * Se define como opcional para las columnas que únicamente utilizan cell.
   */
  accessor?: keyof T
  cell?: (row: T) => React.ReactNode
}

interface TableBasicProps<T> {
  columns: Column<T>[]
  data: T[]
}

export function TableBasic<T>({ columns, data }: TableBasicProps<T>) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-100"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.cell ? col.cell(row) : col.accessor ? String(row[col.accessor]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
