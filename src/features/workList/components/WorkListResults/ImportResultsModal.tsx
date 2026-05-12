import { useState } from 'react'
import { X, Upload, FileSpreadsheet } from 'lucide-react'
import { FileUploader } from '@/shared/components/molecules/FileUploader'
import { Button } from '@/shared/components/molecules/Button'

// ---------------------------------------------------------------------------
// Plantillas CSV para equipos de medición
// ---------------------------------------------------------------------------
const RESULT_TEMPLATES = {
  Qubit: ['Sample ID,Original sample conc.,Unit,Dilution factor', ',,ng/µL,'].join('\n'),
  Nanodrop: [
    'Sample ID,Nucleic Acid Conc.,A260,A280,260/280,260/230',
    ',,,,,',
  ].join('\n'),
} as const

const handleDownloadResultTemplate = (type: keyof typeof RESULT_TEMPLATES): void => {
  const csv = RESULT_TEMPLATES[type]
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `plantilla_${type.toLowerCase()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

interface ImportResultsModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => Promise<void>
  worklistName: string
}

/**
 * Modal para importar resultados desde un archivo CSV
 */
export const ImportResultsModal = ({
  isOpen,
  onClose,
  onImport,
  worklistName
}: ImportResultsModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError('')
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setError('')
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError('')

    try {
      await onImport(selectedFile)
      handleClose()
    } catch (err) {
      setError('Error al procesar el archivo. Por favor, verifica el formato.')
      console.error('Import error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      setError('')
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-surface-200">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-surface-900">Importar Resultados</h2>
                <p className="text-sm text-surface-600 mt-1">
                  Worklist: <span className="font-semibold">{worklistName}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isUploading}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-surface-600" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Instrucciones */}
            <div className="mb-6 p-4 bg-info-50 border border-info-200 rounded-lg">
              <h3 className="text-sm font-semibold text-info-900 mb-2">📋 Instrucciones</h3>
              <ul className="text-xs text-info-800 space-y-1 list-disc list-inside">
                <li>El archivo debe estar en formato CSV</li>
                <li>Debe contener las columnas requeridas para los resultados</li>
                <li>Los datos deben corresponder a las técnicas de este worklist</li>
                <li>El tamaño máximo del archivo es 10MB</li>
              </ul>
            </div>

            {/* Plantillas descargables */}
            <div className="border border-surface-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-surface-700 mb-2">Descargar plantilla:</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleDownloadResultTemplate('Qubit')}>
                  Plantilla Qubit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadResultTemplate('Nanodrop')}
                >
                  Plantilla Nanodrop
                </Button>
              </div>
            </div>

            {/* File Uploader */}
            <FileUploader
              acceptedExtensions={['.csv']}
              maxSizeMB={10}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              isUploading={isUploading}
              error={error}
              title="Selecciona el archivo CSV"
              description="Arrastra el archivo aquí o haz clic para seleccionarlo"
              buttonText="buscar en tu equipo"
              showPreview={true}
            />

            {/* Información adicional */}
            {selectedFile && !isUploading && (
              <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
                <p className="text-sm text-success-800">
                  ✓ Archivo válido. Presiona &quot;Importar&quot; para procesar los resultados.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-surface-200 bg-surface-50">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!selectedFile || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
