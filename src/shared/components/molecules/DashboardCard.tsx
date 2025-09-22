import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface Props {
  title: string
  icon: ReactNode
  to: string
  description?: string
  variant?: 'primary' | 'secondary'
}

export const DashboardCard = ({ title, icon, to, description, variant = 'primary' }: Props) => {
  const variantStyles = {
    primary: 'border-surface-200 hover:border-primary-300 hover:shadow-medium',
    secondary: 'border-surface-200 hover:border-secondary-300 hover:shadow-medium bg-surface-50'
  }

  return (
    <Link
      to={to}
      className={`border rounded-lg p-6 shadow-soft bg-white transition-all flex flex-col items-start gap-2 ${variantStyles[variant]}`}
    >
      <div
        className={`text-4xl ${variant === 'primary' ? 'text-primary-600' : 'text-secondary-600'}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-800">{title}</h3>
      {description && <p className="text-sm text-surface-600 leading-relaxed">{description}</p>}
    </Link>
  )
}
