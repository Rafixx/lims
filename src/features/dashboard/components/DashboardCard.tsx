import { Link } from 'react-router-dom'
import { homePageMainCards, homePageConfigCard } from '@/shared/config/menuConfig'
import { ChevronRight } from 'lucide-react'

const DashboardCard = ({
  to,
  icon: Icon,
  title,
  description,
  variant = 'primary'
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  variant?: 'primary' | 'secondary'
}) => {
  const baseClasses =
    'group relative p-6 rounded-xl border transition-all duration-200 hover:shadow-medium'
  const variantClasses =
    variant === 'primary'
      ? 'bg-white border-surface-200 hover:border-primary-300 hover:bg-primary-50/30'
      : 'bg-surface-50 border-surface-200 hover:border-surface-300 hover:bg-surface-100'

  return (
    <Link to={to} className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
              variant === 'primary'
                ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
                : 'bg-surface-200 text-surface-600 group-hover:bg-surface-300'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              variant === 'primary' ? 'text-surface-900' : 'text-surface-800'
            }`}
          >
            {title}
          </h3>
          {description && <p className="text-sm text-surface-600 leading-relaxed">{description}</p>}
        </div>
        <ChevronRight
          className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
            variant === 'primary' ? 'text-surface-400' : 'text-surface-500'
          }`}
        />
      </div>
    </Link>
  )
}

export const EnhancedDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Sistema de Gestión de Laboratorio
        </h1>
        <p className="text-surface-600">Accede rápidamente a las funciones principales del LIMS</p>
      </div>

      {/* Funciones Principales */}
      <section>
        <h2 className="text-xl font-semibold text-surface-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-primary-600 rounded"></div>
          Funciones Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homePageMainCards.map(card => (
            <DashboardCard
              key={card.path}
              to={card.path}
              icon={card.icon}
              title={card.label}
              description={card.description}
              variant="primary"
            />
          ))}
        </div>
      </section>

      {/* Configuración y Maestros */}
      <section>
        <h2 className="text-lg font-medium text-surface-700 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-surface-400 rounded"></div>
          Configuración del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard
            to={homePageConfigCard.path}
            icon={homePageConfigCard.icon}
            title={homePageConfigCard.label}
            description={homePageConfigCard.description}
            variant="secondary"
          />
          <div className="flex items-center justify-center p-6 rounded-xl border border-dashed border-surface-300 text-surface-500">
            <div className="text-center">
              <p className="text-sm">Más opciones de configuración</p>
              <p className="text-xs text-surface-400 mt-1">Próximamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Overview rápido */}
      <section className="bg-surface-50 rounded-xl p-6 border border-surface-200">
        <h3 className="text-lg font-medium text-surface-800 mb-4">Resumen Rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-surface-200">
            <p className="text-2xl font-bold text-primary-600">--</p>
            <p className="text-sm text-surface-600">Muestras Hoy</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-surface-200">
            <p className="text-2xl font-bold text-info-600">--</p>
            <p className="text-sm text-surface-600">En Proceso</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-surface-200">
            <p className="text-2xl font-bold text-success-600">--</p>
            <p className="text-sm text-surface-600">Completadas</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-surface-200">
            <p className="text-2xl font-bold text-warning-600">--</p>
            <p className="text-sm text-surface-600">Pendientes</p>
          </div>
        </div>
      </section>
    </div>
  )
}
