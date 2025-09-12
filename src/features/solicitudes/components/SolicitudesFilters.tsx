import { useState } from 'react'
import type { SolicitudesFiltros } from '../interfaces/solicitudes.types'
import { Button } from '@/shared/components/molecules/Button'
import { Card } from '@/shared/components/molecules/Card'
import { Filter, X, Calendar, User, TestTube, AlertTriangle } from 'lucide-react'
import { APP_STATES, AppEstado, ESTADOS_CONFIG } from '@/shared/states'

interface Props {
  filtros: SolicitudesFiltros
  onFiltrosChange: (filtros: SolicitudesFiltros) => void
  estadosDisponibles?: AppEstado[]
  clientesDisponibles?: Array<{ id: number; nombre: string }>
  pruebasDisponibles?: Array<{ id: number; prueba: string }>
  isLoading?: boolean
}

const ESTADOS_DEFAULT = [
  APP_STATES.SOLICITUD.PENDIENTE,
  APP_STATES.SOLICITUD.EN_PROCESO,
  APP_STATES.SOLICITUD.COMPLETADA,
  APP_STATES.SOLICITUD.CANCELADA
]

export const SolicitudesFilters = ({
  filtros,
  onFiltrosChange,
  estadosDisponibles = ESTADOS_DEFAULT,
  clientesDisponibles = [],
  pruebasDisponibles = [],
  isLoading = false
}: Props) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // ✅ Función mejorada con validación
  const toggleEstado = (estado: AppEstado) => {
    if (!estado || typeof estado !== 'string') return

    const estadosActuales = filtros.estados || []
    const nuevosEstados = estadosActuales.includes(estado)
      ? estadosActuales.filter(e => e !== estado)
      : [...estadosActuales, estado]

    onFiltrosChange({ ...filtros, estados: nuevosEstados })
  }

  // ✅ Función mejorada con validación
  const toggleCliente = (idCliente: number) => {
    if (!idCliente || typeof idCliente !== 'number') return

    const clientesActuales = filtros.clientes || []
    const nuevosClientes = clientesActuales.includes(idCliente)
      ? clientesActuales.filter(id => id !== idCliente)
      : [...clientesActuales, idCliente]

    onFiltrosChange({ ...filtros, clientes: nuevosClientes })
  }

  // ✅ Función mejorada con validación
  const togglePrueba = (idPrueba: number) => {
    if (!idPrueba || typeof idPrueba !== 'number') return

    const pruebasActuales = filtros.pruebas || []
    const nuevasPruebas = pruebasActuales.includes(idPrueba)
      ? pruebasActuales.filter(id => id !== idPrueba)
      : [...pruebasActuales, idPrueba]

    onFiltrosChange({ ...filtros, pruebas: nuevasPruebas })
  }

  const limpiarFiltros = () => {
    onFiltrosChange({
      estados: [],
      clientes: [],
      pruebas: [],
      fechaDesde: undefined,
      fechaHasta: undefined,
      soloVencidas: false,
      soloHoy: false
    })
  }

  const toggleFiltroRapido = (campo: 'soloVencidas' | 'soloHoy') => {
    onFiltrosChange({
      ...filtros,
      [campo]: !filtros[campo]
    })
  }

  const actualizarFecha = (campo: 'fechaDesde' | 'fechaHasta', valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor || undefined
    })
  }

  const cantidadFiltrosActivos =
    (filtros.estados?.length || 0) +
    (filtros.clientes?.length || 0) +
    (filtros.pruebas?.length || 0) +
    (filtros.fechaDesde ? 1 : 0) +
    (filtros.fechaHasta ? 1 : 0) +
    (filtros.soloVencidas ? 1 : 0) +
    (filtros.soloHoy ? 1 : 0)

  // ✅ Función mejorada con mapeo correcto de estados
  const getEstadoColor = (estado: string): string => {
    // Verificar si el estado existe en ESTADOS_CONFIG
    if (ESTADOS_CONFIG[estado]) {
      return ESTADOS_CONFIG[estado].color
    }

    // Fallback para compatibilidad
    const colorMap: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      EN_PROCESO: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETADA: 'bg-green-100 text-green-800 border-green-200',
      CANCELADA: 'bg-red-100 text-red-800 border-red-200',
      VENCIDA: 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return colorMap[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // ✅ Función para formatear etiquetas de estado
  const formatEstadoLabel = (estado: string): string => {
    return estado
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Controles principales */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {cantidadFiltrosActivos > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-1">
              {cantidadFiltrosActivos}
            </span>
          )}
        </Button>

        {/* Filtros rápidos */}
        <Button
          type="button"
          onClick={() => toggleFiltroRapido('soloVencidas')}
          className={`flex items-center gap-2 ${
            filtros.soloVencidas
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Solo Vencidas
        </Button>

        <Button
          type="button"
          onClick={() => toggleFiltroRapido('soloHoy')}
          className={`flex items-center gap-2 ${
            filtros.soloHoy
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Solo Hoy
        </Button>

        {cantidadFiltrosActivos > 0 && (
          <Button
            type="button"
            onClick={limpiarFiltros}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      {/* Panel de filtros expandido */}
      {mostrarFiltros && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Filtros de fecha */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rango de Fechas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha-desde" className="block text-xs text-gray-600 mb-1">
                    Desde
                  </label>
                  <input
                    id="fecha-desde"
                    type="date"
                    value={filtros.fechaDesde || ''}
                    onChange={e => actualizarFecha('fechaDesde', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="fecha-hasta" className="block text-xs text-gray-600 mb-1">
                    Hasta
                  </label>
                  <input
                    id="fecha-hasta"
                    type="date"
                    value={filtros.fechaHasta || ''}
                    onChange={e => actualizarFecha('fechaHasta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por estado */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Estados</h4>
              <div className="flex flex-wrap gap-2">
                {estadosDisponibles.map(estado => (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => toggleEstado(estado)}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      filtros.estados?.includes(estado)
                        ? getEstadoColor(estado)
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={filtros.estados?.includes(estado) || false}
                  >
                    {formatEstadoLabel(estado)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por cliente */}
            {clientesDisponibles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Clientes
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {clientesDisponibles.map(cliente => (
                    <label
                      key={cliente.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filtros.clientes?.includes(cliente.id) || false}
                        onChange={() => toggleCliente(cliente.id)}
                        className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cliente.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Filtro por prueba */}
            {pruebasDisponibles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Pruebas
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {pruebasDisponibles.map(prueba => (
                    <label
                      key={prueba.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filtros.pruebas?.includes(prueba.id) || false}
                        onChange={() => togglePrueba(prueba.id)}
                        className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{prueba.prueba}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
