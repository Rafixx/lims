// src/features/plantillaTecnica/pages/PlantillaTecnicaPage.tsx

import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PlantillaTecnicaHeader } from '../components/header/PlantillaTecnicaHeader'
import { TecnicasList } from '../components/TecnicasList'
import { PipetasList } from '../components/PipetasList'
import { ReactivosList } from '../components/ReactivosList'
import { PasosList } from '../components/PasosList'
import { DynamicTemplateRenderer } from '../components/TemplateRenderer/DynamicTemplateRenderer'
import { useWorklist } from '@/features/workList/hooks/useWorklists'
import { usePlantillaTecnica } from '../hooks/usePlantillaTecnica'
import {
  useTemplate,
  useWorklistTemplateValues,
  useSaveWorklistTemplateValues
} from '../hooks/useTemplate'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { validateTemplate } from '../utils/templateValidator'
import { TemplateValues, TemplateNode, CalcNode } from '../interfaces/template.types'
import { evaluateExpression } from '../utils/expressionEvaluator'

/**
 * Página principal de Plantilla Técnica
 * Muestra la plantilla de trabajo para un worklist específico
 */
export const PlantillaTecnicaPage = () => {
  const { id } = useParams<{ id: string }>()
  const worklistId = parseInt(id || '0')
  const { notify } = useNotification()

  // Cargar datos del worklist
  const { worklist, isLoading: isLoadingWorklist } = useWorklist(worklistId)

  // Cargar plantilla técnica
  // Nota: Necesitamos el id_tecnica_proc de la primera técnica del worklist
  const idTecnicaProc = worklist?.tecnicas?.[0]?.id_tecnica_proc || 0
  const { plantillaTecnica, isLoading: isLoadingPlantilla } = usePlantillaTecnica(idTecnicaProc)

  // Cargar plantilla dinámica (json_data)
  const { data: template, isLoading: isLoadingTemplate } = useTemplate(idTecnicaProc)

  // Cargar valores guardados del worklist
  const { data: savedValues, isLoading: isLoadingValues } = useWorklistTemplateValues(worklistId)

  // Mutación para guardar valores
  const saveValuesMutation = useSaveWorklistTemplateValues()

  const isLoading = isLoadingWorklist || isLoadingPlantilla || isLoadingTemplate || isLoadingValues

  // Validar plantilla dinámica si existe
  const hasValidTemplate = template && validateTemplate(template)

  // Calcular valores para PDF (usando valores guardados)
  const calculatedValuesForPDF = useMemo(() => {
    if (!template || !savedValues) return {}

    const calculateAllCalcs = (nodes: TemplateNode[], values: TemplateValues): TemplateValues => {
      const calcNodes: CalcNode[] = []

      const extractCalcNodes = (nodeList: TemplateNode[]) => {
        nodeList.forEach(node => {
          if (node.type === 'calc') {
            calcNodes.push(node)
          } else if (node.type === 'group') {
            extractCalcNodes(node.children)
          }
        })
      }

      extractCalcNodes(nodes)

      const calculated: TemplateValues = {}
      const MAX_PASSES = 3
      let pass = 0
      let hasChanges = true

      while (pass < MAX_PASSES && hasChanges) {
        hasChanges = false
        pass++
        const allValues = { ...values, ...calculated }

        for (const calcNode of calcNodes) {
          if (calculated[calcNode.key] !== undefined) continue

          const result = evaluateExpression(calcNode.expr.value, allValues)
          if (result !== undefined) {
            calculated[calcNode.key] = result
            hasChanges = true
          }
        }
      }

      return calculated
    }

    return calculateAllCalcs(template.nodes, savedValues)
  }, [template, savedValues])

  // Mostrar loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-surface-500">Cargando plantilla técnica...</div>
      </div>
    )
  }

  // Mostrar error state si no hay datos
  if (!worklist || !plantillaTecnica || !plantillaTecnica.plantillaTecnica) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-surface-500">No se encontró información de la plantilla técnica</div>
      </div>
    )
  }

  // Handler para guardar valores de plantilla dinámica
  const handleSaveTemplateValues = async (
    values: Record<string, number | string | boolean | undefined>
  ) => {
    try {
      await saveValuesMutation.mutateAsync({
        worklistId,
        values
      })
      notify('Valores de plantilla guardados correctamente', 'success')
    } catch (error) {
      notify('Error al guardar valores de plantilla', 'error')
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <PlantillaTecnicaHeader
        worklistId={worklistId}
        codigoPlantilla={plantillaTecnica.plantillaTecnica.cod_plantilla_tecnica}
        tecnicaProc={plantillaTecnica.tecnica_proc}
        tecnicas={worklist.tecnicas}
        plantillaTecnica={plantillaTecnica}
        template={hasValidTemplate ? template : null}
        templateValues={savedValues}
        calculatedValues={calculatedValuesForPDF}
      />

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Sección: Plantilla Dinámica (si existe) */}
          {hasValidTemplate && (
            <section>
              <DynamicTemplateRenderer
                template={template}
                initialValues={savedValues}
                onSave={handleSaveTemplateValues}
                isSaving={saveValuesMutation.isPending}
              />
            </section>
          )}

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
            <PasosList pasos={plantillaTecnica.plantillaTecnica.dimPlantillaPasos || []} />
          </section>
        </div>
      </div>
    </div>
  )
}
