import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from './Button'

interface FileUploaderProps {
  /** Extensiones de archivo permitidas (ej: ['.csv', '.xlsx']) */
  acceptedExtensions?: string[]
  /** Tamaño máximo del archivo en MB */
  maxSizeMB?: number
  /** Callback cuando se selecciona un archivo válido */
  onFileSelect: (file: File) => void
  /** Callback cuando se elimina el archivo */
  onFileRemove?: () => void
  /** Estado de carga */
  isUploading?: boolean
  /** Mensaje de error externo */
  error?: string
  /** Título del componente */
  title?: string
  /** Descripción del componente */
  description?: string
  /** Texto del botón */
  buttonText?: string
  /** Mostrar vista previa del archivo */
  showPreview?: boolean
  /** Clase CSS adicional */
  className?: string
}

/**
 * Componente reutilizable para selección y carga de archivos
 * Soporta drag & drop, validación de tipo y tamaño, preview y estados de carga
 */
export const FileUploader = ({
  acceptedExtensions = ['.csv'],
  maxSizeMB = 10,
  onFileSelect,
  onFileRemove,
  isUploading = false,
  error,
  title = 'Seleccionar archivo',
  description,
  buttonText = 'Examinar archivos',
  showPreview = true,
  className = ''
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generar string de extensiones aceptadas
  const acceptString = acceptedExtensions.join(',')
  const extensionsText = acceptedExtensions
    .map(ext => ext.replace('.', '').toUpperCase())
    .join(', ')

  /**
   * Valida el archivo según extensiones y tamaño
   */
  const validateFile = (file: File): string | null => {
    // Validar extensión
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedExtensions.includes(fileExtension)) {
      return `Formato no válido. Solo se permiten archivos ${extensionsText}`
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`
    }

    return null
  }

  /**
   * Procesa el archivo seleccionado
   */
  const handleFileSelection = (file: File) => {
    const error = validateFile(file)

    if (error) {
      setValidationError(error)
      setSelectedFile(null)
      return
    }

    setValidationError('')
    setSelectedFile(file)
    onFileSelect(file)
  }

  /**
   * Handler para input file
   */
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  /**
   * Handler para drag & drop
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  /**
   * Eliminar archivo seleccionado
   */
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setValidationError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileRemove?.()
  }

  /**
   * Abrir selector de archivos
   */
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Formatear tamaño de archivo
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const hasError = Boolean(validationError || error)
  const displayError = validationError || error

  return (
    <div className={`w-full ${className}`}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Zona de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-surface-300 bg-surface-50'}
          ${hasError ? 'border-error-500 bg-error-50' : ''}
          ${isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-primary-25'}
        `}
        onClick={!isUploading && !selectedFile ? handleBrowseClick : undefined}
      >
        {/* Estado: Sin archivo seleccionado */}
        {!selectedFile && (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div
              className={`
                p-4 rounded-full transition-colors
                ${isDragging ? 'bg-primary-100' : 'bg-surface-200'}
                ${hasError ? 'bg-error-100' : ''}
              `}
            >
              {hasError ? (
                <AlertCircle className="w-8 h-8 text-error-600" />
              ) : (
                <Upload
                  className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-surface-600'}`}
                />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-surface-900">
                {isDragging ? '¡Suelta el archivo aquí!' : title}
              </h3>

              {description && <p className="text-sm text-surface-600">{description}</p>}

              <p className="text-xs text-surface-500">
                Arrastra y suelta o{' '}
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className="p-0 h-auto text-xs font-semibold"
                >
                  {buttonText}
                </Button>
              </p>

              <p className="text-xs text-surface-400">
                Formatos: {extensionsText} • Máx. {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        {/* Estado: Archivo seleccionado */}
        {selectedFile && showPreview && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-semibold text-surface-900 truncate">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-surface-500 mt-1">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Archivo'}
                  </p>
                </div>

                {!isUploading && (
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-1 hover:bg-surface-200 rounded-md transition-colors"
                    title="Eliminar archivo"
                  >
                    <X className="w-5 h-5 text-surface-600" />
                  </button>
                )}
              </div>

              {/* Barra de progreso (cuando está cargando) */}
              {isUploading && (
                <div className="mt-3">
                  <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full animate-pulse"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <p className="text-xs text-surface-500 mt-1">Procesando archivo...</p>
                </div>
              )}

              {/* Estado de éxito */}
              {!isUploading && !hasError && (
                <div className="mt-2 flex items-center space-x-2 text-success-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Archivo listo para cargar</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {displayError && (
        <div className="mt-3 flex items-start space-x-2 text-error-600 bg-error-50 border border-error-200 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Error de validación</p>
            <p className="text-xs mt-1">{displayError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
