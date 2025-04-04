// src/features/listasTrabajo/pages/ListasTrabajo.page.tsx
import { useListasTrabajo } from '../hooks/useListasTrabajo'
import { ListaTrabajoCard } from '../components/ListasTrabajoCard'
import { useState } from 'react'
import { ListaTrabajo } from '../interfaces/listaTrabajo.interface'
import { ListaTrabajoDetail } from '../components/ListaTrabajoDetail'

export const ListasTrabajoPage: React.FC = () => {
  const { data: listasTrabajo, isLoading, isError } = useListasTrabajo()
  const [selectedListaTrabajo, setSelectedListaTrabajo] = useState<ListaTrabajo | null>(null)

  return (
    <div className="min-h-screen flex transition-all duration-300">
      {/* Contenido principal */}
      <div className="flex-1">
        <header className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Listas de Trabajo</h2>
        </header>
        <main className="container mx-auto p-4">
          {isLoading && <p>Cargando contenido...</p>}
          {isError && <p>Error al cargar las listas de trabajo</p>}
          {listasTrabajo &&
            listasTrabajo.map(listaTrabajo => (
              <ListaTrabajoCard
                key={listaTrabajo.id}
                listaTrabajo={listaTrabajo}
                onSelect={setSelectedListaTrabajo}
                isSelected={selectedListaTrabajo?.id === listaTrabajo.id}
              />
            ))}
        </main>
      </div>
      {selectedListaTrabajo && (
        <div
          className={`w-1/2 bg-gray-100 p-4 transition-all duration-500 ${
            selectedListaTrabajo ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <ListaTrabajoDetail listaTrabajo={selectedListaTrabajo} />
        </div>
      )}
    </div>
  )
}
