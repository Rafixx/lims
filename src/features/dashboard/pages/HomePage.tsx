import { DashboardCard } from '@/shared/components/molecules/DashboardCard'

export const HomePage = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <DashboardCard title="Muestras" icon="🧪" to="/muestras" />
    <DashboardCard title="Resultados" icon="📈" to="/resultados" />
  </div>
)
