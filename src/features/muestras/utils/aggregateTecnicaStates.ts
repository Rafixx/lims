import { Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'

export type TecnicaStateCounts = {
  pendientes: number
  asignadas: number
  en_proceso: number
  completadas: number
  resultado_erroneo: number
}

const EMPTY: TecnicaStateCounts = {
  pendientes: 0,
  asignadas: 0,
  en_proceso: 0,
  completadas: 0,
  resultado_erroneo: 0
}

const categorizeTecnica = (t: Tecnica): keyof TecnicaStateCounts | null => {
  if (t.id_estado === 13) return null // CANCELADA — no contar
  const estado = (t.estadoInfo?.estado ?? '').toLowerCase()
  if (estado.includes('error') || estado.includes('erron') || estado.includes('erróne'))
    return 'resultado_erroneo'
  if (estado.includes('complet') || estado.includes('finaliz')) return 'completadas'
  if (estado.includes('proceso') || estado.includes('iniciada')) return 'en_proceso'
  if (t.worklist || estado.includes('asignad')) return 'asignadas'
  return 'pendientes'
}

export const aggregateTecnicaStates = (
  tecnicas: Tecnica[] | TecnicaAgrupada[]
): TecnicaStateCounts => {
  if (tecnicas.length === 0) return { ...EMPTY }

  if ('proceso_nombre' in tecnicas[0]) {
    return (tecnicas as TecnicaAgrupada[]).reduce(
      (acc, t) => ({
        pendientes: acc.pendientes + t.pendientes,
        asignadas: acc.asignadas + t.asignadas,
        en_proceso: acc.en_proceso + t.en_proceso,
        completadas: acc.completadas + t.completadas,
        resultado_erroneo: acc.resultado_erroneo + t.resultado_erroneo
      }),
      { ...EMPTY }
    )
  }

  const counts = { ...EMPTY }
  for (const t of tecnicas as Tecnica[]) {
    const bucket = categorizeTecnica(t)
    if (bucket) counts[bucket]++
  }
  return counts
}
