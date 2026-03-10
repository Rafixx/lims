import { usePruebas, useTiposMuestra } from '@/shared/hooks/useDim_tables'
import { RegistroMasivoFormData } from '../../../interfaces/registroMasivo.types'
import { PlateCalculationSummary } from '../PlateCalculationSummary'
import { calcPositionsPerPlate } from '../../../hooks/useRegistroMasivo'

const PLATE_PRESETS = [
  { label: '12×8 (96 posiciones)', width: 12, heightLetter: 'H' }
] as const

const inputClass =
  'border border-surface-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full bg-white'
const labelClass = 'block text-sm font-medium text-surface-700 mb-1'
const fieldClass = 'space-y-1'

interface Props {
  formData: RegistroMasivoFormData
  onChange: (partial: Partial<RegistroMasivoFormData>) => void
}

export const StepEstudioMuestras = ({ formData, onChange }: Props) => {
  const { data: pruebas = [], isLoading: pruebasLoading } = usePruebas()
  const { data: tiposMuestra = [], isLoading: tiposLoading } = useTiposMuestra()

  const posPerPlate = calcPositionsPerPlate(formData.plate_width, formData.plate_heightLetter)

  const handlePresetClick = (width: number, heightLetter: string) => {
    onChange({ plate_width: width, plate_heightLetter: heightLetter })
  }

  const currentPreset = PLATE_PRESETS.find(
    p => p.width === formData.plate_width && p.heightLetter === formData.plate_heightLetter
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estudio */}
        <div className={fieldClass}>
          <label className={labelClass}>
            Estudio <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Nombre del estudio"
            value={formData.estudio}
            onChange={e => onChange({ estudio: e.target.value })}
          />
        </div>

        {/* Total muestras */}
        <div className={fieldClass}>
          <label className={labelClass}>
            Total de muestras <span className="text-danger-500">*</span>
          </label>
          <input
            type="number"
            className={inputClass}
            placeholder="Número de muestras"
            min={1}
            max={99999}
            step={1}
            value={formData.total_muestras}
            onChange={e => {
              const raw = e.target.value
              if (raw === '') {
                onChange({ total_muestras: '' })
              } else {
                const num = parseInt(raw, 10)
                if (!isNaN(num)) onChange({ total_muestras: num })
              }
            }}
          />
        </div>

        {/* Prueba */}
        <div className={fieldClass}>
          <label className={labelClass}>
            Prueba <span className="text-danger-500">*</span>
          </label>
          <select
            className={inputClass}
            disabled={pruebasLoading}
            value={formData.id_prueba ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_prueba: val === '' ? null : Number(val) })
            }}
          >
            <option value="">{pruebasLoading ? 'Cargando...' : '— Seleccionar —'}</option>
            {pruebas.map(p => (
              <option key={p.id} value={p.id}>
                {p.cod_prueba} {p.prueba ? `— ${p.prueba}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de muestra */}
        <div className={fieldClass}>
          <label className={labelClass}>
            Tipo de muestra <span className="text-danger-500">*</span>
          </label>
          <select
            className={inputClass}
            disabled={tiposLoading}
            value={formData.id_tipo_muestra ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_tipo_muestra: val === '' ? null : Number(val) })
            }}
          >
            <option value="">{tiposLoading ? 'Cargando...' : '— Seleccionar —'}</option>
            {tiposMuestra.map(tm => (
              <option key={tm.id} value={tm.id}>
                {tm.cod_tipo_muestra} {tm.tipo_muestra ? `— ${tm.tipo_muestra}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Configuración de placa */}
      <div className="border border-surface-200 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-surface-700">Configuración de placa</h3>

        {/* Presets */}
        <div className={fieldClass}>
          <label className={labelClass}>Formato de placa</label>
          <div className="flex flex-wrap gap-2">
            {PLATE_PRESETS.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.width, preset.heightLetter)}
                className={[
                  'px-4 py-2 text-sm rounded-lg border-2 transition-colors font-medium',
                  currentPreset?.label === preset.label
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 bg-white text-surface-600 hover:border-primary-300 hover:bg-primary-50'
                ].join(' ')}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual override */}
        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Ancho (columnas)</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={200}
              value={formData.plate_width}
              onChange={e => {
                const val = parseInt(e.target.value, 10)
                if (!isNaN(val) && val >= 1) onChange({ plate_width: val })
              }}
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Alto (letra A-Z)</label>
            <input
              type="text"
              className={`${inputClass} uppercase`}
              maxLength={1}
              placeholder="H"
              value={formData.plate_heightLetter}
              onChange={e => {
                const val = e.target.value.toUpperCase()
                if (val === '' || /^[A-Z]$/.test(val)) {
                  onChange({ plate_heightLetter: val })
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Cálculo en tiempo real */}
      <PlateCalculationSummary
        totalMuestras={formData.total_muestras}
        posPerPlate={posPerPlate}
      />
    </div>
  )
}
