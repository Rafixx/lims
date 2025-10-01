/**
 * Servicio para la gestión de estados
 * Implementa las llamadas a la nueva API de estados del backend
 */

import { apiClient } from './apiClient'
import type {
  DimEstado,
  EstadoDisponible,
  CambioEstadoRequest,
  CambioEstadoResponse,
  EntidadTipo,
  EstadisticasEstado
} from '../interfaces/estados.types'

class EstadosService {
  private readonly basePath = '/estados'

  /**
   * Obtiene todos los estados activos para una entidad específica
   */
  async getEstadosPorEntidad(entidad: EntidadTipo): Promise<DimEstado[]> {
    try {
      const response = await apiClient.get<DimEstado[]>(`${this.basePath}/${entidad}`)

      // El backend devuelve directamente el array de estados
      return response.data || []
    } catch (error) {
      console.error(`Error cargando estados para ${entidad}:`, error)
      throw error
    }
  }

  /**
   * Obtiene los estados disponibles para transición desde el estado actual
   */
  async getEstadosDisponibles(
    entidad: EntidadTipo,
    estadoActual?: number
  ): Promise<EstadoDisponible[]> {
    try {
      const url = `${this.basePath}/${entidad}/disponibles${
        estadoActual ? `?estadoActual=${estadoActual}` : ''
      }`

      const response = await apiClient.get<EstadoDisponible[]>(url)

      // El backend devuelve directamente el array
      return response.data || []
    } catch (error) {
      console.error('Error cargando estados disponibles:', error)
      return []
    }
  }

  /**
   * Cambia el estado de una muestra
   */
  async cambiarEstadoMuestra(
    id: number,
    nuevoEstadoId: number,
    comentario?: string
  ): Promise<CambioEstadoResponse> {
    try {
      const payload: CambioEstadoRequest = {
        id_estado: nuevoEstadoId,
        comentario
      }

      const response = await apiClient.put<CambioEstadoResponse>(`/muestras/${id}/estado`, payload)

      // El backend devuelve directamente el objeto
      return response.data
    } catch (error) {
      console.error('Error cambiando estado de muestra:', error)
      throw error
    }
  }

  /**
   * Cambia el estado de una técnica
   */
  async cambiarEstadoTecnica(
    id: number,
    nuevoEstadoId: number,
    comentario?: string
  ): Promise<CambioEstadoResponse> {
    try {
      const payload: CambioEstadoRequest = {
        id_estado: nuevoEstadoId,
        comentario
      }

      const response = await apiClient.put<CambioEstadoResponse>(`/tecnicas/${id}/estado`, payload)

      // El backend devuelve directamente el objeto
      return response.data
    } catch (error) {
      console.error('Error cambiando estado de técnica:', error)
      throw error
    }
  }

  /**
   * Obtiene estadísticas de estados para una entidad
   */
  async getEstadisticasEstados(entidad: EntidadTipo): Promise<EstadisticasEstado> {
    try {
      const response = await apiClient.get<EstadisticasEstado>(
        `/estadisticas/${entidad.toLowerCase()}/estados`
      )

      // El backend devuelve directamente el objeto
      return response.data
    } catch (error) {
      console.error(`Error cargando estadísticas de ${entidad}:`, error)
      throw error
    }
  }

  /**
   * Valida si una transición de estado es permitida
   */
  async validarTransicion(
    entidad: EntidadTipo,
    estadoActual: number,
    estadoDestino: number
  ): Promise<boolean> {
    try {
      const estadosDisponibles = await this.getEstadosDisponibles(entidad, estadoActual)
      return estadosDisponibles.some(estado => estado.id === estadoDestino)
    } catch (error) {
      console.error('Error validando transición:', error)
      return false
    }
  }

  /**
   * Obtiene el estado inicial para una entidad
   */
  async getEstadoInicial(entidad: EntidadTipo): Promise<DimEstado | null> {
    try {
      const estados = await this.getEstadosPorEntidad(entidad)
      return estados.find(estado => estado.es_inicial) || null
    } catch (error) {
      console.error(`Error obteniendo estado inicial para ${entidad}:`, error)
      return null
    }
  }

  /**
   * Verifica si un estado es final
   */
  async esEstadoFinal(entidad: EntidadTipo, estadoId: number): Promise<boolean> {
    try {
      const estados = await this.getEstadosPorEntidad(entidad)
      const estado = estados.find(e => e.id === estadoId)
      return estado?.es_final || false
    } catch (error) {
      console.error('Error verificando si es estado final:', error)
      return false
    }
  }
}

// Instancia singleton del servicio
export const estadosService = new EstadosService()
export default estadosService
