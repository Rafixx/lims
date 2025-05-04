// /src/components/molecules/DashboardCard.tsx
import { Link } from 'react-router-dom'

interface Props {
  title: string
  icon: string
  to: string
}

export const DashboardCard = ({ title, icon, to }: Props) => (
  <Link to={to} className="border rounded p-6 shadow hover:shadow-lg transition">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-bold">{title}</h3>
  </Link>
)
