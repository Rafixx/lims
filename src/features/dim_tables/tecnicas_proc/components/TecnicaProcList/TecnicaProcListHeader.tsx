import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

interface TecnicaProcListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

export const TecnicaProcListHeader = ({ fieldList, sortKey, sortDirection, onSort }: TecnicaProcListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
