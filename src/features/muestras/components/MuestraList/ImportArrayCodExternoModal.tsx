// src/features/muestras/components/MuestraList/ImportArrayCodExternoModal.tsx
//
// Modal para importar códigos externos desde un CSV a las posiciones (pocillos)
// de una muestra de tipo placa (tipo_array = true).
//
// Flujo de usuario:
//   1. Descarga la plantilla CSV (posicion_placa + codigo_epi pre-rellenos, cod_externo vacío)
//   2. Rellena la columna cod_externo en su editor
//   3. Sube el mismo archivo
//   4. Revisa la previsualización y confirma
//
// El CSV se parsea leyendo los pares (posicion_placa, cod_externo).
// Se ignoran las filas con cod_externo vacío (asignación parcial permitida).
// El backend hace match por posicion_placa.

import { useState } from 'react'
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/shared/components/molecules/Modal'
import { FileUploader } from '@/shared/components/molecules/FileUploader'
import { Button } from '@/shared/components/molecules/Button'
import { useMuestraArray, useImportArrayCodExterno } from '../../hooks/useMuestras'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import type { ArrayCodExternoPar, MuestraArray } from '../../interfaces/muestras.types'

// ---------------------------------------------------------------------------
// Descarga de plantilla CSV
// ---------------------------------------------------------------------------
const downloadTemplate = (muestraId: number, arrayPositions: MuestraArray[]) => {
  const BOM = '\uFEFF'
  const header = 'posicion_placa,codigo_epi,cod_externo'
  const rows = arrayPositions.map(
    pos => `${pos.posicion_placa ?? ''},${pos.codigo_epi ?? ''},`
  )
  const csv = [header, ...rows].join('\n')

  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `plantilla_array_cod_externo_muestra_${muestraId}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Parseo de CSV
// Requiere columna posicion_placa y cod_externo.
// Lee también codigo_epi si está presente.
// Filtra filas donde cod_externo está vacío (asignación parcial).
// ---------------------------------------------------------------------------
const parseCsv = (text: string): ArrayCodExternoPar[] => {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error('El CSV no contiene filas de datos')

  const delimiter = lines[0].includes(';') ? ';' : ','
  const unquote = (cell: string) => cell.trim().replace(/^"(.*)"$/, '$1')

  const headers = lines[0].split(delimiter).map(h => unquote(h).toLowerCase())
  const posIdx = headers.findIndex(h => h === 'posicion_placa')
  if (posIdx === -1) throw new Error('El CSV no contiene la columna "posicion_placa"')

  const extIdx = headers.findIndex(h => h === 'cod_externo')
  if (extIdx === -1) throw new Error('El CSV no contiene la columna "cod_externo"')

  const epiIdx = headers.findIndex(h => h === 'codigo_epi')

  return lines
    .slice(1)
    .map(line => {
      const cells = line.split(delimiter).map(unquote)
      return {
        posicion_placa: cells[posIdx] ?? '',
        cod_externo: cells[extIdx] ?? '',
        codigo_epi: epiIdx >= 0 ? (cells[epiIdx] ?? '') : undefined
      }
    })
    .filter(par => par.cod_externo !== '' && par.posicion_placa !== '')
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  isOpen: boolean
  onClose: () => void
  muestraId: number
  codigoEpi?: string
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export const ImportArrayCodExternoModal = ({ isOpen, onClose, muestraId, codigoEpi }: Props) => {
  const [parsedPares, setParsedPares] = useState<ArrayCodExternoPar[]>([])
  const [parseError, setParseError] = useState<string>('')
  const { notify } = useNotification()
  const { arrayPositions, isLoading: isLoadingArray } = useMuestraArray(isOpen ? muestraId : undefined)
  const importMutation = useImportArrayCodExterno()

  const totalPosiciones = arrayPositions.length

  const handleDownloadTemplate = () => {
    if (totalPosiciones === 0) return
    downloadTemplate(muestraId, arrayPositions)
  }

  const handleFileSelect = (file: File) => {
    setParseError('')
    setParsedPares([])

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const pares = parseCsv(e.target?.result as string)
        if (pares.length === 0) {
          setParseError('No se encontraron códigos externos válidos en el archivo')
          return
        }
        setParsedPares(pares)
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Error al procesar el archivo')
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleFileRemove = () => {
    setParsedPares([])
    setParseError('')
  }

  const handleSubmit = async () => {
    if (parsedPares.length === 0) return
    try {
      const result = await importMutation.mutateAsync({ muestraId, pares: parsedPares })
      notify(result.mensaje ?? `${result.updated} posiciones actualizadas`, 'success')
      handleClose()
    } catch {
      notify('Error al importar los códigos externos', 'error')
    }
  }

  const handleClose = () => {
    setParsedPares([])
    setParseError('')
    onClose()
  }

  const hasPartialAssignment = totalPosiciones > 0 && parsedPares.length < totalPosiciones
  const title = codigoEpi
    ? `Importar Códigos Externos — Placa ${codigoEpi}`
    : `Importar Códigos Externos — Placa #${muestraId}`

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={handleClose}
      widthClass="max-w-lg"
    >
      <div className="space-y-5">
        {/* Paso 1: descargar plantilla */}
        <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-900">
                Paso 1 — Descarga la plantilla
              </p>
              <p className="mt-0.5 text-xs text-surface-500">
                {isLoadingArray ? (
                  'Cargando posiciones...'
                ) : totalPosiciones > 0 ? (
                  <>
                    CSV con las {totalPosiciones} posiciones de la placa (
                    <code className="rounded bg-surface-200 px-1 font-mono">posicion_placa</code>{' '}
                    +{' '}
                    <code className="rounded bg-surface-200 px-1 font-mono">codigo_epi</code>) y la
                    columna{' '}
                    <code className="rounded bg-surface-200 px-1 font-mono">cod_externo</code>{' '}
                    vacía para rellenar.
                  </>
                ) : (
                  'Esta placa no tiene posiciones registradas.'
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadTemplate}
              className="shrink-0"
              disabled={isLoadingArray || totalPosiciones === 0}
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
            maxSizeMB={2}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            title="Seleccionar archivo CSV"
            description="El archivo debe contener las columnas posicion_placa y cod_externo"
            isUploading={importMutation.isPending}
            error={parseError}
          />
        </div>

        {/* Previsualización de pares parseados */}
        {parsedPares.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-600" />
              <span className="text-sm font-medium text-success-700">
                {parsedPares.length} asignación{parsedPares.length !== 1 ? 'es' : ''} encontrada
                {parsedPares.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Tabla de previsualización */}
            <div className="overflow-hidden rounded-lg border border-surface-200">
              {/* Cabecera */}
              <div className="grid grid-cols-3 gap-x-2 border-b border-surface-200 bg-surface-100 px-3 py-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">
                  Posición
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">
                  Cód EPI
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-surface-500">
                  Cód Externo
                </span>
              </div>
              {/* Filas (scroll si hay muchas) */}
              <div className="max-h-44 overflow-y-auto">
                {parsedPares.map((par, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 gap-x-2 border-b border-surface-100 px-3 py-1.5 last:border-b-0 hover:bg-surface-50"
                  >
                    <span className="truncate font-mono text-xs font-semibold text-accent-700">
                      {par.posicion_placa}
                    </span>
                    <span className="truncate font-mono text-xs text-surface-600">
                      {par.codigo_epi || <span className="italic text-surface-300">—</span>}
                    </span>
                    <span className="truncate font-mono text-xs font-semibold text-primary-700">
                      {par.cod_externo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertencias */}
            {hasPartialAssignment && (
              <div className="flex items-start gap-2 rounded-lg border border-info-200 bg-info-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-info-600" />
                <p className="text-xs text-info-700">
                  Asignación parcial: se actualizarán <strong>{parsedPares.length}</strong> de{' '}
                  <strong>{totalPosiciones}</strong> posiciones. Las restantes mantendrán su valor
                  actual.
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
            disabled={parsedPares.length === 0 || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importando...' : 'Importar códigos'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
