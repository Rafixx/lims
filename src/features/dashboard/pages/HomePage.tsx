import { DashboardCard } from '@/shared/components/molecules/DashboardCard'
import { FileText, BarChart2 } from 'lucide-react'

export const HomePage = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <DashboardCard title="Solicitudes" icon={<FileText className="w-8 h-8" />} to="/solicitudes" />
    <DashboardCard title="Resultados" icon={<BarChart2 className="w-8 h-8" />} to="/resultados" />
  </div>
)
