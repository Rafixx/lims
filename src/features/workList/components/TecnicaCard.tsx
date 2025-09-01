// src/features/workList/components/TecnicaCard.tsx

import { useState } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { TecnicaAgrupada } from '../interfaces/worklist.types'
import { ChevronRight, Beaker, Clock } from 'lucide-react'

interface Props {
  tecnica: TecnicaAgrupada
  onClick: (idTecnicaProc: number) => void
  isSelected?: boolean
}

export const TecnicaCard = ({ tecnica, onClick, isSelected = false }: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onClick(tecnica.id_tecnica_proc)
  }

  // Valores seguros para evitar errores
  const safeOrden = tecnica.proceso?.orden ?? 0
  const safeObligatoria = tecnica.proceso?.obligatoria ?? false
  const safeCantidad = tecnica.cantidad ?? 0

  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Card>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Beaker className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">{tecnica.tecnica_proc}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {tecnica.proceso ? (
                  <>
                    <span>Orden: {safeOrden}</span>
                    {safeObligatoria && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Obligatoria
                      </span>
                    )}
                  </>
                ) : (
                  <span>ID: {tecnica.id_tecnica_proc}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{safeCantidad}</div>
              <div className="text-xs text-gray-500">pendientes</div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isSelected ? 'rotate-90' : ''
              }`}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
