import { ListHeader, ListHeaderField, ListHeaderProps } from '@/shared/components/organisms/ListHeader'

export interface PacienteListHeaderProps extends Pick<ListHeaderProps, 'sortKey' | 'sortDirection' | 'onSort'> {
  fieldList: ListHeaderField[]
}

export const PacienteListHeader = ({ fieldList, sortKey, sortDirection, onSort }: PacienteListHeaderProps) => {
  return <ListHeader fieldList={fieldList} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
}
