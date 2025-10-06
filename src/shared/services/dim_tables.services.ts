import { apiClient } from './apiClient'
import type {
  Centro,
  Cliente,
  CriterioValidacion,
  Maquina,
  Paciente,
  Pipeta,
  Prueba,
  Reactivo,
  TipoMuestra,
  Ubicacion
} from '../interfaces/dim_tables.types'

class DimTablesService {
  async getCentros() {
    const response = await apiClient.get('/centros')
    return response.data
  }

  async getCentro(id: number) {
    const response = await apiClient.get(`/centros/${id}`)
    return response.data
  }

  async createCentro(centro: Omit<Centro, 'id'>) {
    const response = await apiClient.post('/centros', centro)
    return response.data
  }

  async updateCentro(id: number, centro: Partial<Omit<Centro, 'id'>>) {
    const response = await apiClient.put(`/centros/${id}`, centro)
    return response.data
  }

  async deleteCentro(id: number) {
    const response = await apiClient.delete(`/centros/${id}`)
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

  async createCliente(cliente: Omit<Cliente, 'id'>) {
    const response = await apiClient.post('/clientes', cliente)
    return response.data
  }

  async updateCliente(id: number, cliente: Partial<Omit<Cliente, 'id'>>) {
    const response = await apiClient.put(`/clientes/${id}`, cliente)
    return response.data
  }

  async deleteCliente(id: number) {
    const response = await apiClient.delete(`/clientes/${id}`)
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

  async createCriterioValidacion(criterio: Omit<CriterioValidacion, 'id'>) {
    const response = await apiClient.post('/criteriosValidacion', criterio)
    return response.data
  }

  async updateCriterioValidacion(id: number, criterio: Partial<Omit<CriterioValidacion, 'id'>>) {
    const response = await apiClient.put(`/criteriosValidacion/${id}`, criterio)
    return response.data
  }

  async deleteCriterioValidacion(id: number) {
    const response = await apiClient.delete(`/criteriosValidacion/${id}`)
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

  async createPaciente(paciente: Omit<Paciente, 'id'>) {
    const response = await apiClient.post('/pacientes', paciente)
    return response.data
  }

  async updatePaciente(id: number, paciente: Partial<Omit<Paciente, 'id'>>) {
    const response = await apiClient.put(`/pacientes/${id}`, paciente)
    return response.data
  }

  async deletePaciente(id: number) {
    const response = await apiClient.delete(`/pacientes/${id}`)
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

  async createPrueba(prueba: Omit<Prueba, 'id'>) {
    const response = await apiClient.post('/pruebas', prueba)
    return response.data
  }

  async updatePrueba(id: number, prueba: Partial<Omit<Prueba, 'id'>>) {
    const response = await apiClient.put(`/pruebas/${id}`, prueba)
    return response.data
  }

  async deletePrueba(id: number) {
    const response = await apiClient.delete(`/pruebas/${id}`)
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

  async createTipoMuestra(tipoMuestra: Omit<TipoMuestra, 'id'>) {
    const response = await apiClient.post('/tiposMuestra', tipoMuestra)
    return response.data
  }

  async updateTipoMuestra(id: number, tipoMuestra: Partial<Omit<TipoMuestra, 'id'>>) {
    const response = await apiClient.put(`/tiposMuestra/${id}`, tipoMuestra)
    return response.data
  }

  async deleteTipoMuestra(id: number) {
    const response = await apiClient.delete(`/tiposMuestra/${id}`)
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

  async createUbicacion(ubicacion: Omit<Ubicacion, 'id'>) {
    const response = await apiClient.post('/ubicaciones', ubicacion)
    return response.data
  }

  async updateUbicacion(id: number, ubicacion: Partial<Omit<Ubicacion, 'id'>>) {
    const response = await apiClient.put(`/ubicaciones/${id}`, ubicacion)
    return response.data
  }

  async deleteUbicacion(id: number) {
    const response = await apiClient.delete(`/ubicaciones/${id}`)
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

  async createMaquina(maquina: Omit<Maquina, 'id'>) {
    const response = await apiClient.post('/maquinas', maquina)
    return response.data
  }

  async updateMaquina(id: number, maquina: Partial<Omit<Maquina, 'id'>>) {
    const response = await apiClient.put(`/maquinas/${id}`, maquina)
    return response.data
  }

  async deleteMaquina(id: number) {
    const response = await apiClient.delete(`/maquinas/${id}`)
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

  async createPipeta(pipeta: Omit<Pipeta, 'id'>) {
    const response = await apiClient.post('/pipetas', pipeta)
    return response.data
  }

  async updatePipeta(id: number, pipeta: Partial<Omit<Pipeta, 'id'>>) {
    const response = await apiClient.put(`/pipetas/${id}`, pipeta)
    return response.data
  }

  async deletePipeta(id: number) {
    const response = await apiClient.delete(`/pipetas/${id}`)
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

  async createReactivo(reactivo: Omit<Reactivo, 'id'>) {
    const response = await apiClient.post('/reactivos', reactivo)
    return response.data
  }

  async updateReactivo(id: number, reactivo: Partial<Omit<Reactivo, 'id'>>) {
    const response = await apiClient.put(`/reactivos/${id}`, reactivo)
    return response.data
  }

  async deleteReactivo(id: number) {
    const response = await apiClient.delete(`/reactivos/${id}`)
    return response.data
  }
}

export const dimTablesService = new DimTablesService()
export default dimTablesService
