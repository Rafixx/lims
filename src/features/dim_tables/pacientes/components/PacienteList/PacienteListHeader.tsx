import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface PacienteListHeaderProps {
  fieldList: ListHeaderField[]
}

export const PacienteListHeader = ({ fieldList }: PacienteListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
