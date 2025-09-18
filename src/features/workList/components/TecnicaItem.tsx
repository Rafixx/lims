import React from 'react'
import { Button } from '@/shared/components/molecules/Button'
import { EstadoBadge } from '@/shared/components/atoms/EstadoBadge'
import { User, Calendar, Play, Check, UserCheck } from 'lucide-react'
import type { TecnicaWorklist } from '../interfaces/worklist.types'
import { useIniciarTecnica, useCompletarTecnica } from '../hooks/useWorklists'
import { APP_STATES } from '@/shared/states'

export interface TecnicoLab {
  id_usuario: number
  nombre: string
  especialidad?: string
  activo: boolean
}

// Componente para cada técnica individual
interface TecnicaItemProps {
  tecnica: TecnicaWorklist
  // tecnicos: TecnicoLab[]
  // selectedTecnicoId?: number
  // onTecnicoChange: (tecnicoId: number) => void
  // onAsignarTecnico: () => void
  // onIniciar: () => void
  // onCompletar: () => void
  isLoading: boolean
}

export const TecnicaItem: React.FC<TecnicaItemProps> = ({
  tecnica,
  // tecnicos,
  // selectedTecnicoId,
  // onTecnicoChange,
  // onAsignarTecnico,
  // onIniciar,
  // onCompletar,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }
  // const asignarTecnico = useAsignarTecnico()
  const iniciarTecnica = useIniciarTecnica()
  const completarTecnica = useCompletarTecnica()
  console.log('tecnica', tecnica)
  // const handleAsignarTecnico = async (idTecnica: number) => {
  //   const tecnicoId = selectedTecnicoId[idTecnica]
  //   if (!tecnicoId) return

  //   try {
  //     await asignarTecnico.mutateAsync({
  //       idTecnica,
  //       data: { id_tecnico: tecnicoId }
  //     })
  //   } catch (error) {
  //     console.error('Error assigning technician:', error)
  //   }
  // }

  const handleIniciarTecnica = async (idTecnica: number) => {
    try {
      await iniciarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error starting technique:', error)
    }
  }

  const handleCompletarTecnica = async (idTecnica: number) => {
    try {
      await completarTecnica.mutateAsync(idTecnica)
    } catch (error) {
      console.error('Error completing technique:', error)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-medium text-blue-900">MUESTRA:</h3>
            <h3 className="font-medium text-gray-900">
              Cod EPI: <strong>{tecnica.muestra.codigo_epi}</strong>
            </h3>
            <h3 className="font-medium text-gray-900">
              Cod EXT: <strong>{tecnica.muestra.codigo_externo}</strong>
            </h3>
            <span className="flex items-center ml-10">
              <EstadoBadge estado={tecnica.estado} />
            </span>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User size={14} />
              {tecnica.muestra.paciente.nombre}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(tecnica.fecha_estado)}
            </span>
            {/* {tecnica.tecnico_asignado && (
              <span className="flex items-center gap-1">
                <UserCheck size={14} />
                {tecnica.tecnico_asignado.nombre}
              </span>
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Asignación de técnico */}
          {/* {tecnica.estado === 'PENDIENTE_TECNICA' && !tecnica.tecnico_asignado && (
            <>
              <select
                value={selectedTecnicoId || ''}
                onChange={e => onTecnicoChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Seleccionar técnico</option>
                {(tecnicos || []).map(tecnico => (
                  <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                    {tecnico.nombre}
                  </option>
                ))}
              </select>
              <Button disabled={!selectedTecnicoId || isLoading} onClick={onAsignarTecnico}>
                <UserCheck size={16} />
              </Button>
            </>
          )} */}

          {/* Iniciar técnica */}
          {tecnica.estado === APP_STATES.TECNICA.PENDIENTE && (
            //&& tecnica.tecnico && (
            <Button
              disabled={isLoading}
              onClick={() => handleIniciarTecnica(tecnica.id)}
              className="flex items-center gap-1"
            >
              <Play size={16} />
              Iniciar
            </Button>
          )}

          {/* Completar técnica */}
          {tecnica.estado === APP_STATES.TECNICA.EN_PROGRESO && (
            <Button
              disabled={isLoading}
              onClick={() => handleCompletarTecnica(tecnica.id)}
              variant="accent"
              className="flex items-center gap-1"
            >
              <Check size={16} />
              Completar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
