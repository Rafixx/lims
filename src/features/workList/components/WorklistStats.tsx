// src/features/workList/components/WorklistStats.tsx

import { Card } from '@/shared/components/molecules/Card'
import { WorklistStats as WorklistStatsType } from '../interfaces/worklist.types'
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

interface Props {
  stats?: WorklistStatsType
  isLoading?: boolean
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: 'warning' | 'info' | 'success' | 'primary'
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    warning: 'text-yellow-600 bg-yellow-50',
    info: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    primary: 'text-purple-600 bg-purple-50'
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export const WorklistStats = ({ stats, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Función helper para obtener valores seguros
  const getSafeValue = (value: number | undefined | null): number => {
    return value ?? 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Técnicas Pendientes"
        value={getSafeValue(stats?.total_tecnicas_pendientes).toString()}
        icon={<AlertCircle className="h-6 w-6" />}
        color="warning"
      />
      <StatCard
        title="En Progreso"
        value={getSafeValue(stats?.total_tecnicas_en_progreso).toString()}
        icon={<Clock className="h-6 w-6" />}
        color="info"
      />
      <StatCard
        title="Completadas Hoy"
        value={getSafeValue(stats?.total_tecnicas_completadas_hoy).toString()}
        icon={<CheckCircle className="h-6 w-6" />}
        color="success"
      />
      <StatCard
        title="Procesos Activos"
        value={getSafeValue(stats?.total_procesos).toString()}
        icon={<TrendingUp className="h-6 w-6" />}
        color="primary"
      />
    </div>
  )
}
