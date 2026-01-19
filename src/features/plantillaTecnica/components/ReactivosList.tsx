// src/features/plantillaTecnica/components/ReactivosList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Droplet } from 'lucide-react'
import { DimReactivo } from '../interfaces/plantillaTecnica.types'

interface ReactivosListProps {
  reactivos: DimReactivo[]
}

/**
 * Componente que muestra la lista de reactivos necesarios
 */
export const ReactivosList = ({ reactivos }: ReactivosListProps) => {
  return (
    <Card className="p-6 h-full">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-success-100 rounded-lg">
          <Droplet className="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-surface-900">Reactivos Necesarios</h2>
          <p className="text-xs text-surface-600">
            {reactivos.length} {reactivos.length === 1 ? 'reactivo' : 'reactivos'}
          </p>
        </div>
      </div>

      {/* Lista de reactivos */}
      {reactivos.length > 0 ? (
        <div className="space-y-1">
          {reactivos.map(reactivo => (
            <div
              key={reactivo.id}
              className="flex items-center gap-3 py-1.5 px-2 bg-surface-50 border border-surface-200 rounded"
            >
              <Droplet className="w-3 h-3 text-success-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-surface-900 truncate">
                {reactivo.reactivo}
              </span>
              <span className="text-xs text-surface-500">Ref: {reactivo.num_referencia}</span>
              {reactivo.lote && (
                <>
                  <span className="text-surface-300">•</span>
                  <span className="text-xs text-surface-500">Lote: {reactivo.lote}</span>
                </>
              )}
              {reactivo.volumen_formula && (
                <>
                  <span className="text-surface-300">•</span>
                  <span className="text-xs text-surface-500">Vol: {reactivo.volumen_formula}</span>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-4">
          <Droplet className="w-8 h-8 text-surface-300 mx-auto mb-1" />
          <p className="text-surface-500 text-xs">No hay reactivos definidos</p>
        </div>
      )}
    </Card>
  )
}
