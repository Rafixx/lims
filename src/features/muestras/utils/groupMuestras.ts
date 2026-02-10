// src/features/muestras/utils/groupMuestras.ts
//
// Estrategia de agrupación: agrupar por `estudio` (no nulo/vacío).
// - Muestras sin estudio → standalone (isGrouped: false).
// - Grupos con un único elemento → standalone (no tiene sentido mostrar agrupador).
// - Grupos con ≥ 2 elementos → MuestraGroup (padre + hijos).
// - Si muestras del mismo estudio difieren en campos comunes (cliente, paciente…),
//   se agrupan igualmente y los datos del padre vienen del primer elemento del grupo
//   (estrategia b del requisito).

import {
  Muestra,
  MuestraGroup,
  MuestraListItem,
  MuestraStandalone
} from '../interfaces/muestras.types'

const toStandalone = (m: Muestra): MuestraStandalone => ({ ...m, isGrouped: false as const })

export const groupMuestrasByEstudio = (muestras: Muestra[]): MuestraListItem[] => {
  const grouped = new Map<string, Muestra[]>()
  const ungrouped: Muestra[] = []

  for (const m of muestras) {
    const key = m.estudio?.trim() ?? ''
    if (!key) {
      ungrouped.push(m)
    } else {
      const bucket = grouped.get(key)
      if (bucket) {
        bucket.push(m)
      } else {
        grouped.set(key, [m])
      }
    }
  }

  const result: MuestraListItem[] = []

  // Preserve insertion order: iterate in the order keys were first seen
  for (const [key, children] of grouped) {
    if (children.length === 1) {
      // Single-element group → treat as standalone
      result.push(toStandalone(children[0]))
    } else {
      const group: MuestraGroup = {
        isGrouped: true,
        key,
        parent: children[0],
        children
      }
      result.push(group)
    }
  }

  // Append ungrouped standalones at the end
  for (const m of ungrouped) {
    result.push(toStandalone(m))
  }

  return result
}
