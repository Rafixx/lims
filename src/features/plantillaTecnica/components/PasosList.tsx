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

      {/* Timeline de pasos */}
      {pasosOrdenados.length > 0 ? (
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />

          {/* Lista de pasos */}
          <div className="space-y-6">
            {pasosOrdenados.map((paso, index) => (
              <div key={paso.id} className="relative pl-12">
                {/* Número del paso */}
                <div className="absolute left-0 top-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {paso.orden}
                </div>

                {/* Contenido del paso */}
                <div className="bg-white border border-surface-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Código y descripción */}
                  <div className="mb-3">
                    {paso.codigo && (
                      <h3 className="text-lg font-bold text-surface-900 mb-2">{paso.codigo}</h3>
                    )}
                    <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
                      {paso.descripcion}
                    </p>
                  </div>
                </div>

                {/* Conector para el siguiente paso */}
                {index < pasosOrdenados.length - 1 && (
                  <div className="absolute left-4 -bottom-3 w-0.5 h-3 bg-surface-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-12">
          <ListOrdered className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">No hay pasos definidos para este protocolo</p>
        </div>
      )}
    </Card>
  )
}
