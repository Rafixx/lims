// src/features/plantillaTecnica/services/plantillaTecnicaService.ts

import { apiClient } from '@/shared/services/apiClient'
import { TecnicaProc } from '../interfaces/plantillaTecnica.types'

class PlantillaTecnicaService {
  /**
   * Obtener información de la plantilla técnica por ID de técnica proc
   * @param idTecnicaProc ID de la técnica proc
   * @returns Información completa de la plantilla técnica
   */
  async getPlantillaTecnica(idTecnicaProc: number): Promise<TecnicaProc> {
    const response = await apiClient.get<TecnicaProc>(`/tecnicasProc/${idTecnicaProc}`)
    return response.data
  }
}

export const plantillaTecnicaService = new PlantillaTecnicaService()
