import { useEffect, useMemo, useState } from 'react'
import { X, FileEdit } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { Tecnica, ManualResultFormValues } from '../../interfaces/worklist.types'
import { ResultadoInfo } from '@/features/muestras/components/MuestraList/ResultadoInfo'

interface ManualResultsModalProps {
  isOpen: boolean
  tecnica: Tecnica | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (values: ManualResultFormValues) => void
}

const EMPTY_VALUES: ManualResultFormValues = {
  tipo_res: '',
  valor: '',
  valor_texto: '',
  valor_fecha: '',
  unidades: ''
}

export const ManualResultsModal = ({
  isOpen,
  tecnica,
  isSaving,
  onClose,
  onSubmit
}: ManualResultsModalProps) => {
  const [formValues, setFormValues] = useState<ManualResultFormValues>(EMPTY_VALUES)
  const [error, setError] = useState('')

  const existingResultado = useMemo(() => tecnica?.resultados?.[0], [tecnica])

  useEffect(() => {
    if (!isOpen || !tecnica) return

    setFormValues({
      tipo_res: existingResultado?.tipo_res || '',
      valor: existingResultado?.valor ? String(existingResultado.valor) : '',
      valor_texto: existingResultado?.valor_texto || '',
      valor_fecha: existingResultado?.valor_fecha
        ? new Date(existingResultado.valor_fecha).toISOString().slice(0, 10)
        : '',
      unidades: existingResultado?.unidades || ''
    })
    setError('')
  }, [isOpen, tecnica, existingResultado])

  if (!isOpen || !tecnica) return null

  const handleInputChange = (field: keyof ManualResultFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = () => {
    const trimmedValues: ManualResultFormValues = {
      tipo_res: formValues.tipo_res?.trim() || undefined,
      valor: formValues.valor?.toString().trim() || undefined,
      valor_texto: formValues.valor_texto?.trim() || undefined,
      valor_fecha: formValues.valor_fecha || undefined,
      unidades: formValues.unidades?.trim() || undefined
    }

    const hasValue =
      Boolean(trimmedValues.valor && trimmedValues.valor.length > 0) ||
      Boolean(trimmedValues.valor_texto && trimmedValues.valor_texto.length > 0) ||
      Boolean(trimmedValues.valor_fecha)

    if (!hasValue) {
      setError('Debes introducir al menos un valor numérico, de texto o una fecha.')
      return
    }

    onSubmit(trimmedValues)
  }

  const sampleCode =
    tecnica.muestra?.codigo_epi ||
    tecnica.muestra?.codigo_externo ||
    tecnica.muestraArray?.codigo_placa ||
    'Muestra sin código'

  const resultados = tecnica.resultados || []

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileEdit className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-surface-500">
                  Introducción manual de resultados
                </p>
                <h2 className="text-xl font-semibold text-surface-900">{sampleCode}</h2>
                {tecnica.tecnica_proc?.tecnica_proc && (
                  <p className="text-sm text-surface-500">{tecnica.tecnica_proc.tecnica_proc}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              aria-label="Cerrar modal"
              disabled={isSaving}
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo_res">Tipo de resultado</Label>
                <Input
                  id="tipo_res"
                  placeholder="Ej: Concentración"
                  value={formValues.tipo_res || ''}
                  onChange={e => handleInputChange('tipo_res', e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="unidades">Unidades</Label>
                <Input
                  id="unidades"
                  placeholder="ng/µL, UI/mL, etc."
                  value={formValues.unidades || ''}
                  onChange={e => handleInputChange('unidades', e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="valor">Valor numérico</Label>
                <Input
                  id="valor"
                  type="text"
                  inputMode="decimal"
                  placeholder="Introduce un número"
                  value={formValues.valor || ''}
                  onChange={e => handleInputChange('valor', e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="valor_fecha">Fecha del resultado</Label>
                <Input
                  id="valor_fecha"
                  type="date"
                  value={formValues.valor_fecha || ''}
                  onChange={e => handleInputChange('valor_fecha', e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="valor_texto">Valor en texto / observaciones</Label>
              <textarea
                id="valor_texto"
                className="w-full min-h-[90px] px-3 py-2 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Añade notas o resultados cualitativos"
                value={formValues.valor_texto || ''}
                onChange={e => handleInputChange('valor_texto', e.target.value)}
                disabled={isSaving}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-danger-200 bg-danger-50 text-danger-700 text-sm">
                {error}
              </div>
            )}

            {resultados.length > 0 && (
              <div className="border border-surface-200 rounded-lg p-4 bg-surface-50">
                <p className="text-sm font-semibold text-surface-700 mb-2">
                  Resultados actualmente registrados
                </p>
                <div className="space-y-2">
                  {resultados.map((resultado, index) => (
                    <ResultadoInfo key={resultado.id_resultado || index} resultado={resultado} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-surface-200 bg-surface-50">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isSaving}>
              Guardar resultado
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
