import { apiClient } from '@/shared/services/apiClient'
import { Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'

/**
 * Servicio para la gestión de técnicas
 */
class TecnicaService {
  private readonly basePath = '/tecnicas'

  /**
   * Elimina/cancela una técnica
   * @param tecnicaId - ID de la técnica a eliminar
   * @returns Promise que se resuelve cuando la operación es exitosa
   */
  async deleteTecnica(tecnicaId: number): Promise<void> {
    await apiClient.post(`${this.basePath}/deleteTecnica`, { id_tecnica: tecnicaId })
  }

  /**
   * Obtiene técnicas agrupadas o normales según el tipo de muestra
   * @param muestraId - ID de la muestra
   * @returns Promise con técnicas completas (tipo normal) o agrupadas (tipo array)
   */
  async getTecnicasAgrupadasByMuestra(muestraId: number): Promise<Tecnica[] | TecnicaAgrupada[]> {
    const response = await apiClient.get<Tecnica[] | TecnicaAgrupada[]>(
      `${this.basePath}/muestra/${muestraId}/agrupadas`
    )
    return response.data
  }

  /**
   * Obtiene los IDs de todas las técnicas de un grupo (técnica agrupada)
   * @param primeraTecnicaId - ID de la primera técnica del grupo
   * @returns Promise con array de IDs de técnicas
   */
  async getTecnicaIdsFromGroup(primeraTecnicaId: number): Promise<number[]> {
    const response = await apiClient.get<{ tecnica_ids: number[] }>(
      `${this.basePath}/grupo/${primeraTecnicaId}/ids`
    )
    return response.data.tecnica_ids
  }

  /**
   * Obtiene las técnicas completas de un grupo (técnica agrupada)
   * @param primeraTecnicaId - ID de la primera técnica del grupo
   * @returns Promise con array de técnicas con su información completa
   */
  async getTecnicasFromGroup(primeraTecnicaId: number): Promise<Tecnica[]> {
    const response = await apiClient.get<Tecnica[]>(
      `${this.basePath}/grupo/${primeraTecnicaId}`
    )
    return response.data
  }

  /**
   * Obtiene técnicas pendientes de externalización
   * Requisitos:
   * - id_worklist = null
   * - estado no final
   * - Incluye información de muestra y array si aplica
   * @returns Promise con array de técnicas pendientes
   */
  async getTecnicasPendientesExternalizacion(): Promise<Tecnica[]> {
    const response = await apiClient.get<{ success: boolean; data: Tecnica[] }>(
      `${this.basePath}/pendientes-externalizacion`
    )
    return response.data.data
  }
}

// Instancia singleton del servicio
export const tecnicaService = new TecnicaService()
export default tecnicaService
