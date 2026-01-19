import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface WorkListListHeaderProps {
  fieldList: ListHeaderField[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (sortKey: string) => void
}

/**
 * Componente específico para el header de la lista de WorkLists
 * Wrapper sobre el componente genérico ListHeader
 */
export const WorkListListHeader = ({
  fieldList,
  sortKey,
  sortDirection,
  onSort
}: WorkListListHeaderProps) => {
  return (
    <ListHeader
      fieldList={fieldList}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  )
}
