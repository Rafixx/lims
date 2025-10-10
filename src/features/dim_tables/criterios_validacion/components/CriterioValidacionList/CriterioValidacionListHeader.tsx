import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface CriterioValidacionListHeaderProps {
  fieldList: ListHeaderField[]
}

export const CriterioValidacionListHeader = ({ fieldList }: CriterioValidacionListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
