// src/features/filtros/components/solicitudes.filtro.tsx
import React, { useEffect, useState } from 'react'
import { Filter } from '../../hooks/useFilteredSolicitudes'
import { EstadoSolicitud } from '../../../solicitud/interfaces/solicitud.interface'
import Dropdown, { DropdownOption } from '../../../../shared/components/atoms/Dropdown'

interface SolicitudesFiltroProps {
  activeFilters: Filter[]
  onAddFilter: (filter: Filter) => void
  onRemoveFilter: (filterId: string) => void
}

export const SolicitudesFiltro: React.FC<SolicitudesFiltroProps> = ({
  activeFilters,
  onAddFilter
}) => {
  const [estadoSelect, setEstadoSelect] = useState<string>('')
  const [solicitanteSelect, setSolicitanteSelect] = useState<string>('')

  // Convertimos el enum en opciones para el Dropdown
  const estadoOptions: DropdownOption[] = Object.values(EstadoSolicitud).map(opt => ({
    value: opt,
    label: opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')
  }))

  // Opciones para solicitante
  const solicitanteOptions: DropdownOption[] = [
    { value: 'Dr. Pérez', label: 'Dr. Pérez' },
    { value: 'Dr. Martínez', label: 'Dr. Martínez' },
    { value: 'Dr. González', label: 'Dr. González' }
  ]

  // Si se elimina el filtro activo para "estado", se reinicia el select
  useEffect(() => {
    const filtroEstadoActivo = activeFilters.find(
      filter => filter.category === 'solicitudes' && filter.field === 'estado'
    )
    if (!filtroEstadoActivo) {
      setEstadoSelect('')
    }
  }, [activeFilters])

  // Si se elimina el filtro activo para "solicitante", se reinicia el select
  useEffect(() => {
    const filtroSolicitanteActivo = activeFilters.find(
      filter => filter.category === 'solicitudes' && filter.field === 'solicitante'
    )
    if (!filtroSolicitanteActivo) {
      setSolicitanteSelect('')
    }
  }, [activeFilters])

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setEstadoSelect(value)
    if (value) {
      onAddFilter({
        id: `solicitudes-estado-${value}`,
        category: 'solicitudes',
        field: 'estado',
        value
      })
    }
  }

  const handleSolicitanteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSolicitanteSelect(value)
    if (value) {
      onAddFilter({
        id: `solicitudes-solicitante-${value}`,
        category: 'solicitudes',
        field: 'solicitante',
        value
      })
    }
  }

  return (
    <div className="bg-secondary/40 rounded-xl p-4 shadow-md my-3">
      <h2 className="text-lg font-bold mb-2">Filtrar Solicitudes</h2>
      <Dropdown
        id="estado-filter"
        label="Estado"
        options={estadoOptions}
        value={estadoSelect}
        onChange={handleEstadoChange}
      />
      <Dropdown
        id="solicitante-filter"
        label="Solicitante"
        options={solicitanteOptions}
        value={solicitanteSelect}
        onChange={handleSolicitanteChange}
      />
    </div>
  )
}

export default SolicitudesFiltro
