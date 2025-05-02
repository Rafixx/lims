// src/features/solicitud/hooks/useFilteredSolicitudes.tsx
import { useMemo } from 'react'
import { Solicitud } from '../../solicitud/interfaces/solicitud.interface'
import { Estudio } from '../../estudio/interfaces/estudio.interface'
import { Muestra } from '../../muestras/interfaces/muestra.interface'
import { Proceso } from '../../proceso/interfaces/proceso.interface'
import { Resultado } from '../../resultado/interfaces/tipoResultado.interface'

// Define la interfaz para los filtros si no la tienes definida en otro lado
export interface Filter {
  id: string
  category: 'solicitudes' | 'muestras' | 'estudios' | 'procesos' | 'resultados'
  field: string
  value: string
}

export const useFilteredSolicitudes = (
  solicitudes: Solicitud[] | undefined,
  filters: Filter[]
): Solicitud[] | undefined => {
  const filteredSolicitudes = useMemo(() => {
    if (!solicitudes) return undefined

    return solicitudes.filter(sol => {
      return filters.every(filter => {
        switch (filter.category) {
          case 'solicitudes':
            return sol[filter.field as keyof Solicitud] === filter.value
          case 'muestras':
            return sol.muestras?.some(
              (muestra: Muestra) => muestra[filter.field as keyof Muestra] === filter.value
            )
          case 'estudios':
            return sol.muestras?.some(muestra =>
              muestra.estudios?.some(
                (estudio: Estudio) => estudio[filter.field as keyof Estudio] === filter.value
              )
            )
          case 'procesos':
            return sol.muestras?.some(muestra =>
              muestra.estudios?.some((estudio: Estudio) =>
                estudio.procesos?.some(
                  (proceso: Proceso) => proceso[filter.field as keyof Proceso] === filter.value
                )
              )
            )
          case 'resultados':
            return sol.muestras?.some(muestra =>
              muestra.estudios?.some((estudio: Estudio) =>
                estudio.procesos?.some((proceso: Proceso) =>
                  proceso.resultados?.some(
                    (resultado: Resultado) =>
                      resultado[filter.field as keyof Resultado] === filter.value
                  )
                )
              )
            )
          default:
            return true
        }
      })
    })
  }, [solicitudes, filters])

  return filteredSolicitudes
}
