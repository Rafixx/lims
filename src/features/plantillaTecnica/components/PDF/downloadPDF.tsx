// src/features/plantillaTecnica/components/PDF/downloadPDF.tsx

import { pdf } from '@react-pdf/renderer'
import { PlantillaTecnicaPDF } from './PlantillaTecnicaPDF'
import { Tecnica } from '@/features/workList/interfaces/worklist.types'
import { TecnicaProc } from '../../interfaces/plantillaTecnica.types'

interface DownloadPDFParams {
  tecnicas: Tecnica[]
  plantillaTecnica: TecnicaProc
  fecha: string
  hora: string
  filename?: string
}

/**
 * Genera y descarga el PDF de la plantilla técnica
 */
export const downloadPlantillaTecnicaPDF = async ({
  tecnicas,
  plantillaTecnica,
  fecha,
  hora,
  filename
}: DownloadPDFParams): Promise<void> => {
  // Generar el blob del PDF
  const blob = await pdf(
    <PlantillaTecnicaPDF
      tecnicas={tecnicas}
      plantillaTecnica={plantillaTecnica}
      fecha={fecha}
      hora={hora}
    />
  ).toBlob()

  // Crear nombre del archivo
  const tecnicaProc = plantillaTecnica.tecnica_proc || 'plantilla'
  const fechaFormateada = fecha.replace(/\//g, '-')
  const defaultFilename = `${tecnicaProc}_${fechaFormateada}.pdf`

  // Crear enlace de descarga
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || defaultFilename
  document.body.appendChild(link)
  link.click()

  // Limpiar
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
