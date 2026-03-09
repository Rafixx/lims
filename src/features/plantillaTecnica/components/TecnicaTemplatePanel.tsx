// src/features/plantillaTecnica/components/TecnicaTemplatePanel.tsx
//
// Panel de formulario de plantilla para una Técnica individual (scope TECNICA).
// Muestra la identidad de la muestra (código EPI / código externo) como cabecera
// y delega el renderizado del formulario a DynamicTemplateRenderer.

import { Card } from '@/shared/components/molecules/Card'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { Template, TemplateValues } from '../interfaces/template.types'
import { DynamicTemplateRenderer } from './TemplateRenderer/DynamicTemplateRenderer'

interface Props {
  tecnica: Tecnica
  template: Template
  isSaving: boolean
  onSave: (tecnicaId: number, values: TemplateValues) => Promise<void>
}

export const TecnicaTemplatePanel = ({ tecnica, template, isSaving, onSave }: Props) => {
  const codigoEpi = tecnica.muestraArray?.codigo_epi ?? tecnica.muestra?.codigo_epi ?? '—'
  const codigoExterno =
    tecnica.muestraArray?.codigo_externo ?? tecnica.muestra?.codigo_externo ?? '—'

  const handleSave = (values: TemplateValues) => onSave(tecnica.id_tecnica!, values)

  return (
    <Card className="p-4">
      {/* Cabecera: identidad de la muestra */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-surface-200">
        <span className="font-mono text-sm font-semibold text-primary-700">{codigoEpi}</span>
        {codigoExterno !== '—' && (
          <span className="font-mono text-xs text-surface-500">{codigoExterno}</span>
        )}
      </div>

      {/* Formulario de plantilla */}
      <DynamicTemplateRenderer
        template={template}
        initialValues={tecnica.datos_plantilla || {}}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Card>
  )
}
