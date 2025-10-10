import { ListHeader, ListHeaderField } from '@/shared/components/organisms/ListHeader'

export interface MuestraListHeaderProps {
  fieldList: ListHeaderField[]
}

/**
 * Componente específico para el header de la lista de Muestras
 * Wrapper sobre el componente genérico ListHeader
 */
export const MuestraListHeader = ({ fieldList }: MuestraListHeaderProps) => {
  return <ListHeader fieldList={fieldList} />
}
