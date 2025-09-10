// src/features/workList/components/MuestraDetailCard.tsx

import { useState } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { TecnicaConMuestra } from '../interfaces/worklist.types'
import { TecnicoLab } from '../hooks/useTecnicosLab'
import { User, FileText, Play, Check } from 'lucide-react'
import { APP_STATES } from '../../../shared/constants/appStates'

interface Props {
  tecnica: TecnicaConMuestra
  tecnicos: TecnicoLab[]
  onAsignarTecnico: (idTecnica: number, idTecnico: number) => void
  onIniciarTecnica: (idTecnica: number) => void
  onCompletarTecnica: (idTecnica: number) => void
}

export const MuestraDetailCard = ({
  tecnica,
  tecnicos,
  onAsignarTecnico,
  onIniciarTecnica,
  onCompletarTecnica
}: Props) => {
  const [selectedTecnico, setSelectedTecnico] = useState<string>(
    tecnica.id_tecnico_resp?.toString() || ''
  )

  // Funciones helper para valores seguros
  const getSafeValue = (value: string | undefined | null, defaultValue: string = 'N/A'): string => {
    return value || defaultValue
  }

  const handleAsignarTecnico = () => {
    if (selectedTecnico) {
      onAsignarTecnico(tecnica.id_tecnica, parseInt(selectedTecnico))
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case APP_STATES.SOLICITUD.PENDIENTE:
        return 'bg-yellow-100 text-yellow-800'
      case APP_STATES.SOLICITUD.EN_PROCESO:
        return 'bg-blue-100 text-blue-800'
      case APP_STATES.SOLICITUD.COMPLETADA:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const tecnicoActual = tecnicos.find(t => t.id_usuario === tecnica.id_tecnico_resp)

  return (
    <Card className="mb-4">
      <div className="p-4">
        {/* Header con información del paciente */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getSafeValue(tecnica.muestra?.nombre_paciente)}
              </h3>
              <p className="text-sm text-gray-500">
                Solicitud: {getSafeValue(tecnica.muestra?.codigo_solicitud)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
              tecnica.estado
            )}`}
          >
            {tecnica.estado.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Información de la muestra */}
        {/* <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <TestTube className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Tipo: {getSafeValue(tecnica.muestra?.tipo_muestra}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Extracción: {getSafeValue(tecnica.muestra?.fecha_extraccion, 'No especificada')}
            </span>
          </div>
        </div> */}

        {/* Comentarios si existen */}
        {tecnica.muestra?.comentarios && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Comentarios:</p>
                <p className="text-sm text-gray-600">{tecnica.muestra.comentarios}</p>
              </div>
            </div>
          </div>
        )}

        {/* Asignación de técnico */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Técnico Responsable
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTecnico}
              onChange={e => setSelectedTecnico(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-muted rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar técnico...</option>
              {tecnicos
                .filter(t => t.activo)
                .map(tecnico => (
                  <option key={tecnico.id_usuario} value={tecnico.id_usuario.toString()}>
                    {tecnico.nombre}
                  </option>
                ))}
            </select>
            {selectedTecnico && parseInt(selectedTecnico) !== tecnica.id_tecnico_resp && (
              <Button variant="primary" onClick={handleAsignarTecnico}>
                Asignar
              </Button>
            )}
          </div>
          {tecnicoActual && (
            <p className="text-xs text-gray-500 mt-1">
              Actualmente asignado a: {tecnicoActual.nombre}
            </p>
          )}
        </div> */}

        {/* Acciones */}
        <div className="flex space-x-2">
          {tecnica.estado === 'PENDIENTE' && tecnica.id_tecnico_resp && (
            <Button
              variant="primary"
              onClick={() => onIniciarTecnica(tecnica.id_tecnica)}
              className="flex items-center space-x-1"
            >
              <Play className="h-4 w-4" />
              <span>Iniciar</span>
            </Button>
          )}
          {tecnica.estado === 'EN_PROGRESO' && (
            <Button
              variant="accent"
              onClick={() => onCompletarTecnica(tecnica.id_tecnica)}
              className="flex items-center space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Completar</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
