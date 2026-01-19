// src/features/plantillaTecnica/components/PasosList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { ListOrdered } from 'lucide-react'
import { DimPasos } from '../interfaces/plantillaTecnica.types'

interface PasosListProps {
  pasos?: DimPasos[]
}

/**
 * Componente que muestra el protocolo paso a paso
 * Ahora integrado con datos reales desde plantillaTecnica.dimPlantillaPasos
 */
export const PasosList = ({ pasos = [] }: PasosListProps) => {
  // Validar que pasos sea un array y ordenar por orden ascendente
  const pasosOrdenados = Array.isArray(pasos) ? [...pasos].sort((a, b) => a.orden - b.orden) : []

  return (
    <Card className="p-6">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-warning-100 rounded-lg">
          <ListOrdered className="w-6 h-6 text-warning-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">Protocolo Paso a Paso</h2>
          <p className="text-sm text-surface-600">
            {pasosOrdenados.length} {pasosOrdenados.length === 1 ? 'paso' : 'pasos'} del protocolo
          </p>
        </div>
      </div>

      {/* Lista de pasos */}
      {pasosOrdenados.length > 0 ? (
        <div className="space-y-1">
          {pasosOrdenados.map(paso => (
            <div
              key={paso.id}
              className="flex items-center gap-3 py-1.5 px-2 bg-surface-50 border border-surface-200 rounded"
            >
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                {paso.orden}
              </span>
              {paso.codigo && (
                <span className="text-xs font-semibold text-surface-900">{paso.codigo}</span>
              )}
              <span className="text-xs text-surface-700">{paso.descripcion}</span>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-4">
          <ListOrdered className="w-8 h-8 text-surface-300 mx-auto mb-1" />
          <p className="text-surface-500 text-xs">No hay pasos definidos para este protocolo</p>
        </div>
      )}
    </Card>
  )
}
