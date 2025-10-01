/**
 * Página de demostración del sistema de gestión de estados
 * Muestra todos los componentes y funcionalidades implementadas
 */

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IndicadorEstado, ListaEstados } from '../../shared/components/atoms/IndicadorEstado'
import { CambiarEstado, CambioRapidoEstado } from '../../shared/components/organisms/CambiarEstado'
import { useEstados, useEstadosDisponibles } from '../../shared/hooks/useEstados'
import type { EntidadTipo, DimEstado } from '../../shared/interfaces/estados.types'

// Cliente de React Query para la demo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2
    }
  }
})

interface EstadoDemoSectionProps {
  entidad: EntidadTipo
  title: string
}

const EstadoDemoSection: React.FC<EstadoDemoSectionProps> = ({ entidad, title }) => {
  const selectedItem = 1 // ID de ejemplo
  const [currentState, setCurrentState] = useState<DimEstado | null>(null)

  const { data: estados = [], isLoading: loadingEstados } = useEstados(entidad)
  const { data: estadosDisponibles = [] } = useEstadosDisponibles(entidad, currentState?.id)

  // Simular estado actual (primer estado disponible)
  React.useEffect(() => {
    if (estados.length > 0 && !currentState) {
      setCurrentState(estados[0])
    }
  }, [estados, currentState])

  if (loadingEstados) {
    return <div className="text-center p-4">Cargando estados de {title.toLowerCase()}...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>

      {/* Indicadores de estado */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Indicadores de Estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estados.map(estado => (
            <div key={estado.id} className="border border-gray-200 rounded-lg p-3">
              <IndicadorEstado estado={estado} size="medium" showDescription />
              <div className="mt-2 text-sm text-gray-600">
                <div>ID: {estado.id}</div>
                <div>Final: {estado.es_final ? 'Sí' : 'No'}</div>
                <div>Orden: {estado.orden}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista compacta de estados */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Lista Compacta</h3>
        <ListaEstados estados={estados} size="small" />
      </div>

      {/* Estado actual simulado */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Estado Actual (Simulado)</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-medium">
              {entidad} #{selectedItem}:
            </span>
            <IndicadorEstado estado={currentState} size="medium" showDescription />
          </div>

          {/* Selector de estado actual para testing */}
          <div className="flex gap-2 flex-wrap">
            {estados.map(estado => (
              <button
                key={estado.id}
                onClick={() => setCurrentState(estado)}
                className={`px-3 py-1 rounded text-sm border ${
                  currentState?.id === estado.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {estado.estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estados disponibles para transición */}
      {estadosDisponibles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Estados Disponibles para Transición</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {estadosDisponibles.map(estado => (
                <div key={estado.id} className="px-3 py-1 bg-blue-100 rounded-full text-sm">
                  {estado.estado} - {estado.descripcion}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Componente de cambio de estado - Inline */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Cambio de Estado - Modo Inline</h3>
        <CambiarEstado
          entidad={entidad}
          itemId={selectedItem}
          estadoActual={currentState}
          onEstadoCambiado={nuevoEstado => {
            setCurrentState(nuevoEstado)
            alert(`Estado cambiado a: ${nuevoEstado.estado}`)
          }}
          onError={error => {
            alert(`Error: ${error.message}`)
          }}
          variant="inline"
          size="medium"
        />
      </div>

      {/* Componente de cambio rápido */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Cambio Rápido de Estado</h3>
        <CambioRapidoEstado
          entidad={entidad}
          itemId={selectedItem}
          estadoActual={currentState}
          onEstadoCambiado={nuevoEstado => {
            setCurrentState(nuevoEstado)
            alert(`Estado cambiado rápidamente a: ${nuevoEstado.estado}`)
          }}
        />
      </div>
    </div>
  )
}

const EstadosDemo: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Gestión de Estados - Demo
            </h1>
            <p className="text-lg text-gray-600">
              Demostración completa de todos los componentes y funcionalidades del sistema de
              estados
            </p>
          </div>

          {/* Demo para Muestras */}
          <EstadoDemoSection entidad="MUESTRA" title="Gestión de Estados - Muestras" />

          {/* Demo para Técnicas */}
          <EstadoDemoSection entidad="TECNICA" title="Gestión de Estados - Técnicas" />

          {/* Información del sistema */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Información del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Componentes Implementados</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IndicadorEstado - Visualización de estados individuales</li>
                  <li>ListaEstados - Lista compacta de múltiples estados</li>
                  <li>CambiarEstado - Formulario completo para cambio de estado</li>
                  <li>CambioRapidoEstado - Selector rápido tipo dropdown</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Servicios y Hooks</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>EstadosService - API de gestión de estados</li>
                  <li>useEstados - Hook para obtener estados</li>
                  <li>useEstadosDisponibles - Hook para transiciones</li>
                  <li>useCambiarEstado - Hook para cambiar estados</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Funcionalidades Implementadas</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li>Validación de transiciones de estado</li>
                <li>Caching inteligente con React Query</li>
                <li>Manejo de errores y estados de carga</li>
                <li>Confirmación de cambios críticos</li>
                <li>Soporte para comentarios en cambios</li>
                <li>Interfaz responsive y accesible</li>
                <li>Integración completa con la API backend</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default EstadosDemo
