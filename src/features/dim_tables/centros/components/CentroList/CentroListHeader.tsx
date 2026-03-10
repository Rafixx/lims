import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

export interface CentroListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

/**
 * Componente específico para el header de la lista de Centros
 * Wrapper sobre el componente genérico ListHeader
 */
export const CentroListHeader = ({ fieldList, sortKey, sortDirection, onSort }: CentroListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
