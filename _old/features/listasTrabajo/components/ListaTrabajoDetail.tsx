// src/features/listasTrabajo/components/ListaTrabajoDetail.tsx
import { ListaTrabajo } from '../interfaces/listaTrabajo.interface'

interface Props {
  listaTrabajo: ListaTrabajo
}

export const ListaTrabajoDetail = ({ listaTrabajo }: Props) => {
  return (
    <div className="min-h-screen flex transition-all duration-300">
      {/* Contenido principal */}
      <div className="flex-1">
        <header className="p-2 flex justify-between items-center border-b border-gray-300">
          <h2>{listaTrabajo.proceso.nombre}</h2>
        </header>
        <main className="container mx-auto p-4">
          {/* Aquí puedes agregar el contenido del detalle de la lista de trabajo */}
          {listaTrabajo.proceso.pipetas?.map(pipeta => (
            <div key={pipeta.codigo} className="mb-2">
              <h3 className="text-md font-semibold">Pipeta: {pipeta.zona}</h3>
              <p className="text-sm text-gray-500">Modelo: {pipeta.modelo}</p>
              <p className="text-sm text-gray-500">Codigo: {pipeta.codigo}</p>
            </div>
          ))}
          {listaTrabajo.proceso.reactivos?.map(reactivo => (
            <div key={reactivo.nombre} className="mb-2">
              <h3 className="text-md font-semibold">Reactivo: {reactivo.nombre}</h3>
              <p className="text-sm text-gray-500">Lote: {reactivo.lote}</p>
              <p className="text-sm text-gray-500">Volumen: {reactivo.volumen}</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
