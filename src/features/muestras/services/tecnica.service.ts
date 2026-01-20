import { apiClient } from '@/shared/services/apiClient'

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
}

// Instancia singleton del servicio
export const tecnicaService = new TecnicaService()
export default tecnicaService
