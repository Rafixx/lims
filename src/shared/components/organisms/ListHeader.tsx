import { getColSpanClass } from '@/shared/utils/helpers'

export interface ListHeaderField {
  label: string
  span: number
}

export interface ListHeaderProps {
  fieldList: ListHeaderField[]
  className?: string
}

/**
 * Componente genérico para renderizar encabezados de listas en formato grid
 * Utiliza grid-cols-12 y permite especificar el span de cada columna
 */
export const ListHeader = ({ fieldList, className = '' }: ListHeaderProps) => {
  const defaultClassName = 'grid grid-cols-12 gap-4 p-2 border-b font-semibold text-sm bg-gray-200'
  const finalClassName = className || defaultClassName

  return (
    <div className={finalClassName}>
      {fieldList.map((field, index) => (
        <div key={index} className={getColSpanClass(field.span)}>
          {field.label}
        </div>
      ))}
    </div>
  )
}
