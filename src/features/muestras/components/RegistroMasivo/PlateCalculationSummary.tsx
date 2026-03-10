import { calcPlatesNeeded, calcEmptyPositions } from '../../hooks/useRegistroMasivo'

interface Props {
  totalMuestras: number | ''
  posPerPlate: number
  numPlates?: number
}

export const PlateCalculationSummary = ({ totalMuestras, posPerPlate, numPlates }: Props) => {
  const isEmpty = totalMuestras === '' || totalMuestras === 0

  if (isEmpty || posPerPlate === 0) {
    return (
      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-sm text-primary-400 italic">
        Introduce el número de muestras para ver el cálculo
      </div>
    )
  }

  const total = Number(totalMuestras)
  const plates = numPlates ?? calcPlatesNeeded(total, posPerPlate)
  const empty = calcEmptyPositions(total, posPerPlate)
  const totalPositions = plates * posPerPlate

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 space-y-3">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-primary-500 font-medium uppercase tracking-wide">
            Placas necesarias
          </span>
          <span className="text-2xl font-bold text-primary-700">{plates}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-primary-500 font-medium uppercase tracking-wide">
            Posiciones/placa
          </span>
          <span className="text-2xl font-bold text-primary-700">{posPerPlate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-primary-500 font-medium uppercase tracking-wide">
            Total posiciones
          </span>
          <span className="text-2xl font-bold text-primary-700">{totalPositions}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-primary-500 font-medium uppercase tracking-wide">
            Total muestras
          </span>
          <span className="text-2xl font-bold text-primary-700">{total}</span>
        </div>
      </div>

      {empty > 0 && (
        <p className="text-sm text-warning-700 bg-warning-50 border border-warning-100 rounded px-3 py-1.5">
          Última placa: <strong>{empty}</strong>{' '}
          {empty === 1 ? 'posición vacía' : 'posiciones vacías'}
        </p>
      )}
    </div>
  )
}
