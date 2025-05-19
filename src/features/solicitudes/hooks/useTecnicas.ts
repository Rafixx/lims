// src/features/solicitudes/hooks/useTecnicas.ts
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'

export interface Tecnica {
  id: number
  tecnica_proc: string
}

export const useTecnicasPorPrueba = (pruebaId?: number) =>
  useQuery<Tecnica[], Error>({
    queryKey: ['tecnicasPorPrueba', pruebaId],
    queryFn: async () => {
      if (!pruebaId) return []
      const { data } = await apiClient.get<Tecnica[]>(`/pruebas/${pruebaId}/tecnicas`)
      return data
    },
    enabled: !!pruebaId
  })

// export const useTecnicaPorSolicitud = (solicitudId?: number) =>
//   useQuery<Tecnica[], Error>({
//     queryKey: ['tecnicasPorSolicitud', solicitudId],
//     queryFn: async () => {
//       if (!solicitudId) return []
//       const { data } = await apiClient.get<Tecnica[]>(`/tecnicas/solicitud/${solicitudId}`)
//       return data
//     },
//     enabled: !!solicitudId
//   })

export const useTecnicasPorMuestra = (muestraId?: number) =>
  useQuery<Tecnica[], Error>({
    queryKey: ['tecnicasPorMuestra', muestraId],
    queryFn: async () => {
      if (!muestraId) return []
      const { data } = await apiClient.get<Tecnica[]>(`/tecnicas/muestra/${muestraId}`)
      return data
    },
    enabled: !!muestraId
  })

/**
 * Hook unificado: escoge la query adecuada, y añade
 * el estado de eliminadas + los handlers de reorden/borre/reinserción.
 */
export const useTecnicas = (pruebaId?: number, muestraId?: number) => {
  const queryClient = useQueryClient()

  // 1️⃣ Elige la fuente de datos según los parámetros
  const query = muestraId ? useTecnicasPorMuestra(muestraId) : useTecnicasPorPrueba(pruebaId)

  // 2️⃣ Estado local de técnicas “eliminadas”
  const [tecnicasDeleted, setTecnicasDeleted] = useState<Tecnica[]>([])

  useEffect(() => {
    setTecnicasDeleted([])
  }, [pruebaId, muestraId])

  // 3️⃣ Cambiar orden: actualiza la cache de la query apropiada
  const setOrder = (newList: Tecnica[]) => {
    const key = muestraId ? ['tecnicasPorMuestra', muestraId] : ['tecnicasPorPrueba', pruebaId]
    queryClient.setQueryData(key, newList)
  }

  // 4️⃣ “Borrar” (mover a deleted)
  const deleteOne = (id: number) => {
    const all = query.data || []
    const item = all.find(t => t.id === id)
    if (!item) return
    setOrder(all.filter(t => t.id !== id))
    setTecnicasDeleted(d => [...d, item])
  }

  // 5️⃣ Reinsertar desde deleted
  const reinsertOne = (id: number) => {
    const item = tecnicasDeleted.find(t => t.id === id)
    if (!item) return
    setTecnicasDeleted(d => d.filter(t => t.id !== id))
    const all = query.data || []
    setOrder([...all, item])
  }

  return {
    // mantén isLoading, error, etc.
    ...query,
    // renombra .data para no chocar con nuestras props
    tecnicas: query.data || [],
    tecnicasDeleted,
    setOrder,
    deleteOne,
    reinsertOne
  }
}
