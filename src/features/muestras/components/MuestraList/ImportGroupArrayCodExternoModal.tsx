import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/shared/components/molecules/Modal'
import { FileUploader } from '@/shared/components/molecules/FileUploader'
import { Button } from '@/shared/components/molecules/Button'
import { useImportArrayCodExterno } from '../../hooks/useMuestras'
import { muestrasService } from '../../services/muestras.services'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { STALE_TIME } from '@/shared/constants/constants'
import type { ArrayCodExternoPar, Muestra, MuestraArray } from '../../interfaces/muestras.types'

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------
interface PlateSection {
  muestra: Muestra
  pares: ArrayCodExternoPar[]
}

// ---------------------------------------------------------------------------
// Generación del CSV combinado
// Formato: codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones
// Una fila por posición; la columna codigo_placa identifica cada placa.
// ---------------------------------------------------------------------------
const buildCsv = (muestras: Muestra[], positionsByMuestra: Map<number, MuestraArray[]>): string => {
  const BOM = '﻿'
  const header = 'codigo_placa,posicion_placa,codigo_externo,codigo_epi,observaciones'
  const rows: string[] = [header]

  for (const muestra of muestras) {
    const placa = muestra.codigo_epi ?? ''
    const positions = positionsByMuestra.get(muestra.id_muestra) ?? []

    // Ordenar por codigo_epi para que el CSV refleje el orden de generación.
    // Posiciones sin EPI van al final ordenadas por posicion_placa.
    const sorted = [...positions].sort((a, b) => {
      const epiA = a.codigo_epi ?? ''
      const epiB = b.codigo_epi ?? ''
      if (epiA && epiB) return epiA.localeCompare(epiB)
      if (epiA) return -1
      if (epiB) return 1
      return (a.posicion_placa ?? '').localeCompare(b.posicion_placa ?? '')
    })

    for (const pos of sorted) {
      rows.push(
        `${pos.codigo_placa ?? placa},${pos.posicion_placa ?? ''},,${pos.codigo_epi ?? ''},`
      )
    }
  }

  return BOM + rows.join('\n')
}

