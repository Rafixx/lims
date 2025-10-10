import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface UbicacionListHeaderProps {
  fieldList: ListHeaderField[]
}

export const UbicacionListHeader = ({ fieldList }: UbicacionListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
