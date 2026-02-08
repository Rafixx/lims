// src/features/plantillaTecnica/services/templateService.ts

import { apiClient } from '@/shared/services/apiClient'
import { Template, TemplateValues } from '../interfaces/template.types'

/**
 * Servicio para gestionar plantillas dinámicas
 */
class TemplateService {
  /**
   * Obtiene la plantilla de una técnica proc
   * TODO BACKEND: Asegurar que el endpoint retorna json_data en la respuesta
   * @param idTecnicaProc ID de la técnica proc
   * @returns Plantilla parseada
   */
  async getTemplateByTecnicaProc(idTecnicaProc: number): Promise<Template | null> {
    try {
      const response = await apiClient.get<{ json_data?: string | object }>(
        `/tecnicasProc/${idTecnicaProc}`
      )

      if (!response.data.json_data) {
        return null
      }

      // Si viene como string, parsear
      const jsonData =
        typeof response.data.json_data === 'string'
          ? JSON.parse(response.data.json_data)
          : response.data.json_data

      return jsonData as Template
    } catch (error) {
      console.error('Error al obtener plantilla:', error)
      return null
    }
  }

  /**
   * Guarda los valores de inputs en un worklist
   * Los valores se almacenan en worklist.json_data.template_values
   * @param worklistId ID del worklist
   * @param values Valores de inputs a persistir
   */
  async saveWorklistTemplateValues(
    worklistId: number,
    values: TemplateValues
  ): Promise<void> {
    try {
      // El backend espera { template_values: {...} }
      // Se almacena en json_data.template_values preservando otros datos
      await apiClient.put(`/worklists/${worklistId}/template-values`, {
        template_values: values
      })
    } catch (error) {
      console.error('Error al guardar valores de plantilla:', error)
      throw error
    }
  }

  /**
   * Obtiene los valores guardados de inputs de un worklist
   * Los valores vienen de worklist.json_data.template_values
   * @param worklistId ID del worklist
   * @returns Valores guardados o vacío
   */
  async getWorklistTemplateValues(worklistId: number): Promise<TemplateValues> {
    try {
      const response = await apiClient.get<{
        json_data?: {
          template_values?: TemplateValues
          [key: string]: unknown
        }
      }>(`/worklists/${worklistId}`)

      // Verificar si existe json_data?.template_values
      return response.data.json_data?.template_values || {}
    } catch (error) {
      console.error('Error al obtener valores de plantilla:', error)
      return {}
    }
  }
}

export const templateService = new TemplateService()
export default templateService
