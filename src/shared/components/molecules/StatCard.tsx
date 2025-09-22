import { Card } from './Card'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color: 'warning' | 'info' | 'success' | 'primary' | 'danger' | 'secondary'
}

export const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => {
  const colorClasses = {
    warning: 'text-warning-600 bg-warning-50',
    info: 'text-info-600 bg-info-50',
    success: 'text-success-600 bg-success-50',
    primary: 'text-primary-600 bg-primary-50',
    danger: 'text-danger-600 bg-danger-50',
    secondary: 'text-secondary-600 bg-secondary-50'
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>{icon}</div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-surface-600">{title}</p>
            <p className="text-2xl font-bold text-surface-900">{value}</p>
            {subtitle && <p className="text-xs text-surface-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </Card>
  )
}
