// src/features/workList/components/WorkListDetailStats.tsx

import { Card } from '@/shared/components/molecules/Card'
import { BarChart3, Clock, CheckCircle } from 'lucide-react'

interface WorkListDetailStatsProps {
  totalTecnicas: number
  tecnicasEnProgreso: number
  tecnicasCompletadas: number
  porcentajeProgreso: number
}

export const WorkListDetailStats = ({
  totalTecnicas,
  tecnicasEnProgreso,
  tecnicasCompletadas,
  porcentajeProgreso
}: WorkListDetailStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">{totalTecnicas}</p>
            <p className="text-gray-600">Total técnicas</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">{tecnicasEnProgreso}</p>
            <p className="text-gray-600">En progreso</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">{tecnicasCompletadas}</p>
            <p className="text-gray-600">Completadas</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">
              {porcentajeProgreso > 0 ? `${porcentajeProgreso}%` : '0%'}
            </p>
            <p className="text-gray-600">Progreso</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
