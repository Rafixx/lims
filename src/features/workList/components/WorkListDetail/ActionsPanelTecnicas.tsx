// src/features/workList/components/WorkListDetail/ActionsPanelTecnicas.tsx

import { useMemo } from 'react'
import { User, Filter, FilterX, AlertTriangle } from 'lucide-react'
import { Select } from '@/shared/components/molecules/Select'
import { Button } from '@/shared/components/molecules/Button'
import { Tecnica } from '../../interfaces/worklist.types'
import { TecnicoLaboratorio } from '@/shared/interfaces/dim_tables.types'

interface ActionsPanelTecnicasProps {
  tecnicas: Tecnica[]
  tecnicos: TecnicoLaboratorio[]
  selectedTecnicoId: string
  isAssigningTecnico: boolean
  canAssignTecnico: boolean
  filterSinResultado: boolean
  onTecnicoChange: (tecnicoId: string) => void
  onFilterToggle: () => void
  onMarcarResultadoErroneo: () => void
}

const tecnicaTieneResultado = (tecnica: Tecnica): boolean => {
  return Boolean(tecnica.resultados && tecnica.resultados.length > 0)
}

export const ActionsPanelTecnicas = ({
  tecnicas,
  tecnicos,
  selectedTecnicoId,
  isAssigningTecnico,
  canAssignTecnico,
  filterSinResultado,
  onTecnicoChange,
  onFilterToggle,
  onMarcarResultadoErroneo
}: ActionsPanelTecnicasProps) => {
  const hayAlgunaTecnicaConResultado = useMemo(
    () => tecnicas.some(tecnicaTieneResultado),
    [tecnicas]
  )

  const tecnicasSinResultadoCount = useMemo(
    () => tecnicas.filter(tecnica => !tecnicaTieneResultado(tecnica)).length,
    [tecnicas]
  )

  const handleMarcarErroneo = () => {
    onMarcarResultadoErroneo()
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filtro por técnicas sin resultado */}
        {hayAlgunaTecnicaConResultado && (
          <button
            onClick={onFilterToggle}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              filterSinResultado
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterSinResultado ? <FilterX className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {filterSinResultado
              ? `Mostrando sin resultado (${tecnicasSinResultadoCount})`
              : 'Filtrar sin resultado'}
          </button>
        )}

        {/* Selector de técnico */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 min-w-max">Cambiar técnico asignado:</span>
        </div>
        <div className="min-w-[200px]">
          <Select
            value={selectedTecnicoId}
            onChange={e => onTecnicoChange(e.target.value)}
            disabled={!canAssignTecnico || isAssigningTecnico || tecnicos.length === 0}
            title={
              !canAssignTecnico
                ? 'No puedes cambiar el técnico después de iniciar las técnicas'
                : undefined
            }
          >
            <option value="">
              {tecnicos.length === 0 ? 'No hay técnicos disponibles' : 'Seleccionar técnico'}
            </option>
            {tecnicos.map(tecnico => (
              <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                {tecnico.nombre}
              </option>
            ))}
          </Select>
        </div>
        {isAssigningTecnico && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        )}

        {/* Botón marcar como resultado erróneo */}
        {tecnicasSinResultadoCount > 0 && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarcarErroneo}
              title="Marcar como resultado erróneo"
              className="shrink-0 flex items-center gap-1.5 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-800"
            >
              <AlertTriangle className="h-4 w-4" />({tecnicasSinResultadoCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
