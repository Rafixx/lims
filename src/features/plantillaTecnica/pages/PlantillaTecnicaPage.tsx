// src/features/plantillaTecnica/pages/PlantillaTecnicaPage.tsx

import { useParams } from 'react-router-dom'
import { PlantillaTecnicaHeader } from '../components/header/PlantillaTecnicaHeader'
import { TecnicasList } from '../components/TecnicasList'
import { PipetasList } from '../components/PipetasList'
import { ReactivosList } from '../components/ReactivosList'
import { PasosList } from '../components/PasosList'
import { useWorklist } from '@/features/workList/hooks/useWorklists'
import { usePlantillaTecnica } from '../hooks/usePlantillaTecnica'

/**
 * Página principal de Plantilla Técnica
 * Muestra la plantilla de trabajo para un worklist específico
 */
export const PlantillaTecnicaPage = () => {
  const { id } = useParams<{ id: string }>()
  const worklistId = parseInt(id || '0')

  // Cargar datos del worklist
  const { worklist, isLoading: isLoadingWorklist } = useWorklist(worklistId)

  // Cargar plantilla técnica
  // Nota: Necesitamos el id_tecnica_proc de la primera técnica del worklist
  const idTecnicaProc = worklist?.tecnicas?.[0]?.id_tecnica_proc || 0
  const { plantillaTecnica, isLoading: isLoadingPlantilla } = usePlantillaTecnica(idTecnicaProc)

  const isLoading = isLoadingWorklist || isLoadingPlantilla

  // Mostrar loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-surface-500">Cargando plantilla técnica...</div>
      </div>
    )
  }

  // Mostrar error state si no hay datos
  if (!worklist || !plantillaTecnica) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-surface-500">No se encontró información de la plantilla técnica</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <PlantillaTecnicaHeader
        worklistId={worklistId}
        codigoPlantilla={plantillaTecnica.plantillaTecnica.cod_plantilla_tecnica}
        tecnicaProc={plantillaTecnica.tecnica_proc}
      />

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Sección: Técnicas del Worklist */}
          <section>
            <TecnicasList tecnicas={worklist.tecnicas} />
          </section>

          {/* Grid de 2 columnas para Pipetas y Reactivos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sección: Pipetas */}
            <section>
              <PipetasList pipetas={plantillaTecnica.plantillaTecnica.dimPipetas} />
            </section>

            {/* Sección: Reactivos */}
            <section>
              <ReactivosList reactivos={plantillaTecnica.plantillaTecnica.dimReactivos} />
            </section>
          </div>

          {/* Sección: Pasos del Protocolo */}
          <section>
            <PasosList worklistId={worklistId} />
          </section>
        </div>
      </div>
    </div>
  )
}
