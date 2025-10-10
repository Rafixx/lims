import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

interface PipetaListHeaderProps {
  fieldList: ListHeaderField[]
}

export const PipetaListHeader = ({ fieldList }: PipetaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
