import { RegistroMasivoFormData } from '../../../interfaces/registroMasivo.types'
import { PlateCalculationSummary } from '../PlateCalculationSummary'
import {
  calcPositionsPerPlate,
  calcPlatesNeeded
} from '../../../hooks/useRegistroMasivo'

const inputClass =
  'border border-surface-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full bg-white'
const labelClass = 'block text-sm font-medium text-surface-700 mb-1'
const fieldClass = 'space-y-1'

interface Props {
  formData: RegistroMasivoFormData
  onChange: (partial: Partial<RegistroMasivoFormData>) => void
}

export const StepConfiguracionPlacas = ({ formData, onChange }: Props) => {
  const posPerPlate = calcPositionsPerPlate(formData.plate_width, formData.plate_heightLetter)
  const total = typeof formData.total_muestras === 'number' ? formData.total_muestras : 0
  const numPlates = total > 0 ? calcPlatesNeeded(total, posPerPlate) : 0

  const buildPlateCode = (index: number) => {
    const prefix = formData.code_prefix || 'PLACA'
    return `${prefix}-P${String(index).padStart(3, '0')}`
  }

  const previewCodes: string[] = []
  if (numPlates > 0) {
    previewCodes.push(buildPlateCode(1))
    if (numPlates >= 2) previewCodes.push(buildPlateCode(2))
    if (numPlates >= 3) previewCodes.push(buildPlateCode(3))
    if (numPlates > 3) {
      previewCodes.push('...')
      previewCodes.push(buildPlateCode(numPlates))
    }
  }

  return (
    <div className="space-y-6">
      <PlateCalculationSummary
        totalMuestras={formData.total_muestras}
        posPerPlate={posPerPlate}
        numPlates={numPlates}
      />

      {/* Prefijo de código */}
      <div className={fieldClass}>
        <label className={labelClass}>Prefijo de código de placa</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Ej: ESTUDIO2024"
          value={formData.code_prefix}
          onChange={e => onChange({ code_prefix: e.target.value })}
        />
        <p className="text-xs text-surface-500">
          Los códigos de placa serán: {formData.code_prefix || 'PLACA'}-P001,{' '}
          {formData.code_prefix || 'PLACA'}-P002, ...
        </p>
      </div>

      {/* Vista previa de códigos */}
      {numPlates > 0 && (
        <div className="border border-surface-200 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-semibold text-surface-700">Vista previa de códigos</h3>
          <ul className="space-y-1">
            {previewCodes.map((code, i) => (
              <li
                key={i}
                className={[
                  'text-sm font-mono px-2 py-1 rounded',
                  code === '...'
                    ? 'text-surface-400 italic'
                    : 'text-primary-700 bg-primary-50'
                ].join(' ')}
              >
                {code}
              </li>
            ))}
          </ul>
          <p className="text-xs text-surface-500">
            Total: <strong>{numPlates}</strong> {numPlates === 1 ? 'placa' : 'placas'}
          </p>
        </div>
      )}
    </div>
  )
}
