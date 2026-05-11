import { Muestra } from '../interfaces/muestras.types'

export const sortMuestras = (
  items: Muestra[],
  sortKey: string,
  sortDirection: 'asc' | 'desc'
): Muestra[] => {
  if (!sortKey) return items
  return [...items].sort((a, b) => {
    let cmp = 0
    switch (sortKey) {
      case 'codigo_externo':
        cmp = (a.codigo_externo || '').localeCompare(b.codigo_externo || '')
        break
      case 'codigo_epi':
        cmp = (a.codigo_epi || '').localeCompare(b.codigo_epi || '')
        break
      case 'cliente':
        cmp = (a.solicitud?.cliente?.nombre || '').localeCompare(b.solicitud?.cliente?.nombre || '')
        break
      case 'tipo_muestra':
        cmp = (a.tipo_muestra?.tipo_muestra || '').localeCompare(b.tipo_muestra?.tipo_muestra || '')
        break
      case 'prueba':
        cmp = (a.prueba?.prueba || '').localeCompare(b.prueba?.prueba || '')
        break
      case 'estudio':
        cmp = (a.estudio || '').localeCompare(b.estudio || '')
        break
      case 'f_recepcion':
        cmp = (a.f_recepcion || '').localeCompare(b.f_recepcion || '')
        break
      case 'estado':
        cmp = (a.estadoInfo?.estado || '').localeCompare(b.estadoInfo?.estado || '')
        break
    }
    return sortDirection === 'asc' ? cmp : -cmp
  })
}
