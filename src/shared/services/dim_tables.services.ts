import { apiClient } from './apiClient'

class DimTablesService {
  async getCentros() {
    const response = await apiClient.get('/centros')
    return response.data
  }

  async getCentro(id: number) {
    const response = await apiClient.get(`/centros/${id}`)
    return response.data
  }

  async getClientes() {
    const response = await apiClient.get('/clientes')
    return response.data
  }

  async getCliente(id: number) {
    const response = await apiClient.get(`/clientes/${id}`)
    return response.data
  }

  async getCriteriosValidacion() {
    const response = await apiClient.get('/criteriosValidacion')
    return response.data
  }

  async getCriterioValidacion(id: number) {
    const response = await apiClient.get(`/criteriosValidacion/${id}`)
    return response.data
  }

  async getPacientes() {
    const response = await apiClient.get('/pacientes')
    return response.data
  }

  async getPaciente(id: number) {
    const response = await apiClient.get(`/pacientes/${id}`)
    return response.data
  }

  async getPlantillasTecnicas() {
    const response = await apiClient.get('/plantillasTecnicas')
    return response.data
  }

  async getPlantillaTecnica(id: number) {
    const response = await apiClient.get(`/plantillasTecnicas/${id}`)
    return response.data
  }

  async getPruebas() {
    const response = await apiClient.get('/pruebas')
    return response.data
  }

  async getPrueba(id: number) {
    const response = await apiClient.get(`/pruebas/${id}`)
    return response.data
  }

  async getTecnicasProcByPrueba(id: number) {
    const response = await apiClient.get(`/pruebas/${id}/tecnicas`)
    return response.data
  }

  async getTecnicasProc() {
    const response = await apiClient.get('/tecnicasProc')
    return response.data
  }

  async getTecnicaProc(id: number) {
    const response = await apiClient.get(`/tecnicasProc/${id}`)
    return response.data
  }

  async getTecnicosLaboratorio() {
    const response = await apiClient.get('/tecnicosLab')
    return response.data
  }

  async getTecnicoLaboratorio(id: number) {
    const response = await apiClient.get(`/tecnicosLab/${id}`)
    return response.data
  }

  async getTiposMuestra() {
    const response = await apiClient.get('/tiposMuestra')
    return response.data
  }

  async getTipoMuestra(id: number) {
    const response = await apiClient.get(`/tiposMuestra/${id}`)
    return response.data
  }

  async getUbicaciones() {
    const response = await apiClient.get('/ubicaciones')
    return response.data
  }

  async getUbicacion(id: number) {
    const response = await apiClient.get(`/ubicaciones/${id}`)
    return response.data
  }

  async getMaquinas() {
    const response = await apiClient.get('/maquinas')
    return response.data
  }

  async getMaquina(id: number) {
    const response = await apiClient.get(`/maquinas/${id}`)
    return response.data
  }

  async getPipetas() {
    const response = await apiClient.get('/pipetas')
    return response.data
  }

  async getPipeta(id: number) {
    const response = await apiClient.get(`/pipetas/${id}`)
    return response.data
  }

  async getReactivos() {
    const response = await apiClient.get('/reactivos')
    return response.data
  }

  async getReactivo(id: number) {
    const response = await apiClient.get(`/reactivos/${id}`)
    return response.data
  }
}

export const dimTablesService = new DimTablesService()
export default dimTablesService
