import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

interface PruebaListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

export const PruebaListHeader = ({ fieldList, sortKey, sortDirection, onSort }: PruebaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
