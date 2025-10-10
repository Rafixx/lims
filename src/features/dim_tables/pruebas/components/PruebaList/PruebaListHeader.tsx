import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface PruebaListHeaderProps {
  fieldList: ListHeaderField[]
}

export const PruebaListHeader = ({ fieldList }: PruebaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
