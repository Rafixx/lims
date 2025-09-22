import { Link } from 'react-router-dom'

export const MaestroCard = ({
  to,
  icon: Icon,
  title,
  description
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
}) => (
  <Link
    to={to}
    className="group p-6 bg-white rounded-lg border border-surface-200 hover:border-primary-300 hover:shadow-medium transition-all"
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
        <Icon className="w-6 h-6 text-secondary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-surface-600 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  </Link>
)
