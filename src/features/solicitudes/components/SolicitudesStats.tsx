// src/features/solicitudes/components/SolicitudesStats.tsx

import { Card } from '@/shared/components/molecules/Card'
import { SolicitudesStats as SolicitudesStatsType } from '../interfaces/stats.types'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  Target
} from 'lucide-react'

interface Props {
  stats?: SolicitudesStatsType
  isLoading?: boolean
}

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color: 'warning' | 'info' | 'success' | 'primary' | 'danger' | 'secondary'
}

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => {
  const colorClasses = {
    warning: 'text-yellow-600 bg-yellow-50',
    info: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    primary: 'text-purple-600 bg-purple-50',
    danger: 'text-red-600 bg-red-50',
    secondary: 'text-gray-600 bg-gray-50'
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>{icon}</div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </Card>
  )
}

export const SolicitudesStats = ({ stats, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
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

  const formatTime = (hours: number | null): string => {
    if (hours === null || hours === undefined) return 'N/A'
    if (hours < 24) return `${Math.round(hours)}h`
    return `${Math.round(hours / 24)}d`
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Primera fila - Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solicitudes"
          value={getSafeValue(stats?.total_solicitudes).toString()}
          icon={<FileText className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard
          title="Pendientes"
          value={getSafeValue(stats?.solicitudes_pendientes).toString()}
          subtitle="Esperando procesamiento"
          icon={<Clock className="h-6 w-6" />}
          color="warning"
        />
        <StatCard
          title="En Progreso"
          value={getSafeValue(stats?.solicitudes_en_progreso).toString()}
          subtitle="Siendo procesadas"
          icon={<Activity className="h-6 w-6" />}
          color="info"
        />
        <StatCard
          title="Completadas"
          value={getSafeValue(stats?.solicitudes_completadas).toString()}
          subtitle="Finalizadas"
          icon={<CheckCircle className="h-6 w-6" />}
          color="success"
        />
      </div>

      {/* Segunda fila - Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vencidas"
          value={getSafeValue(stats?.solicitudes_vencidas).toString()}
          subtitle="Fuera de plazo"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="danger"
        />
        <StatCard
          title="Tiempo Promedio"
          value={formatTime(stats?.promedio_tiempo_procesamiento ?? null)}
          subtitle="De procesamiento"
          icon={<TrendingUp className="h-6 w-6" />}
          color="primary"
        />
        <StatCard
          title="Creadas Hoy"
          value={getSafeValue(stats?.solicitudes_creadas_hoy).toString()}
          subtitle="Nuevas solicitudes"
          icon={<Calendar className="h-6 w-6" />}
          color="info"
        />
        <StatCard
          title="Completadas Hoy"
          value={getSafeValue(stats?.solicitudes_completadas_hoy).toString()}
          subtitle="Finalizadas hoy"
          icon={<Target className="h-6 w-6" />}
          color="success"
        />
      </div>
    </div>
  )
}
