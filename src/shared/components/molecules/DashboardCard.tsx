import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface Props {
  title: string
  icon: ReactNode
  to: string
}

export const DashboardCard = ({ title, icon, to }: Props) => (
  <Link
    to={to}
    className="border border-surface-200 rounded-lg p-6 shadow-soft bg-white hover:shadow-medium transition-all flex flex-col items-start gap-2"
  >
    <div className="text-primary-600 text-4xl">{icon}</div>
    <h3 className="text-lg font-semibold text-surface-800">{title}</h3>
  </Link>
)
