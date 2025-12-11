// src/features/workList/components/WorklistTecnicasGrid.tsx

import { Card } from '@/shared/components/molecules/Card'
import { Select } from '@/shared/components/molecules/Select'
import { User } from 'lucide-react'
import { TecnicaRow } from './WorklistTecnicaRow'
import { Tecnica } from '../../interfaces/worklist.types'
import { TecnicoLaboratorio } from '@/shared/interfaces/dim_tables.types'

interface WorklistTecnicasGridProps {
  tecnicaProc: string
  tecnicas: Tecnica[]
  tecnicos: TecnicoLaboratorio[]
  selectedTecnicoId: string
  isAssigningTecnico: boolean
  canAssignTecnico: boolean
  onTecnicoChange: (tecnicoId: string) => void
  onManualResult: (tecnica: Tecnica) => void
}

export const WorklistTecnicasGrid = ({
  tecnicaProc,
  tecnicas,
  tecnicos,
  selectedTecnicoId,
  isAssigningTecnico,
  canAssignTecnico,
  onTecnicoChange,
  onManualResult
}: WorklistTecnicasGridProps) => {
  return (
    <Card className="p-6">
      {/* Header con selector de técnico */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{tecnicaProc}</h2>
          </div>

          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      {/* Grid de técnicas */}
      <div className="space-y-2">
        {/* Header de columnas */}
        <div className="grid grid-cols-12 gap-4 px-3 py-2 bg-gray-100 rounded-lg font-semibold text-sm text-gray-700">
          <div className="col-span-2">Códigos</div>
          <div className="col-span-2">Técnico Lab</div>
          <div className="col-span-6">Resultados</div>
          <div className="col-span-2">Estado</div>
        </div>

        {/* Filas de técnicas */}
        {tecnicas.map((tecnica, index) => (
          <TecnicaRow
            key={tecnica.id_tecnica || index}
            tecnica={tecnica}
            onManualResult={onManualResult}
          />
        ))}
      </div>
    </Card>
  )
}
