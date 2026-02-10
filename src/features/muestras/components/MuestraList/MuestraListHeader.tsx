import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface MuestraListHeaderProps {
  fieldList: ListHeaderField[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

/**
 * Componente específico para el header de la lista de Muestras
 * Wrapper sobre el componente genérico ListHeader
 */
export const MuestraListHeader = ({
  fieldList,
  sortKey,
  sortDirection,
  onSort
}: MuestraListHeaderProps) => {
  return (
    <ListHeader
      fieldList={fieldList}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  )
}
