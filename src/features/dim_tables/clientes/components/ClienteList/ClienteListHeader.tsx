import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface ClienteListHeaderProps {
  fieldList: ListHeaderField[]
}

export const ClienteListHeader = ({ fieldList }: ClienteListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
