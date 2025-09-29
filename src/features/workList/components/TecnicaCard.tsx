// src/features/workList/components/TecnicaCard.tsx

import { useState } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { ChevronRight, Beaker, Clock, CheckCircle, Circle } from 'lucide-react'
import { Tecnica } from '../interfaces/worklist.types'

interface Props {
  tecnica: Tecnica
  onToggle: () => void
  isSelected?: boolean
}

export const TecnicaCard = ({ tecnica, onToggle, isSelected = false }: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onToggle()
  }

  // Valores seguros para evitar errores
  const safeObligatoria = false // tecnica.proceso?.obligatoria ?? false

  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-primary-500 bg-primary-50 shadow-lg'
          : 'hover:ring-1 hover:ring-gray-300'
      } ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Card className={isSelected ? 'border-primary-200' : ''}>
        <div className="flex items-center justify-between p-4">
          {/* Checkbox de selección */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {isSelected ? (
                <CheckCircle className="h-6 w-6 text-primary-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 hover:text-primary-500" />
              )}
            </div>
            <div className="flex-shrink-0">
              <Beaker
                className={`h-8 w-8 ${isSelected ? 'text-primary-600' : 'text-primary-500'}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-medium truncate ${
                  isSelected ? 'text-primary-900' : 'text-gray-900'
                }`}
              >
                {tecnica.muestra?.codigo_epi || 'Sin código'}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {tecnica.muestra ? (
                  <>
                    <span>Código externo: {tecnica.muestra?.codigo_externo || 'N/A'}</span>
                    {safeObligatoria && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Obligatoria
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Sin muestra asociada</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isSelected && (
              <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                Seleccionada
              </div>
            )}
            <ChevronRight
              className={`h-5 w-5 transition-all duration-200 ${
                isSelected ? 'text-primary-600 rotate-90' : 'text-gray-400'
              }`}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
