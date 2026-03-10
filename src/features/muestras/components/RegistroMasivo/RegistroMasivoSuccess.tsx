import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Card } from '@/shared/components/molecules/Card'
import { RegistroMasivoResult } from '../../interfaces/registroMasivo.types'

interface Props {
  result: RegistroMasivoResult
  onGoToMuestras: () => void
}

interface StatItemProps {
  label: string
  value: number | string
  accent?: boolean
}

const StatItem = ({ label, value, accent }: StatItemProps) => (
  <div className="flex flex-col items-center bg-white rounded-lg p-3 border border-success-100">
    <span className={`text-2xl font-bold ${accent ? 'text-success-600' : 'text-surface-800'}`}>
      {value}
    </span>
    <span className="text-xs text-surface-500 text-center mt-1">{label}</span>
  </div>
)

export const RegistroMasivoSuccess = ({ result, onGoToMuestras }: Props) => {
  const showScrollList = result.codigos_placa.length > 10

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center py-6 text-center">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9 text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-success-700">¡Creación completada!</h2>
        <p className="text-surface-600 mt-2 max-w-md">{result.mensaje}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatItem label="Placas creadas" value={result.placas_creadas} accent />
        <StatItem label="Total posiciones" value={result.total_posiciones} />
        <StatItem label="Total muestras" value={result.total_muestras} />
        <StatItem label="Posiciones vacías" value={result.posiciones_vacias} />
      </div>

      {/* Rango EPI */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">Rango de códigos EPI</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-md border border-primary-100">
            {result.codigos_epi_rango.primero}
          </span>
          <span className="text-surface-400">→</span>
          <span className="font-mono text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-md border border-primary-100">
            {result.codigos_epi_rango.ultimo}
          </span>
        </div>
      </Card>

      {/* Códigos de placa */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">
          Códigos de placa ({result.codigos_placa.length})
        </h3>
        <div
          className={[
            'flex flex-wrap gap-2',
            showScrollList ? 'max-h-48 overflow-y-auto pr-1' : ''
          ].join(' ')}
        >
          {result.codigos_placa.map(code => (
            <span
              key={code}
              className="font-mono text-xs bg-surface-50 text-surface-700 px-2 py-1 rounded border border-surface-200"
            >
              {code}
            </span>
          ))}
        </div>
      </Card>

      {/* Botón */}
      <Button variant="primary" size="lg" fullWidth onClick={onGoToMuestras}>
        Ir a muestras
      </Button>
    </div>
  )
}
