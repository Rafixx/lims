import { DashboardCard } from '@/shared/components/molecules/DashboardCard'
import { homePageMainCards, homePageConfigCard } from '@/shared/config/menuConfig'

export const HomePage = () => (
  <div className="space-y-8">
    {/* Sección principal */}
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-4">Área de Trabajo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homePageMainCards.map(({ path, label, icon: Icon, description }) => (
          <DashboardCard
            key={path}
            title={label}
            description={description}
            icon={<Icon className="w-5 h-5" />}
            to={path}
            variant="primary"
          />
        ))}
      </div>
    </div>

    {/* Sección de configuración */}
    <div>
      <h2 className="text-2xl font-bold text-surface-900 mb-4">Configuración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          key={homePageConfigCard.path}
          title={homePageConfigCard.label}
          description={homePageConfigCard.description}
          icon={<homePageConfigCard.icon className="w-5 h-5" />}
          to={homePageConfigCard.path}
          variant="secondary"
        />
      </div>
    </div>
  </div>
)
