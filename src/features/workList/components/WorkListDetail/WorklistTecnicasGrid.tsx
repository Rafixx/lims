// src/features/workList/components/WorklistTecnicasGrid.tsx

import { useState, useMemo } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { User } from 'lucide-react'
import { TecnicaRow } from './WorklistTecnicaRow'
import { ActionsPanelTecnicas } from './ActionsPanelTecnicas'
import { Tecnica } from '../../interfaces/worklist.types'
import { TecnicoLaboratorio } from '@/shared/interfaces/dim_tables.types'

interface WorklistTecnicasGridProps {
  tecnicaProc: string
  idTecnicoResp?: number
  tecnicoResp?: {
    id_usuario: number
    nombre: string
  }
  tecnicas: Tecnica[]
  tecnicos: TecnicoLaboratorio[]
  selectedTecnicoId: string
  isAssigningTecnico: boolean
  canAssignTecnico: boolean
  onTecnicoChange: (tecnicoId: string) => void
  onManualResult: (tecnica: Tecnica) => void
  onMarcarResultadoErroneo: (idsTecnicas: number[]) => void
}

const tecnicaTieneResultado = (tecnica: Tecnica): boolean => {
  return Boolean(tecnica.resultados && tecnica.resultados.length > 0)
}

export const WorklistTecnicasGrid = ({
  tecnicaProc,
  idTecnicoResp,
  tecnicoResp,
  tecnicas,
  tecnicos,
  selectedTecnicoId,
  isAssigningTecnico,
  canAssignTecnico,
  onTecnicoChange,
  onManualResult,
  onMarcarResultadoErroneo
}: WorklistTecnicasGridProps) => {
  const [filterSinResultado, setFilterSinResultado] = useState(false)

  // Buscar el técnico responsable en la lista de técnicos disponibles
  const tecnicoResponsable =
    tecnicoResp || (idTecnicoResp ? tecnicos.find(t => t.id_usuario === idTecnicoResp) : undefined)

  const tecnicasFiltradas = useMemo(() => {
    const filtradas = filterSinResultado
      ? tecnicas.filter(tecnica => !tecnicaTieneResultado(tecnica))
      : tecnicas

    // Ordenar por código de muestra y luego por posición de placa
    return [...filtradas].sort((a, b) => {
      // Primero ordenar por código externo (usar muestraArray si existe, sino muestra)
      const codigoA = (a.muestraArray?.codigo_externo || a.muestra?.codigo_externo || '')
      const codigoB = (b.muestraArray?.codigo_externo || b.muestra?.codigo_externo || '')
      const codigoComparison = codigoA.localeCompare(codigoB)

      if (codigoComparison !== 0) return codigoComparison

      // Si los códigos son iguales, ordenar por posición de placa
      const posicionA = a.muestraArray?.posicion_placa || ''
      const posicionB = b.muestraArray?.posicion_placa || ''
      return posicionA.localeCompare(posicionB)
    })
  }, [tecnicas, filterSinResultado])

  const handleMarcarErroneas = () => {
    const tecnicasSinResultado = tecnicasFiltradas.filter(
      tecnica => !tecnicaTieneResultado(tecnica)
    )
    const idsTecnicas = tecnicasSinResultado
      .filter(t => t.id_tecnica)
      .map(t => t.id_tecnica as number)

    if (idsTecnicas.length > 0) {
      onMarcarResultadoErroneo(idsTecnicas)
    }
  }

  return (
    <Card className="p-6">
      {/* Header con título y técnico responsable */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{tecnicaProc}</h2>
        {tecnicoResponsable && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Técnico asignado:</span>
            <span className="text-gray-700">{tecnicoResponsable.nombre}</span>
          </div>
        )}
      </div>

      {/* Panel de acciones */}
      <ActionsPanelTecnicas
        tecnicas={tecnicas}
        tecnicos={tecnicos}
        selectedTecnicoId={selectedTecnicoId}
        isAssigningTecnico={isAssigningTecnico}
        canAssignTecnico={canAssignTecnico}
        filterSinResultado={filterSinResultado}
        onTecnicoChange={onTecnicoChange}
        onFilterToggle={() => setFilterSinResultado(!filterSinResultado)}
        onMarcarResultadoErroneo={handleMarcarErroneas}
      />

      {/* Grid de técnicas */}
      <div className="space-y-2">
        {/* Header de columnas */}
        <div className="grid grid-cols-12 gap-4 px-3 py-2 bg-gray-100 rounded-lg font-semibold text-sm text-gray-700">
          <div className="col-span-2">Códigos</div>
          <div className="col-span-1 text-center">Pocillo</div>
          <div className="col-span-7">Resultados</div>
          <div className="col-span-2">Estado</div>
        </div>

        {/* Filas de técnicas */}
        {tecnicasFiltradas.map((tecnica, index) => (
          <TecnicaRow
            key={tecnica.id_tecnica || index}
            tecnica={tecnica}
            onManualResult={onManualResult}
            onMarcarResultadoErroneo={onMarcarResultadoErroneo}
          />
        ))}
      </div>
    </Card>
  )
}
