// src/features/plantillaTecnica/components/PasosList.tsx

import { Card } from '@/shared/components/molecules/Card'
import { ListOrdered, Clock, AlertCircle } from 'lucide-react'

interface PasosListProps {
  worklistId: number
}

/**
 * Componente que muestra el protocolo paso a paso
 */
export const PasosList = ({ worklistId }: PasosListProps) => {
  // TODO: Cargar pasos del protocolo
  // const { data: pasos, isLoading } = usePasosProtocolo(worklistId)
  console.log('Worklist ID:', worklistId) // temporal

  // Datos de ejemplo (temporal)
  const pasosEjemplo = [
    {
      id: 1,
      numero: 1,
      titulo: 'Preparación de las muestras',
      descripcion: 'Descongelar las muestras a temperatura ambiente durante 15 minutos',
      duracion: '15 min',
      temperatura: 'Temperatura ambiente',
      observaciones: 'No agitar las muestras'
    },
    {
      id: 2,
      numero: 2,
      titulo: 'Lisis celular',
      descripcion: 'Añadir 200 µL de buffer de lisis a cada muestra y mezclar por inversión',
      duracion: '5 min',
      temperatura: 'Temperatura ambiente',
      observaciones: null
    },
    {
      id: 3,
      numero: 3,
      titulo: 'Incubación',
      descripcion: 'Incubar a 56°C en baño maría',
      duracion: '30 min',
      temperatura: '56°C',
      observaciones: 'Agitar cada 10 minutos'
    },
    {
      id: 4,
      numero: 4,
      titulo: 'Centrifugación',
      descripcion: 'Centrifugar a 13000 rpm durante 10 minutos',
      duracion: '10 min',
      temperatura: 'Temperatura ambiente',
      observaciones: null
    }
  ]

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
            Procedimiento detallado para la ejecución de la técnica
          </p>
        </div>
      </div>

      {/* Timeline de pasos */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />

        {/* Lista de pasos */}
        <div className="space-y-6">
          {pasosEjemplo.map((paso, index) => (
            <div key={paso.id} className="relative pl-12">
              {/* Número del paso */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {paso.numero}
              </div>

              {/* Contenido del paso */}
              <div className="bg-white border border-surface-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Título y duración */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-surface-900">{paso.titulo}</h3>
                  <div className="flex items-center gap-1 text-xs text-surface-500 bg-surface-100 rounded-full px-3 py-1">
                    <Clock className="w-3 h-3" />
                    {paso.duracion}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-surface-700 mb-3">{paso.descripcion}</p>

                {/* Detalles adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Temperatura */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-surface-600">Temperatura:</span>
                    <span className="text-surface-700">{paso.temperatura}</span>
                  </div>

                  {/* Observaciones */}
                  {paso.observaciones && (
                    <div className="flex items-start gap-2 text-xs col-span-2">
                      <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-warning-700">Observaciones:</span>
                        <span className="text-surface-700 ml-1">{paso.observaciones}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conector para el siguiente paso */}
              {index < pasosEjemplo.length - 1 && (
                <div className="absolute left-4 -bottom-3 w-0.5 h-3 bg-surface-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estado vacío */}
      {pasosEjemplo.length === 0 && (
        <div className="text-center py-12">
          <ListOrdered className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">No hay pasos definidos para este protocolo</p>
        </div>
      )}
    </Card>
  )
}
