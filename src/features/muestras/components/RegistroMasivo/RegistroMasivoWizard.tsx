import { useState, useEffect } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import {
  usePruebas,
  useTiposMuestra,
  useClientes,
  usePacientes,
  useCentros,
  useTecnicosLaboratorio,
  useCriteriosValidacion
} from '@/shared/hooks/useDim_tables'
import { RegistroMasivoFormData, RegistroMasivoResult } from '../../interfaces/registroMasivo.types'
import {
  useRegistroMasivo,
  calcPositionsPerPlate,
  calcPlatesNeeded,
  calcEmptyPositions
} from '../../hooks/useRegistroMasivo'
import { WizardStepIndicator } from './WizardStepIndicator'
import { StepEstudioMuestras } from './steps/StepEstudioMuestras'
import { StepConfiguracionPlacas } from './steps/StepConfiguracionPlacas'
import { StepDatosAdministrativos } from './steps/StepDatosAdministrativos'
import { StepResumen } from './steps/StepResumen'
import { RegistroMasivoSuccess } from './RegistroMasivoSuccess'

const INITIAL_FORM: RegistroMasivoFormData = {
  estudio: '',
  id_prueba: null,
  id_tipo_muestra: null,
  total_muestras: '',
  plate_width: 12,
  plate_heightLetter: 'H',
  code_prefix: '',
  id_cliente: null,
  id_paciente: null,
  id_centro: null,
  id_tecnico_resp: null,
  id_criterio_validacion: null,
  condiciones_envio: '',
  tiempo_hielo: '',
  observaciones: ''
}

const isValidHeightLetter = (l: string) => /^[A-Za-z]$/.test(l)

interface Props {
  onFinish: () => void
}

export const RegistroMasivoWizard = ({ onFinish }: Props) => {
  const { notify } = useNotification()
  const registroMasivoMutation = useRegistroMasivo()

  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<RegistroMasivoFormData>(INITIAL_FORM)
  const [result, setResult] = useState<RegistroMasivoResult | null>(null)
  const [prevEstudio, setPrevEstudio] = useState('')

  // Load all dim table data
  const { data: pruebas = [] } = usePruebas()
  const { data: tiposMuestra = [] } = useTiposMuestra()
  const { data: clientes = [] } = useClientes()
  const { data: pacientes = [] } = usePacientes()
  const { data: centros = [] } = useCentros()
  const { data: tecnicos = [] } = useTecnicosLaboratorio()
  const { data: criterios = [] } = useCriteriosValidacion()

  // Auto-sync code_prefix with estudio when estudio changes
  useEffect(() => {
    if (formData.estudio !== prevEstudio) {
      if (formData.code_prefix === '' || formData.code_prefix === prevEstudio) {
        setFormData(prev => ({ ...prev, code_prefix: formData.estudio }))
      }
      setPrevEstudio(formData.estudio)
    }
  }, [formData.estudio, formData.code_prefix, prevEstudio])

  const updateForm = (partial: Partial<RegistroMasivoFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }))
  }

  const posPerPlate = calcPositionsPerPlate(formData.plate_width, formData.plate_heightLetter)
  const total = typeof formData.total_muestras === 'number' ? formData.total_muestras : 0
  const numPlates = total > 0 && posPerPlate > 0 ? calcPlatesNeeded(total, posPerPlate) : 0
  const emptyPositions = total > 0 && posPerPlate > 0 ? calcEmptyPositions(total, posPerPlate) : 0

  const isStep1Valid =
    formData.estudio.trim() !== '' &&
    formData.id_prueba !== null &&
    formData.id_tipo_muestra !== null &&
    typeof formData.total_muestras === 'number' &&
    formData.total_muestras > 0 &&
    Number.isInteger(formData.total_muestras) &&
    formData.plate_width > 0 &&
    formData.plate_heightLetter !== '' &&
    isValidHeightLetter(formData.plate_heightLetter)

  const isCurrentStepValid = () => {
    if (currentStep === 1) return isStep1Valid
    return true
  }

  const markStepCompleted = (step: number) => {
    setCompletedSteps(prev => (prev.includes(step) ? prev : [...prev, step]))
  }

  const handleNext = () => {
    markStepCompleted(currentStep)
    setCurrentStep(prev => prev + 1)
  }

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    if (
      formData.id_prueba === null ||
      formData.id_tipo_muestra === null ||
      typeof formData.total_muestras !== 'number'
    ) {
      return
    }

    try {
      const payload = {
        estudio: formData.estudio,
        id_prueba: formData.id_prueba,
        id_tipo_muestra: formData.id_tipo_muestra,
        total_muestras: formData.total_muestras,
        plate_config: {
          width: formData.plate_width,
          heightLetter: formData.plate_heightLetter,
          code_prefix: formData.code_prefix || 'PLACA'
        },
        ...(formData.id_cliente ? { id_cliente: formData.id_cliente } : {}),
        ...(formData.id_paciente ? { id_paciente: formData.id_paciente } : {}),
        ...(formData.id_centro ? { id_centro: formData.id_centro } : {}),
        ...(formData.id_tecnico_resp ? { id_tecnico_resp: formData.id_tecnico_resp } : {}),
        ...(formData.id_criterio_validacion
          ? { id_criterio_validacion: formData.id_criterio_validacion }
          : {}),
        ...(formData.condiciones_envio ? { condiciones_envio: formData.condiciones_envio } : {}),
        ...(formData.tiempo_hielo ? { tiempo_hielo: formData.tiempo_hielo } : {}),
        ...(formData.observaciones ? { observaciones: formData.observaciones } : {})
      }

      const data = await registroMasivoMutation.mutateAsync(payload)
      setResult(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      notify(`Error al crear las placas: ${msg}`, 'error')
    }
  }

  if (result) {
    return (
      <Card className="p-6">
        <RegistroMasivoSuccess result={result} onGoToMuestras={onFinish} />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <WizardStepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {currentStep === 1 && (
          <StepEstudioMuestras formData={formData} onChange={updateForm} />
        )}
        {currentStep === 2 && (
          <StepConfiguracionPlacas formData={formData} onChange={updateForm} />
        )}
        {currentStep === 3 && (
          <StepDatosAdministrativos formData={formData} onChange={updateForm} />
        )}
        {currentStep === 4 && (
          <StepResumen
            formData={formData}
            allEntities={{ pruebas, tiposMuestra, clientes, pacientes, centros, tecnicos, criterios }}
            posPerPlate={posPerPlate}
            numPlates={numPlates}
            emptyPositions={emptyPositions}
            onSubmit={handleSubmit}
            isSaving={registroMasivoMutation.isPending}
          />
        )}
      </Card>

      {/* Navigation buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between gap-3">
          {currentStep > 1 ? (
            <Button variant="secondary" onClick={handlePrev}>
              Anterior
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
          >
            Siguiente
          </Button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="flex justify-start">
          <Button variant="secondary" onClick={handlePrev}>
            Anterior
          </Button>
        </div>
      )}
    </div>
  )
}
