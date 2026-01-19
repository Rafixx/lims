// src/features/plantillaTecnica/components/header/PlantillaTecnicaHeader.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/molecules/Button'
import { ArrowLeft, FileText, Download, Printer, Loader2 } from 'lucide-react'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { TecnicaProc } from '../../interfaces/plantillaTecnica.types'
import { downloadPlantillaTecnicaPDF } from '../PDF'

interface PlantillaTecnicaHeaderProps {
  worklistId: number
  codigoPlantilla?: string
  tecnicaProc?: string
  tecnicas: Tecnica[]
  plantillaTecnica: TecnicaProc | null
}

/**
 * Header de la página de Plantilla Técnica
 * Muestra título, acciones y navegación
 */
export const PlantillaTecnicaHeader = ({
  worklistId,
  codigoPlantilla,
  tecnicaProc,
  tecnicas,
  plantillaTecnica
}: PlantillaTecnicaHeaderProps) => {
  const navigate = useNavigate()
  const [isDownloading, setIsDownloading] = useState(false)

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
    window.print()
  }

  const handleDownload = async () => {
    if (!plantillaTecnica) return

    setIsDownloading(true)
    try {
      await downloadPlantillaTecnicaPDF({
        tecnicas,
        plantillaTecnica,
        fecha,
        hora
      })
    } catch (error) {
      console.error('Error al generar el PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-white border-b border-surface-200 shadow-sm print:hidden">
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
              disabled={isDownloading || !plantillaTecnica}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Descargar PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
