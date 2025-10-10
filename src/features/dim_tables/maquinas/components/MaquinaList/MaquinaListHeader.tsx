import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface MaquinaListHeaderProps {
  fieldList: ListHeaderField[]
}

export const MaquinaListHeader = ({ fieldList }: MaquinaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