const downloadCombinedTemplate = (
  estudio: string,
  muestras: Muestra[],
  positionsByMuestra: Map<number, MuestraArray[]>
) => {
  const csv = buildCsv(muestras, positionsByMuestra)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `plantilla_cod_externo_${estudio}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Parseo del CSV multi-placa
// Acepta formato nuevo: codigo_placa identifica la placa por fila.
// Acepta formato antiguo: filas PLACA que cambian el contexto de placa activo.
// ---------------------------------------------------------------------------
const parseCsv = (text: string, muestraByEpi: Map<string, Muestra>): PlateSection[] => {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error('El CSV no contiene filas de datos')

  const delimiter = lines[0].includes(';') ? ';' : ','
  const unquote = (cell: string) => cell.trim().replace(/^"(.*)"$/, '$1')

  const headers = lines[0].split(delimiter).map(h => unquote(h).toLowerCase())
  const posIdx = headers.findIndex(h => h === 'posicion_placa')
  if (posIdx === -1) throw new Error('El CSV no contiene la columna "posicion_placa"')

  // Aceptar "codigo_externo" (nuevo) o "cod_externo" (retrocompat)
  const extIdx = headers.findIndex(h => h === 'codigo_externo' || h === 'cod_externo')
  if (extIdx === -1)
    throw new Error('El CSV no contiene la columna "codigo_externo" (o "cod_externo")')

  const epiIdx = headers.findIndex(h => h === 'codigo_epi')
  const placaIdx = headers.findIndex(h => h === 'codigo_placa')
  const obsIdx = headers.findIndex(h => h === 'observaciones')

  const sections = new Map<string, PlateSection>()
  let currentEpi: string | null = null

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue
    const cells = line.split(delimiter).map(unquote)
    const posicion = cells[posIdx] ?? ''
    const codExterno = cells[extIdx] ?? ''
    const codigoEpi = epiIdx >= 0 ? (cells[epiIdx] ?? '') : ''
    const codigoPlaca = placaIdx >= 0 ? (cells[placaIdx] ?? '') : ''
    const observaciones = obsIdx >= 0 ? cells[obsIdx]?.trim() || undefined : undefined

    if (posicion === 'PLACA') {
      // Formato antiguo: fila PLACA cambia el contexto
      currentEpi = codigoEpi
      const muestra = muestraByEpi.get(codigoEpi)
      if (muestra && !sections.has(codigoEpi)) {
        sections.set(codigoEpi, { muestra, pares: [] })
      }
    } else if (posicion !== '') {
      // Determinar la placa a la que pertenece esta fila
      // Nuevo formato: usar codigo_placa como clave; antiguo: usar currentEpi
      const placaKey = codigoPlaca !== '' ? codigoPlaca : (currentEpi ?? '')

      if (placaKey !== '' && codExterno !== '') {
        if (!sections.has(placaKey)) {
          const muestra = muestraByEpi.get(placaKey)
          if (muestra) sections.set(placaKey, { muestra, pares: [] })
        }
        const section = sections.get(placaKey)
        if (section) {
          section.pares.push({
            posicion_placa: posicion,
            cod_externo: codExterno,
            codigo_epi: codigoEpi || undefined,
            codigo_placa: codigoPlaca || undefined,
            observaciones
          })
        }
      }
    }
  }

  return [...sections.values()].filter(s => s.pares.length > 0)
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  isOpen: boolean
  onClose: () => void
  estudio: string
  muestras: Muestra[]
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export const ImportGroupArrayCodExternoModal = ({ isOpen, onClose, estudio, muestras }: Props) => {
  const [parsedSections, setParsedSections] = useState<PlateSection[]>([])
  const [parseError, setParseError] = useState<string>('')
  const { notify } = useNotification()
  const importMutation = useImportArrayCodExterno()

  // Carga paralela de posiciones de todas las placas
  const positionQueries = useQueries({
    queries: muestras.map(muestra => ({
      queryKey: ['muestra', muestra.id_muestra, 'array'],
      queryFn: () => muestrasService.getMuestraArray(muestra.id_muestra),
      staleTime: STALE_TIME,
      enabled: isOpen
    }))
  })

  const isLoadingPositions = positionQueries.some(q => q.isLoading)
  const positionsByMuestra = new Map<number, MuestraArray[]>(
    muestras.map((muestra, i) => [muestra.id_muestra, positionQueries[i]?.data ?? []])
  )
  const muestraByEpi = new Map<string, Muestra>(
    muestras.filter(m => !!m.codigo_epi).map(m => [m.codigo_epi!, m])
  )

  const totalPares = parsedSections.reduce((acc, s) => acc + s.pares.length, 0)

  const handleDownloadTemplate = () => {
    if (isLoadingPositions) return
    downloadCombinedTemplate(estudio, muestras, positionsByMuestra)
  }

  const handleFileSelect = (file: File) => {
    setParseError('')
    setParsedSections([])
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const sections = parseCsv(e.target?.result as string, muestraByEpi)
        if (sections.length === 0) {
          setParseError('No se encontraron códigos externos válidos en el archivo')
          return
        }
        setParsedSections(sections)
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Error al procesar el archivo')
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleFileRemove = () => {
    setParsedSections([])
    setParseError('')
  }

  const handleSubmit = async () => {
    if (parsedSections.length === 0) return
    let totalUpdated = 0
    let errors = 0
    for (const section of parsedSections) {
      try {
        const result = await importMutation.mutateAsync({
          muestraId: section.muestra.id_muestra,
          pares: section.pares
        })
        totalUpdated += result.updated
      } catch {
        errors++
      }
    }
    if (errors > 0) {
      notify(`Importación parcial: ${errors} placa(s) fallaron`, 'warning')
    } else {
      notify(`${totalUpdated} código(s) externo(s) actualizados correctamente`, 'success')
    }
    handleClose()
  }

  const handleClose = () => {
    setParsedSections([])
    setParseError('')
    onClose()
  }

  const title = `Importar Códigos Externos — ${muestras.length} placas (${estudio})`

  return (
    <Modal isOpen={isOpen} title={title} onClose={handleClose} widthClass="max-w-lg">
      <div className="space-y-5">
        {/* Paso 1: descargar plantilla */}
        <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-900">Paso 1 — Descarga la plantilla</p>
              <p className="mt-0.5 text-xs text-surface-500">
                {isLoadingPositions ? (
                  'Cargando posiciones de las placas...'
                ) : (
                  <>
                    CSV con las {muestras.length} placas del estudio. La columna{' '}
                    <code className="rounded bg-surface-200 px-1 font-mono">codigo_placa</code>{' '}
                    identifica cada placa; rellena{' '}
                    <code className="rounded bg-surface-200 px-1 font-mono">codigo_externo</code>{' '}
                    para las posiciones que quieras asignar.
                  </>
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadTemplate}
              className="shrink-0"
              disabled={isLoadingPositions}
            >
              <Download className="h-3.5 w-3.5" />
              Plantilla CSV
            </Button>
          </div>
        </div>

        {/* Paso 2: subir archivo relleno */}
        <div>
          <p className="mb-2 text-sm font-medium text-surface-900">
            Paso 2 — Sube el archivo relleno
          </p>
          <FileUploader
            acceptedExtensions={['.csv']}
            maxSizeMB={5}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            title="Seleccionar archivo CSV"
            description="El archivo debe contener las columnas posicion_placa y codigo_externo"
            isUploading={importMutation.isPending}
            error={parseError}
          />
        </div>

        {/* Previsualización por secciones de placa */}
        {parsedSections.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-600" />
              <span className="text-sm font-medium text-success-700">
                {totalPares} asignación{totalPares !== 1 ? 'es' : ''} en{' '}
                {parsedSections.length} placa{parsedSections.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5">
              {parsedSections.map(section => {
                const positionPares = section.pares.filter(p => p.posicion_placa !== 'PLACA')
                return (
                  <div
                    key={section.muestra.id_muestra}
                    className="rounded-lg border border-surface-200 overflow-hidden"
                  >
                    {/* Cabecera de placa */}
                    <div className="grid grid-cols-3 gap-x-2 bg-accent-50 border-b border-accent-200 px-3 py-1.5">
                      <span className="font-mono text-xs font-semibold text-accent-700 truncate">
                        PLACA
                      </span>
                      <span className="font-mono text-xs text-surface-600 truncate">
                        {section.muestra.codigo_epi}
                      </span>
                      <span className="text-xs text-surface-500 truncate">
                        {positionPares.length} posición{positionPares.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    {/* Resumen de posiciones */}
                    {positionPares.length > 0 && (
                      <div className="px-3 py-1.5 bg-white">
                        <span className="text-xs text-surface-500">
                          {positionPares.length} posición{positionPares.length !== 1 ? 'es' : ''}{' '}
                          con código externo asignado
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Advertencia si alguna placa no fue reconocida */}
            {parsedSections.length < muestras.length && (
              <div className="flex items-start gap-2 rounded-lg border border-info-200 bg-info-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-info-600" />
                <p className="text-xs text-info-700">
                  Se actualizarán <strong>{parsedSections.length}</strong> de{' '}
                  <strong>{muestras.length}</strong> placas. Las restantes no tienen cambios en el
                  archivo.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3 border-t border-surface-100 pt-4">
          <Button variant="secondary" onClick={handleClose} disabled={importMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={parsedSections.length === 0 || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importando...' : 'Importar códigos'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
