import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

interface MaquinaListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

export const MaquinaListHeader = ({ fieldList, sortKey, sortDirection, onSort }: MaquinaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
