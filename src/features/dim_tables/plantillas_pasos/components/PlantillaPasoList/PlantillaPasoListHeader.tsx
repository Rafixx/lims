import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface PlantillaPasoListHeaderProps {
  fieldList: ListHeaderField[]
}

export const PlantillaPasoListHeader = ({ fieldList }: PlantillaPasoListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
