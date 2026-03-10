import { CheckIcon } from 'lucide-react'

const STEPS = [
  { label: 'Estudio y muestras' },
  { label: 'Configuración placas' },
  { label: 'Datos administrativos' },
  { label: 'Resumen' }
]

interface Props {
  currentStep: number
  completedSteps: number[]
  onStepClick: (step: number) => void
}

export const WizardStepIndicator = ({ currentStep, completedSteps, onStepClick }: Props) => {
  return (
    <div className="flex items-center w-full mb-8">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = completedSteps.includes(stepNumber)
        const isCurrent = currentStep === stepNumber
        const isFuture = !isCompleted && !isCurrent

        return (
          <div key={stepNumber} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center min-w-0">
              <button
                type="button"
                disabled={!isCompleted}
                onClick={() => isCompleted && onStepClick(stepNumber)}
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors flex-shrink-0',
                  isCurrent
                    ? 'bg-primary-600 text-white border-primary-600'
                    : isCompleted
                      ? 'bg-primary-100 text-primary-700 border-primary-300 cursor-pointer hover:bg-primary-200'
                      : 'bg-surface-100 text-surface-400 border-surface-200 cursor-default'
                ].join(' ')}
              >
                {isCompleted ? <CheckIcon className="w-4 h-4" /> : stepNumber}
              </button>
              <span
                className={[
                  'text-xs mt-1 text-center leading-tight max-w-[80px] hidden sm:block',
                  isCurrent
                    ? 'text-primary-700 font-medium'
                    : isCompleted
                      ? 'text-primary-600'
                      : isFuture
                        ? 'text-surface-400'
                        : 'text-surface-500'
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={[
                  'flex-1 h-0.5 mx-2 mt-[-18px] sm:mt-[-28px]',
                  isCompleted ? 'bg-primary-300' : 'bg-surface-200'
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
