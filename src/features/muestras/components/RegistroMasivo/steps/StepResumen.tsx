import { Button } from '@/shared/components/molecules/Button'
import { Card } from '@/shared/components/molecules/Card'
import { RegistroMasivoFormData } from '../../../interfaces/registroMasivo.types'
import { Prueba, TipoMuestra, Cliente, Paciente, Centro, TecnicoLaboratorio, CriterioValidacion } from '@/shared/interfaces/dim_tables.types'

interface AllEntities {
  pruebas: Prueba[]
  tiposMuestra: TipoMuestra[]
  clientes: Cliente[]
  pacientes: Paciente[]
  centros: Centro[]
  tecnicos: TecnicoLaboratorio[]
  criterios: CriterioValidacion[]
}

interface Props {
  formData: RegistroMasivoFormData
  allEntities: AllEntities
  posPerPlate: number
  numPlates: number
  emptyPositions: number
  onSubmit: () => void
  isSaving: boolean
}

const SummaryRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between text-sm py-1 border-b border-surface-100 last:border-0">
      <span className="text-surface-500">{label}</span>
      <span className="text-surface-800 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export const StepResumen = ({
  formData,
  allEntities,
  posPerPlate,
  numPlates,
  emptyPositions,
  onSubmit,
  isSaving
}: Props) => {
  const prueba = allEntities.pruebas.find(p => p.id === formData.id_prueba)
  const tipoMuestra = allEntities.tiposMuestra.find(tm => tm.id === formData.id_tipo_muestra)
  const cliente = allEntities.clientes.find(c => c.id === formData.id_cliente)
  const paciente = allEntities.pacientes.find(p => p.id === formData.id_paciente)
  const centro = allEntities.centros.find(c => c.id === formData.id_centro)
  const tecnico = allEntities.tecnicos.find(t => t.id_usuario === formData.id_tecnico_resp)
  const criterio = allEntities.criterios.find(cv => cv.id === formData.id_criterio_validacion)

  const hasAdminData =
    formData.id_cliente ||
    formData.id_paciente ||
    formData.id_centro ||
    formData.id_tecnico_resp ||
    formData.id_criterio_validacion ||
    formData.condiciones_envio ||
    formData.tiempo_hielo ||
    formData.observaciones

  const total = typeof formData.total_muestras === 'number' ? formData.total_muestras : 0

  return (
    <div className="space-y-4">
      {/* Tarjeta Estudio */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">Estudio</h3>
        <SummaryRow label="Nombre del estudio" value={formData.estudio} />
        <SummaryRow
          label="Prueba"
          value={prueba ? `${prueba.cod_prueba}${prueba.prueba ? ` — ${prueba.prueba}` : ''}` : null}
        />
        <SummaryRow
          label="Tipo de muestra"
          value={
            tipoMuestra
              ? `${tipoMuestra.cod_tipo_muestra}${tipoMuestra.tipo_muestra ? ` — ${tipoMuestra.tipo_muestra}` : ''}`
              : null
          }
        />
        <SummaryRow label="Total de muestras" value={total} />
      </Card>

      {/* Tarjeta Placas */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">Placas</h3>
        <SummaryRow label="Número de placas" value={numPlates} />
        <SummaryRow label="Posiciones por placa" value={posPerPlate} />
        <SummaryRow
          label="Posiciones vacías (última placa)"
          value={emptyPositions > 0 ? emptyPositions : 'Ninguna'}
        />
        <SummaryRow
          label="Prefijo de código"
          value={formData.code_prefix || '(sin prefijo — se usará "PLACA")'}
        />
      </Card>

      {/* Tarjeta Datos adicionales */}
      {hasAdminData && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Datos adicionales</h3>
          <SummaryRow label="Cliente" value={cliente?.nombre} />
          <SummaryRow label="Paciente" value={paciente?.nombre} />
          <SummaryRow
            label="Centro"
            value={centro ? `${centro.codigo}${centro.descripcion ? ` — ${centro.descripcion}` : ''}` : null}
          />
          <SummaryRow label="Técnico responsable" value={tecnico?.nombre} />
          <SummaryRow
            label="Criterio de validación"
            value={criterio ? `${criterio.codigo} — ${criterio.descripcion}` : null}
          />
          <SummaryRow label="Condiciones de envío" value={formData.condiciones_envio || null} />
          <SummaryRow label="Tiempo en hielo" value={formData.tiempo_hielo || null} />
          <SummaryRow label="Observaciones" value={formData.observaciones || null} />
        </Card>
      )}

      {/* Botón de envío */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSaving}
          disabled={isSaving}
          onClick={onSubmit}
        >
          {isSaving
            ? 'Creando placas...'
            : `Crear ${numPlates} ${numPlates === 1 ? 'placa' : 'placas'} con ${total} muestras`}
        </Button>
      </div>
    </div>
  )
}
