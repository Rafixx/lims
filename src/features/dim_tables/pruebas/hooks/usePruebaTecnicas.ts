import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { dimTablesQueryKeys, useTecnicasProcByPrueba } from '@/shared/hooks/useDim_tables'
import { dimTablesService } from '@/shared/services/dim_tables.services'
import { useUser } from '@/shared/contexts/UserContext'
import type { TecnicaProc } from '@/shared/interfaces/dim_tables.types'

/**
 * Técnica en estado local del formulario (modo create).
 * Usa IDs negativos para que sean únicos y compatibles con EditableList
 * sin colisionar con IDs reales de la BD.
 */
export interface TecnicaLocal {
  id: number // negativo mientras no está en BD
  tecnica_proc: string
  orden: number
}

let localIdCounter = 0
const nextLocalId = () => --localIdCounter

// ============================================================
// Hook para modo CREATE (sin pruebaId aún)
// ============================================================

export const usePruebaTecnicasCreate = () => {
  const { user } = useUser()
  const [tecnicas, setTecnicas] = useState<TecnicaLocal[]>([])

  const addTecnica = useCallback((nombre: string) => {
    setTecnicas(prev => {
      const isDuplicate = prev.some(
        t => t.tecnica_proc.trim().toLowerCase() === nombre.trim().toLowerCase()
      )
      if (isDuplicate) return prev
      const orden = prev.length + 1
      return [...prev, { id: nextLocalId(), tecnica_proc: nombre.trim(), orden }]
    })
  }, [])

  const removeTecnica = useCallback((id: number) => {
    setTecnicas(prev => {
      const filtered = prev.filter(t => t.id !== id)
      return filtered.map((t, i) => ({ ...t, orden: i + 1 }))
    })
  }, [])

  const reorder = useCallback((newList: TecnicaLocal[]) => {
    setTecnicas(newList.map((t, i) => ({ ...t, orden: i + 1 })))
  }, [])

  /** Persiste todas las técnicas locales vinculadas a la prueba recién creada */
  const persistAll = async (id_prueba: number) => {
    await Promise.all(
      tecnicas.map(t =>
        dimTablesService.createTecnicaProc({
          tecnica_proc: t.tecnica_proc,
          orden: t.orden,
          id_prueba,
          activa: true,
          created_by: user?.id
        })
      )
    )
  }

  return { tecnicas, addTecnica, removeTecnica, reorder, persistAll }
}

// ============================================================
// Hook para modo EDIT (pruebaId ya existe en BD)
// ============================================================

export const usePruebaTecnicasEdit = (pruebaId: number) => {
  const { user } = useUser()
  const queryClient = useQueryClient()

  const { data: activasData = [], isLoading: loadingActivas } = useTecnicasProcByPrueba(
    pruebaId,
    true
  )
  const { data: inactivasData = [], isLoading: loadingInactivas } = useTecnicasProcByPrueba(
    pruebaId,
    false
  )

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.prueba(pruebaId) })
  }

  /** Crea nueva técnica o reactiva una inactiva existente con el mismo nombre */
  const addTecnica = async (nombre: string) => {
    const isDuplicate = activasData.some(
      t => t.tecnica_proc.trim().toLowerCase() === nombre.trim().toLowerCase()
    )
    if (isDuplicate) throw new Error(`La técnica "${nombre}" ya existe en esta prueba`)

    const inactiva = inactivasData.find(
      t => t.tecnica_proc.trim().toLowerCase() === nombre.trim().toLowerCase()
    )
    if (inactiva) {
      await dimTablesService.updateTecnicaProc(inactiva.id, { activa: true })
    } else {
      const nextOrden = activasData.length + 1
      await dimTablesService.createTecnicaProc({
        tecnica_proc: nombre.trim(),
        orden: nextOrden,
        id_prueba: pruebaId,
        activa: true,
        created_by: user?.id
      })
    }
    invalidate()
  }

  /** Desactiva lógicamente una técnica (activa=false) */
  const removeTecnica = async (id: number) => {
    await dimTablesService.updateTecnicaProc(id, { activa: false })
    invalidate()
  }

  /** Reactiva una técnica previamente desactivada */
  const reactivateTecnica = async (id: number) => {
    await dimTablesService.updateTecnicaProc(id, { activa: true })
    invalidate()
  }

  /** Reordena y persiste el nuevo orden en batch */
  const reorder = async (newList: TecnicaProc[]) => {
    const reordered = newList.map((t, i) => ({ ...t, orden: i + 1 }))
    const items = reordered.map(t => ({ id: t.id, orden: t.orden }))
    // Actualizar cache optimistamente con orden correcto para evitar flash visual
    queryClient.setQueryData(dimTablesQueryKeys.tecnicasProcByPrueba(pruebaId, true), reordered)
    try {
      await dimTablesService.batchUpdateTecnicasProcOrden(items)
    } catch (err) {
      // Si falla, invalidar para recargar el estado real del servidor
      invalidate()
      throw err
    }
  }

  return {
    activas: activasData,
    inactivas: inactivasData,
    isLoading: loadingActivas || loadingInactivas,
    addTecnica,
    removeTecnica,
    reactivateTecnica,
    reorder
  }
}
