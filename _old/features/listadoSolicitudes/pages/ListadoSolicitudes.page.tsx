// src/features/listadoSolicitudes/pages/ListadoSolicitudes.page.tsx
import { useState } from 'react'
import { useSolicitudes } from '../../solicitud/hooks/useSolicitudes'
import { SolicitudCard } from '../../solicitud/components/SolicitudCard'
import { FilterDrawer } from '../components/FilterDrawer'
import { useFilteredSolicitudes, Filter } from '../hooks/useFilteredSolicitudes'
import Button, { ButtonVariants } from '../../../shared/components/atoms/Button'

export const ListadoSolicitudesPage: React.FC = () => {
  const { data: solicitudes, isLoading, isError } = useSolicitudes()
  const [filters, setFilters] = useState<Filter[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredSolicitudes = useFilteredSolicitudes(solicitudes, filters)

  // Actualiza los filtros activos (usando el mismo tipo de Filter de ../../types/filter.interface)
  const handleApplyFilters = (newFilters: Filter[]) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen flex transition-all duration-300">
      {/* Drawer */}
      <div className={`transition-all duration-600 overflow-hidden ${drawerOpen ? 'w-80' : 'w-0'}`}>
        <FilterDrawer onApplyFilters={handleApplyFilters} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        <header className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Listado de Solicitudes</h2>
          <Button variant={ButtonVariants.ACCENT} onClick={() => setDrawerOpen(!drawerOpen)}>
            Filtrar
            {/* <FiFilter size={20} /> */}
          </Button>
        </header>
        <main className="container mx-auto p-4">
          {isLoading && <p>Cargando solicitudes...</p>}
          {isError && <p>Error al cargar solicitudes</p>}
          {filteredSolicitudes &&
            filteredSolicitudes.map(solicitud => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
        </main>
      </div>
    </div>
  )
}
