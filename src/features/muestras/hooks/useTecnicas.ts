// src/features/solicitudes/hooks/useTecnicas.ts
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/services/apiClient'
import { Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'

// Tipo unificado para manejar técnicas normales y agrupadas
export interface TecnicaSimple {
  id: number
  nombre: string
}

// Tipo para DimTecnicaProc (viene de /pruebas/:id/tecnicas)
interface DimTecnicaProcSimple {
  id: number
  tecnica_proc: string
  orden?: number
}

// Convierte Tecnica o DimTecnicaProcSimple a TecnicaSimple
const mapTecnicaToSimple = (tecnica: Tecnica | DimTecnicaProcSimple): TecnicaSimple => {
  // Si viene de /pruebas/:id/tecnicas (DimTecnicaProc)
  // Este tipo tiene 'tecnica_proc' como string directo, no como objeto anidado
  if ('tecnica_proc' in tecnica && typeof tecnica.tecnica_proc === 'string') {
    const dimTecnica = tecnica as DimTecnicaProcSimple
    return {
      id: dimTecnica.id,
      nombre: dimTecnica.tecnica_proc
    }
  }

  // Si es una Técnica normal (de una muestra)
  // Este tipo tiene 'tecnica_proc' como objeto anidado con { id, tecnica_proc }
  const tecnicaNormal = tecnica as Tecnica
  return {
    id: tecnicaNormal.id_tecnica || 0,
    nombre: tecnicaNormal.tecnica_proc?.tecnica_proc || 'Sin nombre'
  }
}

// Convierte TecnicaAgrupada a TecnicaSimple
const mapTecnicaAgrupadaToSimple = (tecnica: TecnicaAgrupada): TecnicaSimple => ({
  id: tecnica.primera_tecnica_id,
  nombre: tecnica.proceso_nombre
})

export const useTecnicasPorPrueba = (pruebaId?: number) =>
  useQuery<TecnicaSimple[], Error>({
    queryKey: ['tecnicasPorPrueba', pruebaId],
    queryFn: async () => {
      if (!pruebaId || pruebaId <= 0) return []
      const { data } = await apiClient.get<DimTecnicaProcSimple[]>(`/pruebas/${pruebaId}/tecnicas`)
      return data.map(mapTecnicaToSimple)
    },
    enabled: !!pruebaId && pruebaId > 0
  })

export const useTecnicasPorMuestra = (muestraId?: number) =>
  useQuery<TecnicaSimple[], Error>({
    queryKey: ['tecnicasPorMuestra', muestraId],
    queryFn: async () => {
      if (!muestraId || muestraId <= 0) return []
      // Usar el endpoint agrupadas que devuelve técnicas normales o agrupadas según el tipo de muestra
      const { data } = await apiClient.get<Tecnica[] | TecnicaAgrupada[]>(
        `/tecnicas/muestra/${muestraId}/agrupadas`
      )

      // Verificar si son técnicas agrupadas o normales
      if (data.length > 0 && 'proceso_nombre' in data[0]) {
        return (data as TecnicaAgrupada[]).map(mapTecnicaAgrupadaToSimple)
      }
      return (data as Tecnica[]).map(mapTecnicaToSimple)
    },
    enabled: !!muestraId && muestraId > 0
  })

/**
 * Hook unificado: escoge la query adecuada, y añade
 * el estado de eliminadas + los handlers de reorden/borre/reinserción.
 */
export const useTecnicas = (pruebaId?: number, muestraId?: number) => {
  const queryClient = useQueryClient()

  // 1️⃣ Elige la fuente de datos según los parámetros
  const query =
    muestraId && muestraId > 0 ? useTecnicasPorMuestra(muestraId) : useTecnicasPorPrueba(pruebaId)

  // 2️⃣ Estado local de técnicas "eliminadas"
  const [tecnicasDeleted, setTecnicasDeleted] = useState<TecnicaSimple[]>([])

  useEffect(() => {
    setTecnicasDeleted([])
  }, [pruebaId, muestraId])

  // 3️⃣ Cambiar orden: actualiza la cache de la query apropiada
  const setOrder = (newList: TecnicaSimple[]) => {
    const key =
      muestraId && muestraId > 0
        ? ['tecnicasPorMuestra', muestraId]
        : ['tecnicasPorPrueba', pruebaId]
    queryClient.setQueryData(key, newList)
  }

  // 4️⃣ "Borrar" (mover a deleted)
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
