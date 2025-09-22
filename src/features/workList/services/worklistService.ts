import { apiClient } from '@/shared/services/apiClient'
import { Worklist } from '../interfaces/worklist.types'

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

  async createWorklist(data: Partial<Worklist>): Promise<Worklist> {
    const response = await apiClient.post<Worklist>(this.basePath, data)
    return response.data
  }

  async updateWorklist(id: number, data: Partial<Worklist>): Promise<Worklist> {
    const response = await apiClient.put<Worklist>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async deleteWorklist(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }
}

export const worklistService = new WorklistService()
