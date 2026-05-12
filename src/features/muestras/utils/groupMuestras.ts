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
  // Pre-agrupar por key para conocer el tamaño de cada grupo
  const grouped = new Map<string, Muestra[]>()
  for (const m of muestras) {
    const key = m.estudio?.trim() ?? ''
    if (!key) continue
    const bucket = grouped.get(key)
    if (bucket) {
      bucket.push(m)
    } else {
      grouped.set(key, [m])
    }
  }

  // Recorrer en el orden original (ya ordenado) emitiendo cada grupo
  // en la posición de su primer elemento para preservar el sort.
  const result: MuestraListItem[] = []
  const emittedKeys = new Set<string>()

  for (const m of muestras) {
    const key = m.estudio?.trim() ?? ''
    if (!key) {
      result.push(toStandalone(m))
    } else if (!emittedKeys.has(key)) {
      emittedKeys.add(key)
      const children = grouped.get(key)!
      if (children.length === 1) {
        result.push(toStandalone(children[0]))
      } else {
        result.push({ isGrouped: true, key, parent: children[0], children })
      }
    }
    // ya emitido este grupo → omitir
  }

  return result
}
