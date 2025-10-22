import { apiClient } from '@/shared/services/apiClient'
import { Tecnica, Worklist, CreateWorklistRequest } from '../interfaces/worklist.types'
import { TecnicaProc } from '@/shared/interfaces/dim_tables.types'

class WorklistService {
  private readonly basePath = '/worklists'

  async getWorklists(): Promise<Worklist[]> {
    const response = await apiClient.get<Worklist[]>(this.basePath)
    return response.data
  }

  async getWorklist(id: number): Promise<Worklist> {
    const response = await apiClient.get<Worklist>(`${this.basePath}/${id}`)
    return response.data
  }

  async getTecnicasByWorklist(id: number): Promise<Worklist> {
    const response = await apiClient.get<Worklist>(`${this.basePath}/${id}/tecnicas`)
    return response.data
  }

  async getPosiblesTecnicasProc(): Promise<TecnicaProc[]> {
    const response = await apiClient.get<TecnicaProc[]>(`${this.basePath}/posiblesTecnicasProc`)
    return response.data
  }

  async getPosiblesTecnicas(tecnicaProc: string): Promise<Tecnica[]> {
    const response = await apiClient.get<Tecnica[]>(
      `${this.basePath}/posiblesTecnicas/${encodeURIComponent(tecnicaProc)}`
    )
    return response.data
  }

  async createWorklist(data: CreateWorklistRequest): Promise<Worklist> {
    const response = await apiClient.post<Worklist>(this.basePath, data)
    return response.data
  }

  async updateWorklist(id: number, data: Partial<Worklist>): Promise<Worklist> {
    const response = await apiClient.put<Worklist>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async setTecnicoLab(id: number, idTecnico: number): Promise<Worklist> {
    const response = await apiClient.put<Worklist>(`${this.basePath}/${id}/setTecnicoLab`, {
      id_tecnico: idTecnico
    })
    return response.data
  }

  async startTecnicasInWorkList(id: number): Promise<Worklist> {
    const response = await apiClient.put<Worklist>(`${this.basePath}/${id}/startTecnicas`)
    return response.data
  }

  async deleteWorklist(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }

  async importDataResults(id: number, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post(`${this.basePath}/${id}/importDataResults`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export const worklistService = new WorklistService()
