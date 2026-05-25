import { StatCard } from '@/shared/components/molecules/StatCard'
import { Card } from '@/shared/components/molecules/Card'
import {
  Grid3X3,
  TestTube2,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  CalendarCheck
} from 'lucide-react'

export type MuestraStatsData = {
  total: number
  placas: number
  tubos: number
  registradas: number
  en_proceso: number
  completadas: number
  rechazadas: number
  recibidas_hoy: number
}

interface Props {
  stats?: MuestraStatsData
  isLoading?: boolean
}

export const MuestraStatsComponent = ({ stats, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-surface-200 rounded"></div>
                <div className="ml-3 flex-1">
                  <div className="h-3 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const v = (n: number | undefined) => (n ?? 0).toString()

  return (
    <div className="space-y-3 mb-6">
      {/* Fila 1 — volumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Muestras"
          value={v(stats?.total)}
          icon={<Layers className="h-5 w-5" />}
          color="secondary"
        />
        <StatCard
          title="Placas"
          value={v(stats?.placas)}
          subtitle="Tipo array"
          icon={<Grid3X3 className="h-5 w-5" />}
          color="info"
        />
        <StatCard
          title="Tubos"
          value={v(stats?.tubos)}
          subtitle="Muestra individual"
          icon={<TestTube2 className="h-5 w-5" />}
          color="primary"
        />
        <StatCard
          title="Recibidas hoy"
          value={v(stats?.recibidas_hoy)}
          subtitle="Fecha recepción"
          icon={<CalendarCheck className="h-5 w-5" />}
          color="warning"
        />
      </div>

      {/* Fila 2 — estados */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Registradas"
          value={v(stats?.registradas)}
          subtitle="Estado inicial"
          icon={<Clock className="h-5 w-5" />}
          color="warning"
        />
        <StatCard
          title="En Proceso"
          value={v(stats?.en_proceso)}
          subtitle="En análisis"
          icon={<Activity className="h-5 w-5" />}
          color="info"
        />
        <StatCard
          title="Completadas"
          value={v(stats?.completadas)}
          subtitle="Finalizadas"
          icon={<CheckCircle className="h-5 w-5" />}
          color="success"
        />
        <StatCard
          title="Rechazadas"
          value={v(stats?.rechazadas)}
          subtitle="No procesables"
          icon={<XCircle className="h-5 w-5" />}
          color="danger"
        />
      </div>
    </div>
  )
}

export const MuestraStats = MuestraStatsComponent
