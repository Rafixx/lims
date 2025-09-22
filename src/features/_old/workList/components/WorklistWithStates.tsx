// src/features/workList/components/WorklistWithStates.tsx
// Componente que demuestra la integración con el sistema de estados centralizado

import React from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { TecnicaBadge } from '@/shared/states'

export const WorklistWithStates = () => {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">WorkList with States</h2>
        <p className="text-gray-600 mb-4">
          Componente en desarrollo - Funcionalidad de integración con estados centralizado.
        </p>
        <div className="flex gap-2">
          <TecnicaBadge estado="pendiente" />
          <TecnicaBadge estado="en_proceso" />
          <TecnicaBadge estado="completada" />
        </div>
      </Card>
    </div>
  )
}
