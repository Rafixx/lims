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
    className="border rounded-md p-6 shadow bg-white hover:shadow-lg transition flex flex-col items-start gap-2"
  >
    <div className="text-primary text-4xl">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
  </Link>
)
