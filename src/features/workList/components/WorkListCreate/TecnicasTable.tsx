// src/features/workList/components/WorkListCreate/TecnicasTable.tsx

import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import { Input } from '@/shared/components/molecules/Input'
import { Button } from '@/shared/components/molecules/Button'
import { Tecnica } from '../../interfaces/worklist.types'

type SortField = 'codigo_epi' | 'codigo_externo' | 'id_muestra' | 'id_tecnica'
type SortDirection = 'asc' | 'desc'

interface Props {
  tecnicas: Tecnica[]
  selectedTecnicas: Set<number>
  onToggle: (tecnicaId: number) => void
  onSelectAll: (tecnicaIds: number[]) => void
  onClearSelection: () => void
}

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const

export const TecnicasTable = ({
  tecnicas,
  selectedTecnicas,
  onToggle,
  onSelectAll,
  onClearSelection
}: Props) => {
  const [sortField, setSortField] = useState<SortField>('codigo_epi')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterMuestra, setFilterMuestra] = useState('')
  const [pageSize, setPageSize] = useState<number>(20)
  const [currentPage, setCurrentPage] = useState(1)

  // Filtrar técnicas
  const filteredTecnicas = useMemo(() => {
    if (!filterMuestra.trim()) return tecnicas

    const searchTerm = filterMuestra.toLowerCase().trim()
    return tecnicas.filter(tecnica => {
      const codigoEpi = tecnica.muestra?.codigo_epi?.toLowerCase() || ''
      const codigoExterno = tecnica.muestra?.codigo_externo?.toLowerCase() || ''
      const idMuestra = tecnica.id_muestra?.toString() || ''

      return (
        codigoEpi.includes(searchTerm) ||
        codigoExterno.includes(searchTerm) ||
        idMuestra.includes(searchTerm)
      )
    })
  }, [tecnicas, filterMuestra])

  // Ordenar técnicas
  const sortedTecnicas = useMemo(() => {
    return [...filteredTecnicas].sort((a, b) => {
      let valueA: string | number = ''
      let valueB: string | number = ''

      switch (sortField) {
        case 'codigo_epi':
          valueA = a.muestra?.codigo_epi || ''
          valueB = b.muestra?.codigo_epi || ''
          break
        case 'codigo_externo':
          valueA = a.muestra?.codigo_externo || ''
          valueB = b.muestra?.codigo_externo || ''
          break
        case 'id_muestra':
          valueA = a.id_muestra || 0
          valueB = b.id_muestra || 0
          break
        case 'id_tecnica':
          valueA = a.id_tecnica || 0
          valueB = b.id_tecnica || 0
          break
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
      }

      const strA = String(valueA).toLowerCase()
      const strB = String(valueB).toLowerCase()

      if (sortDirection === 'asc') {
        return strA.localeCompare(strB)
      }
      return strB.localeCompare(strA)
    })
  }, [filteredTecnicas, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(sortedTecnicas.length / pageSize)
  const paginatedTecnicas = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedTecnicas.slice(start, start + pageSize)
  }, [sortedTecnicas, currentPage, pageSize])

  // Reset página cuando cambia el filtro o pageSize
  const handleFilterChange = (value: string) => {
    setFilterMuestra(value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  // Manejo de ordenación
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Seleccionar todas las filtradas
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredTecnicas
      .map(t => t.id_tecnica)
      .filter((id): id is number => id !== undefined)

    const allFilteredSelected = filteredIds.every(id => selectedTecnicas.has(id))

    if (allFilteredSelected) {
      // Deseleccionar solo las filtradas
      filteredIds.forEach(id => {
        if (selectedTecnicas.has(id)) {
          onToggle(id)
        }
      })
    } else {
      // Seleccionar todas las filtradas
      onSelectAll(filteredIds)
    }
  }

  const allFilteredSelected = useMemo(() => {
    const filteredIds = filteredTecnicas
      .map(t => t.id_tecnica)
      .filter((id): id is number => id !== undefined)
    return filteredIds.length > 0 && filteredIds.every(id => selectedTecnicas.has(id))
  }, [filteredTecnicas, selectedTecnicas])

  const someFilteredSelected = useMemo(() => {
    const filteredIds = filteredTecnicas
      .map(t => t.id_tecnica)
      .filter((id): id is number => id !== undefined)
    return filteredIds.some(id => selectedTecnicas.has(id)) && !allFilteredSelected
  }, [filteredTecnicas, selectedTecnicas, allFilteredSelected])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    )
  }

  const selectedCount = selectedTecnicas.size
  const filteredSelectedCount = filteredTecnicas.filter(
    t => t.id_tecnica && selectedTecnicas.has(t.id_tecnica)
  ).length

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filtro */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por muestra..."
            value={filterMuestra}
            onChange={e => handleFilterChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Acciones de selección */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectAllFiltered}
          >
            {allFilteredSelected ? 'Deseleccionar' : 'Seleccionar'}{' '}
            {filterMuestra ? 'filtradas' : 'todas'}
            {filterMuestra && ` (${filteredTecnicas.length})`}
          </Button>
          {selectedCount > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={onClearSelection}>
              Limpiar selección
            </Button>
          )}
        </div>
      </div>

      {/* Info de selección */}
      <div className="text-sm text-gray-600">
        {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''} de {tecnicas.length} técnicas
        {filterMuestra && ` (${filteredSelectedCount} de ${filteredTecnicas.length} filtradas)`}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someFilteredSelected
                    }
                  }}
                  onChange={handleSelectAllFiltered}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id_muestra')}
              >
                <div className="flex items-center gap-1">
                  Muestra
                  <SortIcon field="id_muestra" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('codigo_externo')}
              >
                <div className="flex items-center gap-1">
                  Código Externo
                  <SortIcon field="codigo_externo" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('codigo_epi')}
              >
                <div className="flex items-center gap-1">
                  Código Epidisease
                  <SortIcon field="codigo_epi" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id_tecnica')}
              >
                <div className="flex items-center gap-1">
                  Nº Estudio
                  <SortIcon field="id_tecnica" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTecnicas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {filterMuestra
                    ? 'No se encontraron técnicas con el filtro aplicado'
                    : 'No hay técnicas disponibles'}
                </td>
              </tr>
            ) : (
              paginatedTecnicas.map(tecnica => {
                const isSelected = tecnica.id_tecnica
                  ? selectedTecnicas.has(tecnica.id_tecnica)
                  : false

                return (
                  <tr
                    key={tecnica.id_tecnica}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary-50 hover:bg-primary-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => tecnica.id_tecnica && onToggle(tecnica.id_tecnica)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => tecnica.id_tecnica && onToggle(tecnica.id_tecnica)}
                        onClick={e => e.stopPropagation()}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tecnica.id_muestra || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tecnica.muestra?.codigo_externo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {tecnica.muestra?.codigo_epi || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tecnica.id_tecnica || '-'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {sortedTecnicas.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Selector de tamaño de página */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>por página</span>
          </div>

          {/* Navegación de páginas */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                {'<<'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                {'<'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
