import { Link } from 'react-router-dom'
import { configMenuItems } from '@/shared/config/menuConfig'
import { ArrowLeft } from 'lucide-react'
import { MaestroCard } from '../components/MaestroCard'

export const MaestrosPage = () => {
  return (
    <div className="space-y-8">
      {/* Header con navegación */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-surface-900 mb-2">Configuración del Sistema</h1>
        <p className="text-surface-600">Configura y gestiona los datos maestros del laboratorio</p>
      </div>

      {/* Grid de maestros */}
      <div className="grid gap-4 md:grid-cols-4">
        {configMenuItems.children.map(item => (
          <MaestroCard
            key={item.path}
            to={item.path}
            icon={item.icon}
            title={item.label}
            description={item.description}
          />
        ))}
      </div>

      {/* Información adicional */}
      {/* <div className="mt-12 p-6 bg-info-50 rounded-lg border border-info-200">
        <h3 className="text-lg font-medium text-info-900 mb-2">
          ℹ️ Información sobre los Maestros
        </h3>
        <div className="text-sm text-info-800 space-y-2">
          <p>
            <strong>Pruebas:</strong> Define el catálogo de pruebas disponibles en el laboratorio.
          </p>
          <p>
            <strong>Centros:</strong> Gestiona los centros de salud y laboratorios del sistema.
          </p>
          <p>
            <strong>Tipos de Muestra:</strong> Configura los diferentes tipos de muestras que maneja
            el laboratorio.
          </p>
        </div>
      </div> */}
    </div>
  )
}
