// src/features/plantillaTecnica/components/PipetasList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Pipette } from 'lucide-react'
import { DimPipeta } from '../interfaces/plantillaTecnica.types'

interface PipetasListProps {
  pipetas: DimPipeta[]
}

/**
 * Componente que muestra la lista de pipetas necesarias
 */
export const PipetasList = ({ pipetas }: PipetasListProps) => {
  return (
    <Card className="p-6 h-full">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-info-100 rounded-lg">
          <Pipette className="w-5 h-5 text-info-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-surface-900">Pipetas Necesarias</h2>
          <p className="text-xs text-surface-600">
            {pipetas.length} {pipetas.length === 1 ? 'pipeta' : 'pipetas'}
          </p>
        </div>
      </div>

      {/* Lista de pipetas */}
      {pipetas.length > 0 ? (
        <div className="space-y-2">
          {pipetas.map(pipeta => (
            <div
              key={pipeta.id}
              className="flex items-center justify-between p-3 bg-surface-50 border border-surface-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Pipette className="w-4 h-4 text-info-600" />
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">{pipeta.modelo}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-surface-500">{pipeta.codigo}</p>
                    <span className="text-xs text-surface-400">•</span>
                    <span className="text-xs bg-surface-200 text-surface-700 rounded px-1.5 py-0.5">
                      {pipeta.zona}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-8">
          <Pipette className="w-10 h-10 text-surface-300 mx-auto mb-2" />
          <p className="text-surface-500 text-xs">No hay pipetas definidas</p>
        </div>
      )}
    </Card>
  )
}
