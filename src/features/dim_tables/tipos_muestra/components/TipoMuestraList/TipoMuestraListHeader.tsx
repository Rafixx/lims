import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface TipoMuestraListHeaderProps {
  fieldList: ListHeaderField[]
}

export const TipoMuestraListHeader = ({ fieldList }: TipoMuestraListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
