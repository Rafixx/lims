import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface CentroListHeaderProps {
  fieldList: ListHeaderField[]
}

/**
 * Componente específico para el header de la lista de Centros
 * Wrapper sobre el componente genérico ListHeader
 */
export const CentroListHeader = ({ fieldList }: CentroListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
