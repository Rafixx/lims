// src/features/plantillaTecnica/components/header/PlantillaTecnicaHeader.tsx

import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, FileText, Download, Printer } from 'lucide-react'

interface PlantillaTecnicaHeaderProps {
  worklistId: number
  codigoPlantilla?: string
  tecnicaProc?: string
}

/**
 * Header de la página de Plantilla Técnica
 * Muestra título, acciones y navegación
 */
export const PlantillaTecnicaHeader = ({
  worklistId,
  codigoPlantilla,
  tecnicaProc
}: PlantillaTecnicaHeaderProps) => {
  const navigate = useNavigate()

  // Obtener fecha y hora actual en formato DD/MM/YYYY y HH:MM
  const now = new Date()
  const fecha = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const hora = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleBack = () => {
    navigate(`/worklist/${worklistId}`)
  }

  const handlePrint = () => {
    // TODO: Implementar lógica de impresión
    window.print()
  }

  const handleDownload = () => {
    // TODO: Implementar lógica de descarga PDF
    console.log('Descargar PDF')
  }

  return (
    <div className="bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Sección izquierda: Navegación y título */}
          <div className="flex items-center gap-4">
            <Button variant="accent" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Volver
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-surface-900">{tecnicaProc}</h1>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-surface-600">
                {codigoPlantilla && (
                  <div>
                    <span className="font-semibold">Código plantilla:</span>{' '}
                    <span className="text-surface-900">{codigoPlantilla}</span>
                  </div>
                )}
                {/* {tecnicaProc && (
                  <div>
                    <span className="font-semibold">Técnica:</span>{' '}
                    <span className="text-surface-900">{tecnicaProc}</span>
                  </div>
                )} */}
                <div>
                  <span className="font-semibold">Fecha:</span>{' '}
                  <span className="text-surface-900">{fecha}</span>
                </div>
                <div>
                  <span className="font-semibold">Hora:</span>{' '}
                  <span className="text-surface-900">{hora}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha: Acciones */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2"
              title="Imprimir plantilla"
            >
              <Printer size={16} />
              Imprimir
            </Button>

            <Button
              variant="primary"
              onClick={handleDownload}
              className="flex items-center gap-2"
              title="Descargar como PDF"
            >
              <Download size={16} />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
