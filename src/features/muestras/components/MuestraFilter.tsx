import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import {
  SelectFilter,
  ToggleFilter,
  SearchFilter
} from '@/shared/components/organisms/Filters/FilterComponents'
import { Calendar } from 'lucide-react'
import { useEstados } from '@/shared/hooks/useEstados'
import { useTiposMuestra, usePruebas } from '@/shared/hooks/useDim_tables'
import { useMemo } from 'react'

interface MuestraFilterProps {
  filters: {
    busqueda: string
    numeroEstudio: string
    id_tipo_muestra: number | null
    id_prueba: number | null
    id_estado: number | null
    soloHoy: boolean
  }
  onFilterChange: (key: string, value: string | boolean | number | null) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const MuestraFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: MuestraFilterProps) => {
  // Obtener datos desde el backend
  const { data: estados, isLoading: estadosLoading } = useEstados('MUESTRA')
  const { data: tiposMuestra, isLoading: tiposMuestraLoading } = useTiposMuestra()
  const { data: pruebas, isLoading: pruebasLoading } = usePruebas()

  // Generar opciones para el selector de estados
  const estadoOptions = useMemo(() => {
    if (!estados) return []
    return estados
      .filter(e => e.activo) // Solo mostrar estados activos
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) // Ordenar por el campo orden
      .map(estado => ({
        value: String(estado.id), // SelectFilter espera string
        label: estado.estado
      }))
  }, [estados])

  // Generar opciones para el selector de tipos de muestra
  const tipoMuestraOptions = useMemo(() => {
    if (!tiposMuestra) return []
    return tiposMuestra
      .sort((a, b) => (a.tipo_muestra || '').localeCompare(b.tipo_muestra || ''))
      .map(tipo => ({
        value: String(tipo.id),
        label: tipo.tipo_muestra || ''
      }))
  }, [tiposMuestra])

  // Generar opciones para el selector de pruebas
  const pruebaOptions = useMemo(() => {
    if (!pruebas) return []
    return pruebas
      .sort((a, b) => (a.prueba || '').localeCompare(b.prueba || ''))
      .map(prueba => ({
        value: String(prueba.id),
        label: prueba.prueba || ''
      }))
  }, [pruebas])

  return (
    <FilterContainer onClear={onClearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda}
        onChange={value => onFilterChange('busqueda', value)}
        placeholder="Buscar por código, cliente, paciente..."
        className="min-w-[200px]"
      />

      <SearchFilter
        label="Número de Estudio"
        value={filters.numeroEstudio}
        onChange={value => onFilterChange('numeroEstudio', value)}
        placeholder="Buscar por estudio..."
        className="min-w-[160px]"
      />

      <SelectFilter
        label="Tipo de Muestra"
        value={filters.id_tipo_muestra ? String(filters.id_tipo_muestra) : ''}
        onChange={value => onFilterChange('id_tipo_muestra', value ? Number(value) : null)}
        options={tipoMuestraOptions}
        disabled={tiposMuestraLoading}
      />

      <SelectFilter
        label="Tipo de Prueba"
        value={filters.id_prueba ? String(filters.id_prueba) : ''}
        onChange={value => onFilterChange('id_prueba', value ? Number(value) : null)}
        options={pruebaOptions}
        disabled={pruebasLoading}
      />

      <SelectFilter
        label="Estado"
        value={filters.id_estado ? String(filters.id_estado) : ''}
        onChange={value => onFilterChange('id_estado', value ? Number(value) : null)}
        options={estadoOptions}
        disabled={estadosLoading}
      />

      <ToggleFilter
        label="Solo Hoy"
        active={filters.soloHoy}
        onChange={active => onFilterChange('soloHoy', active)}
        icon={<Calendar className="w-4 h-4" />}
      />
    </FilterContainer>
  )
}
