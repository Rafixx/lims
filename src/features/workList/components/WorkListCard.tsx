// Componente para cada tarjeta de worklist
import React from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { Trash2, BarChart3, Clock, CheckCircle } from 'lucide-react'
import type { Worklist } from '../interfaces/worklist.types'
import { Button } from '@/shared/components/molecules/Button'
import { APP_STATES } from '@/shared/states'

interface WorklistCardProps {
  worklist: Worklist
  onDelete: (id: number, nombre: string) => void
  onView: () => void
}

export const WorklistCard: React.FC<WorklistCardProps> = ({ worklist, onDelete, onView }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const completionPercentage = worklist.tecnicas
    ? Math.round(((worklist.tecnicas.length || 0) / worklist.tecnicas.length) * 100)
    : 0

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div onClick={onView} className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{worklist.nombre}</h3>
            <div className="text-sm text-gray-600">{worklist.tecnica_proc?.tecnica_proc}</div>
          </div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              onClick={() => onDelete(worklist.id_worklist, worklist.nombre)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart3 size={16} />
              <span>Total técnicas</span>
            </div>
            <span className="font-medium">{worklist.tecnicas.length || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={16} />
              <span>Completadas</span>
            </div>
            <span className="font-medium">
              {worklist.tecnicas.filter(tecnica => tecnica.estado === APP_STATES.TECNICA.COMPLETADA)
                .length || 0}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {completionPercentage}% completado
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Creado: {formatDate(worklist.create_dt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
