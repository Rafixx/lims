import { DashboardCard } from '@/shared/components/molecules/DashboardCard'
import { homePageMenuCards } from '@/shared/config/menuConfig'

export const HomePage = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {homePageMenuCards.map(({ path, label, icon: Icon }) => (
      <DashboardCard key={path} title={label} icon={<Icon className="w-5 h-5" />} to={path} />
    ))}
  </div>
)
