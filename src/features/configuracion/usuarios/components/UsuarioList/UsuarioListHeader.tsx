import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

interface UsuarioListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

export const UsuarioListHeader = ({ fieldList, sortKey, sortDirection, onSort }: UsuarioListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
