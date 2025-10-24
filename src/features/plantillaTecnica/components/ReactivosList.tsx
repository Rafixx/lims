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
        <div className="space-y-2">
          {reactivos.map(reactivo => (
            <div
              key={reactivo.id}
              className="flex flex-col gap-2 p-3 bg-surface-50 border border-surface-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-success-600" />
                <h3 className="text-sm font-semibold text-surface-900">{reactivo.reactivo}</h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-surface-600 ml-6">
                <div>
                  <span className="font-semibold">Ref:</span> {reactivo.num_referencia}
                </div>
                {reactivo.lote && (
                  <>
                    <span className="text-surface-400">•</span>
                    <div>
                      <span className="font-semibold">Lote:</span> {reactivo.lote}
                    </div>
                  </>
                )}
                {reactivo.volumen_formula && (
                  <>
                    <span className="text-surface-400">•</span>
                    <div>
                      <span className="font-semibold">Vol:</span> {reactivo.volumen_formula}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-8">
          <Droplet className="w-10 h-10 text-surface-300 mx-auto mb-2" />
          <p className="text-surface-500 text-xs">No hay reactivos definidos</p>
        </div>
      )}
    </Card>
  )
}
