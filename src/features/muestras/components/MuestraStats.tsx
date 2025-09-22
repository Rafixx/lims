import { StatCard } from '@/shared/components/molecules/StatCard'
import { Card } from '@/shared/components/molecules/Card'
import type { MuestraStats as MuestraStatsData } from '../interfaces/muestras.types'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  // TrendingUp,
  Calendar,
  Activity,
  Target
} from 'lucide-react'

interface Props {
  stats?: MuestraStatsData
  isLoading?: boolean
}

export const MuestraStatsComponent = ({ stats, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-surface-200 rounded"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-surface-200 rounded w-1/2"></div>
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

  return (
    <div className="space-y-4 mb-6">
      {/* Primera fila - Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solicitudes"
          value={getSafeValue(stats?.total).toString()}
          icon={<FileText className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard
          title="Pendientes"
          value={getSafeValue(stats?.pendientes).toString()}
          subtitle="Esperando procesamiento"
          icon={<Clock className="h-6 w-6" />}
          color="warning"
        />
        <StatCard
          title="En Progreso"
          value={getSafeValue(stats?.en_proceso).toString()}
          subtitle="Siendo procesadas"
          icon={<Activity className="h-6 w-6" />}
          color="info"
        />
        <StatCard
          title="Completadas"
          value={getSafeValue(stats?.completadas).toString()}
          subtitle="Finalizadas"
          icon={<CheckCircle className="h-6 w-6" />}
          color="success"
        />
      </div>

      {/* Segunda fila - Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vencidas"
          value={getSafeValue(stats?.vencidas).toString()}
          subtitle="Fuera de plazo"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="danger"
        />
        {/* <StatCard
          title="Tiempo Promedio"
          value={formatTime(stats?. ?? null)}
          subtitle="De procesamiento"
          icon={<TrendingUp className="h-6 w-6" />}
          color="primary"
        /> */}
        <StatCard
          title="Creadas Hoy"
          value={getSafeValue(stats?.creadas_hoy).toString()}
          subtitle="Nuevas solicitudes"
          icon={<Calendar className="h-6 w-6" />}
          color="info"
        />
        <StatCard
          title="Completadas Hoy"
          value={getSafeValue(stats?.completadas_hoy).toString()}
          subtitle="Finalizadas hoy"
          icon={<Target className="h-6 w-6" />}
          color="success"
        />
      </div>
    </div>
  )
}

// Exportamos con el nombre original para mantener compatibilidad
export const MuestraStats = MuestraStatsComponent
