// src/features/filtros/components/muestras.filtro.tsx
import React, { useEffect, useState } from 'react'
import type { Filter } from '../../hooks/useFilteredSolicitudes'
import Dropdown, { DropdownOption } from '../../../../shared/components/atoms/Dropdown'
import RangeDatePicker from '../../../../shared/components/atoms/RangeDatePicker'

interface MuestrasFiltroProps {
  activeFilters: Filter[]
  onAddFilter: (filter: Filter) => void
  onRemoveFilter: (filterId: string) => void
}

export const MuestrasFiltro: React.FC<MuestrasFiltroProps> = ({ activeFilters, onAddFilter }) => {
  const estadoOptions: DropdownOption[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'finalizada', label: 'Finalizada' }
  ]
  const ubicacionOptions: DropdownOption[] = [
    { value: 'Laboratorio A', label: 'Laboratorio A' },
    { value: 'Laboratorio B', label: 'Laboratorio B' },
    { value: 'Máquina maq3', label: 'Máquina maq3' },
    { value: 'Externo', label: 'Externo' }
  ]

  // Estados locales para los selects
  const [estadoSelect, setEstadoSelect] = useState<string>('')
  const [ubicacionSelect, setUbicacionSelect] = useState<string>('')

  // Reiniciamos el select de estado si se elimina el filtro activo
  useEffect(() => {
    const filtroEstadoActivo = activeFilters.find(
      filter => filter.category === 'muestras' && filter.field === 'estado'
    )
    if (!filtroEstadoActivo) {
      setEstadoSelect('')
    }
  }, [activeFilters])

  // Reiniciamos el select de ubicación si se elimina el filtro activo
  useEffect(() => {
    const filtroUbicacionActivo = activeFilters.find(
      filter => filter.category === 'muestras' && filter.field === 'ubicacion'
    )
    if (!filtroUbicacionActivo) {
      setUbicacionSelect('')
    }
  }, [activeFilters])

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setEstadoSelect(value)
    if (value) {
      onAddFilter({
        id: `muestras-estado-${value}`,
        category: 'muestras',
        field: 'estado',
        value
      })
    }
  }

  const handleUbicacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setUbicacionSelect(value)
    if (value) {
      onAddFilter({
        id: `muestras-ubicacion-${value}`,
        category: 'muestras',
        field: 'ubicacion',
        value
      })
    }
  }

  const handleDateRangeChange = (start: string, end: string) => {
    // Si se selecciona un valor, se añaden los filtros correspondientes.
    if (start) {
      onAddFilter({
        id: `muestras-fechaDesde-${start}`,
        category: 'muestras',
        field: 'fechaIngreso',
        value: `>=${start}`
      })
    }
    if (end) {
      onAddFilter({
        id: `muestras-fechaHasta-${end}`,
        category: 'muestras',
        field: 'fechaIngreso',
        value: `<=${end}`
      })
    }
  }

  return (
    <div className="bg-secondary/40 rounded-xl p-4 shadow-md my-3">
      <h2 className="text-lg font-bold mb-2">Filtrar Muestras</h2>

      {/* Dropdown para Estado */}
      <Dropdown
        id="estado-muestras"
        label="Estado de Muestra"
        options={estadoOptions}
        value={estadoSelect}
        onChange={handleEstadoChange}
      />

      {/* Dropdown para Ubicación */}
      <Dropdown
        id="ubicacion-muestras"
        label="Ubicación"
        options={ubicacionOptions}
        value={ubicacionSelect}
        onChange={handleUbicacionChange}
      />

      {/* RangeDatePicker para Fecha de Ingreso */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1">Fecha de Ingreso</h3>
        <RangeDatePicker onChange={handleDateRangeChange} />
      </div>
    </div>
  )
}

export default MuestrasFiltro
