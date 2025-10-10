import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface TecnicaListHeaderProps {
  fieldList: ListHeaderField[]
}

/**
 * Componente específico para el header de la lista de Técnicas
 * Wrapper sobre el componente genérico ListHeader
 */
export const TecnicaListHeader = ({ fieldList }: TecnicaListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
