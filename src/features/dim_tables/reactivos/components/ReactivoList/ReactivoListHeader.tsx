import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface ReactivoListHeaderProps {
  fieldList: ListHeaderField[]
}

export const ReactivoListHeader = ({ fieldList }: ReactivoListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
