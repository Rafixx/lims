import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface WorkListListHeaderProps {
  fieldList: ListHeaderField[]
}

/**
 * Componente específico para el header de la lista de WorkLists
 * Wrapper sobre el componente genérico ListHeader
 */
export const WorkListListHeader = ({ fieldList }: WorkListListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
