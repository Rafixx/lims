import {
  useClientes,
  usePacientes,
  useCentros,
  useTecnicosLaboratorio,
  useCriteriosValidacion
} from '@/shared/hooks/useDim_tables'
import { RegistroMasivoFormData } from '../../../interfaces/registroMasivo.types'

const inputClass =
  'border border-surface-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full bg-white'
const labelClass = 'block text-sm font-medium text-surface-700 mb-1'
const fieldClass = 'space-y-1'

interface Props {
  formData: RegistroMasivoFormData
  onChange: (partial: Partial<RegistroMasivoFormData>) => void
}

export const StepDatosAdministrativos = ({ formData, onChange }: Props) => {
  const { data: clientes = [], isLoading: clientesLoading } = useClientes()
  const { data: pacientes = [], isLoading: pacientesLoading } = usePacientes()
  const { data: centros = [], isLoading: centrosLoading } = useCentros()
  const { data: tecnicos = [], isLoading: tecnicosLoading } = useTecnicosLaboratorio()
  const { data: criterios = [], isLoading: criteriosLoading } = useCriteriosValidacion()

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-500">
        Todos los campos de esta sección son opcionales.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <div className={fieldClass}>
          <label className={labelClass}>Cliente</label>
          <select
            className={inputClass}
            disabled={clientesLoading}
            value={formData.id_cliente ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_cliente: val === '' ? null : Number(val) })
            }}
          >
            <option value="">
              {clientesLoading ? 'Cargando...' : '— Seleccionar (opcional) —'}
            </option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Paciente */}
        <div className={fieldClass}>
          <label className={labelClass}>Paciente</label>
          <select
            className={inputClass}
            disabled={pacientesLoading}
            value={formData.id_paciente ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_paciente: val === '' ? null : Number(val) })
            }}
          >
            <option value="">
              {pacientesLoading ? 'Cargando...' : '— Seleccionar (opcional) —'}
            </option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Centro */}
        <div className={fieldClass}>
          <label className={labelClass}>Centro</label>
          <select
            className={inputClass}
            disabled={centrosLoading}
            value={formData.id_centro ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_centro: val === '' ? null : Number(val) })
            }}
          >
            <option value="">
              {centrosLoading ? 'Cargando...' : '— Seleccionar (opcional) —'}
            </option>
            {centros.map(c => (
              <option key={c.id} value={c.id}>
                {c.codigo} {c.descripcion ? `— ${c.descripcion}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Técnico responsable */}
        <div className={fieldClass}>
          <label className={labelClass}>Técnico responsable</label>
          <select
            className={inputClass}
            disabled={tecnicosLoading}
            value={formData.id_tecnico_resp ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_tecnico_resp: val === '' ? null : Number(val) })
            }}
          >
            <option value="">
              {tecnicosLoading ? 'Cargando...' : '— Seleccionar (opcional) —'}
            </option>
            {tecnicos.map(t => (
              <option key={t.id_usuario} value={t.id_usuario}>
                {t.nombre ?? `Técnico #${t.id_usuario}`}
              </option>
            ))}
          </select>
        </div>

        {/* Criterio de validación */}
        <div className={fieldClass}>
          <label className={labelClass}>Criterio de validación</label>
          <select
            className={inputClass}
            disabled={criteriosLoading}
            value={formData.id_criterio_validacion ?? ''}
            onChange={e => {
              const val = e.target.value
              onChange({ id_criterio_validacion: val === '' ? null : Number(val) })
            }}
          >
            <option value="">
              {criteriosLoading ? 'Cargando...' : '— Seleccionar (opcional) —'}
            </option>
            {criterios.map(cv => (
              <option key={cv.id} value={cv.id}>
                {cv.codigo} — {cv.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Condiciones de envío */}
        <div className={fieldClass}>
          <label className={labelClass}>Condiciones de envío</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Ej: Temperatura ambiente"
            value={formData.condiciones_envio}
            onChange={e => onChange({ condiciones_envio: e.target.value })}
          />
        </div>

        {/* Tiempo en hielo */}
        <div className={fieldClass}>
          <label className={labelClass}>Tiempo en hielo</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Ej: 4h"
            value={formData.tiempo_hielo}
            onChange={e => onChange({ tiempo_hielo: e.target.value })}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className={fieldClass}>
        <label className={labelClass}>Observaciones</label>
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          placeholder="Observaciones generales sobre el registro masivo..."
          value={formData.observaciones}
          onChange={e => onChange({ observaciones: e.target.value })}
        />
      </div>
    </div>
  )
}
