import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface TecnicaProcListHeaderProps {
  fieldList: ListHeaderField[]
}

export const TecnicaProcListHeader = ({ fieldList }: TecnicaProcListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
