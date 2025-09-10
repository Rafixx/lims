// src/features/solicitudes/components/SolicitudesFilters.tsx

import { useState } from 'react'
import { FiltrosSolicitudes } from '../interfaces/stats.types'
import { Button } from '@/shared/components/molecules/Button'
import { Card } from '@/shared/components/molecules/Card'
import { Filter, X, Calendar, User, TestTube, AlertTriangle } from 'lucide-react'
import { APP_STATES, ESTADOS_CONFIG } from '@/shared/states'

interface Props {
  filtros: FiltrosSolicitudes
  onFiltrosChange: (filtros: FiltrosSolicitudes) => void
  estadosDisponibles?: string[]
  clientesDisponibles?: Array<{ id: number; nombre: string }>
  pruebasDisponibles?: Array<{ id: number; prueba: string }>
  isLoading?: boolean
}

// const ESTADOS_DEFAULT = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA', 'VENCIDA']
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

  const toggleEstado = (estado: string) => {
    const nuevosEstados = filtros.estados.includes(estado)
      ? filtros.estados.filter(e => e !== estado)
      : [...filtros.estados, estado]

    onFiltrosChange({ ...filtros, estados: nuevosEstados })
  }

  const toggleCliente = (idCliente: number) => {
    const nuevosClientes = filtros.clientes.includes(idCliente)
      ? filtros.clientes.filter(id => id !== idCliente)
      : [...filtros.clientes, idCliente]

    onFiltrosChange({ ...filtros, clientes: nuevosClientes })
  }

  const togglePrueba = (idPrueba: number) => {
    const nuevasPruebas = filtros.pruebas.includes(idPrueba)
      ? filtros.pruebas.filter(id => id !== idPrueba)
      : [...filtros.pruebas, idPrueba]

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
    filtros.estados.length +
    filtros.clientes.length +
    filtros.pruebas.length +
    (filtros.fechaDesde ? 1 : 0) +
    (filtros.fechaHasta ? 1 : 0) +
    (filtros.soloVencidas ? 1 : 0) +
    (filtros.soloHoy ? 1 : 0)

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: ESTADOS_CONFIG[APP_STATES.SOLICITUD.PENDIENTE].color,
      EN_PROGRESO: ESTADOS_CONFIG[APP_STATES.SOLICITUD.EN_PROCESO].color,
      COMPLETADA: ESTADOS_CONFIG[APP_STATES.SOLICITUD.COMPLETADA].color,
      CANCELADA: ESTADOS_CONFIG[APP_STATES.SOLICITUD.CANCELADA].color
    }
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
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
                  <label className="block text-xs text-gray-600 mb-1">Desde</label>
                  <input
                    type="date"
                    value={filtros.fechaDesde || ''}
                    onChange={e => actualizarFecha('fechaDesde', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={filtros.fechaHasta || ''}
                    onChange={e => actualizarFecha('fechaHasta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    onClick={() => toggleEstado(estado)}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                      filtros.estados.includes(estado)
                        ? getEstadoColor(estado)
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {estado.replace('_', ' ')}
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
                    <label key={cliente.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.clientes.includes(cliente.id)}
                        onChange={() => toggleCliente(cliente.id)}
                        className="rounded text-blue-600"
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
                    <label key={prueba.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.pruebas.includes(prueba.id)}
                        onChange={() => togglePrueba(prueba.id)}
                        className="rounded text-blue-600"
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
