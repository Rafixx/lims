import { apiClient } from '@/shared/services/apiClient'
import { CancelarGrupoResult, Tecnica, TecnicaAgrupada } from '../interfaces/muestras.types'

/**
 * Servicio para la gestión de técnicas
 */
class TecnicaService {
  private readonly basePath = '/tecnicas'

  /**
   * Elimina/cancela una técnica individual
   */
  async deleteTecnica(tecnicaId: number): Promise<void> {
    await apiClient.post(`${this.basePath}/deleteTecnica`, { id_tecnica: tecnicaId })
  }

  /**
   * Cancela atómicamente todas las técnicas de un grupo en una sola transacción.
   * Sustituye el patrón getTecnicaIdsFromGroup + N×deleteTecnica.
   * @param primeraTecnicaId - ID de cualquier técnica del grupo (identifica el grupo)
   */
  async cancelarGrupo(primeraTecnicaId: number): Promise<CancelarGrupoResult> {
    const response = await apiClient.post<CancelarGrupoResult>(
      `${this.basePath}/grupo/${primeraTecnicaId}/cancelar`
    )
    return response.data
  }

  /**
   * Obtiene técnicas agrupadas o normales según el tipo de muestra
   */
  async getTecnicasAgrupadasByMuestra(muestraId: number): Promise<Tecnica[] | TecnicaAgrupada[]> {
    const response = await apiClient.get<Tecnica[] | TecnicaAgrupada[]>(
      `${this.basePath}/muestra/${muestraId}/agrupadas`
    )
    return response.data
  }

  /**
   * Obtiene las técnicas completas de un grupo (para mostrar el detalle expandido)
   */
  async getTecnicasFromGroup(primeraTecnicaId: number): Promise<Tecnica[]> {
    const response = await apiClient.get<Tecnica[]>(`${this.basePath}/grupo/${primeraTecnicaId}`)
    return response.data
  }

  /**
   * Obtiene técnicas pendientes de externalización
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
