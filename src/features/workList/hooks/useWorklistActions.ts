// src/features/workList/hooks/useWorklistActions.ts

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useUser } from '@/shared/contexts/UserContext'
import { worklistService } from '../services/worklistService'
import { resultadoService } from '../services/resultadoService'
import { useDeleteWorklist } from './useWorklists'
import { rawDataToMappableRows } from '../utils/rawDataMapper'
import {
  Tecnica,
  MappableRow,
  InstrumentType,
  ManualResultFormValues
} from '../interfaces/worklist.types'

interface UseWorklistActionsProps {
  worklistId: number
  worklistName: string
  tecnicas: Tecnica[]
  refetchWorkList: () => void
}

export const useWorklistActions = ({
  worklistId,
  worklistName,
  tecnicas,
  refetchWorkList
}: UseWorklistActionsProps) => {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { user } = useUser()
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('')
  const [isAssigningTecnico, setIsAssigningTecnico] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [mappableRows, setMappableRows] = useState<MappableRow[]>([])
  const [instrumentType, setInstrumentType] = useState<InstrumentType | null>(null)
  const [showManualResultsModal, setShowManualResultsModal] = useState(false)
  const [selectedManualTecnica, setSelectedManualTecnica] = useState<Tecnica | null>(null)
  const [isSavingManualResult, setIsSavingManualResult] = useState(false)

  const openManualResultsModal = (tecnica: Tecnica) => {
    setSelectedManualTecnica(tecnica)
    setShowManualResultsModal(true)
  }

  const closeManualResultsModal = () => {
    if (isSavingManualResult) return
    setShowManualResultsModal(false)
    setSelectedManualTecnica(null)
  }

  const getTecnicaMuestraId = (tecnica: Tecnica | null): number | null => {
    if (!tecnica) return null
    return (
      tecnica.muestra?.id_muestra || tecnica.id_muestra || tecnica.muestraArray?.id_muestra || null
    )
  }

  const handleTecnicoChange = async (tecnicoId: string) => {
    if (!tecnicoId) return

    setIsAssigningTecnico(true)
    setSelectedTecnicoId(tecnicoId)

    try {
      await worklistService.setTecnicoLab(worklistId, parseInt(tecnicoId))
      await refetchWorkList()
      notify('Técnico asignado correctamente', 'success')
    } catch (error) {
      console.error('Error assigning technician:', error)
      notify('Error al asignar técnico', 'error')
      setSelectedTecnicoId('')
    } finally {
      setIsAssigningTecnico(false)
    }
  }

  const handleImportDataResults = async (file: File) => {
    try {
      // Paso 1: Enviar CSV al backend para cargar en tabla RAW
      // El backend trunca la tabla RAW correspondiente y carga los datos
      const response = await resultadoService.setCSVtoRAW(file)

      if (!response.type) {
        notify('Error: no se pudo determinar el tipo de instrumento', 'error')
        return
      }

      const type = response.type as InstrumentType

      // Paso 2: Leer datos de la tabla RAW según el tipo
      let rawData
      switch (type) {
        case 'NANODROP':
          rawData = await resultadoService.getRawNanodropData()
          break
        case 'QUBIT':
          rawData = await resultadoService.getRawQubitData()
          break
        default:
          notify('Tipo de instrumento no soportado', 'error')
          return
      }

      // Paso 3: Convertir datos RAW a formato mapenable para el modal
      const mappableData = rawDataToMappableRows(rawData, type)

      // Paso 4: Guardar estado y abrir modal de mapeo
      setMappableRows(mappableData)
      setInstrumentType(type)
      setShowImportModal(false)
      setShowMappingModal(true)

      notify(response.message, response.success ? 'info' : 'error')
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        ''

      notify(`Error al cargar datos: ${errorMessage || 'Error desconocido'}`, 'error')
      console.error('Error loading data to RAW table:', error)
      throw error
    }
  }

  const handleConfirmMapping = async (mapping: Record<number, number>) => {
    try {
      // Validar que tenemos el tipo de instrumento guardado
      if (!instrumentType) {
        notify('Error: tipo de instrumento no disponible', 'error')
        return
      }

      // Paso 4 y 5: Enviar worklistId, tipo y mapping al backend
      // El backend vuelca datos de RAW a FINAL y crea registros en resultado
      const response = await resultadoService.importDataResults(worklistId, instrumentType, mapping)

      refetchWorkList()
      notify(response.message, response.success ? 'success' : 'error')

      setShowMappingModal(false)
      setMappableRows([])
      setInstrumentType(null)
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        ''

      if (errorMessage.includes('ya tienen resultados')) {
        notify('Las técnicas ya tienen resultados asociados', 'warning')
      } else {
        notify('Error al importar resultados', 'error')
      }
      console.error('Error importing data results:', error)
      throw error
    }
  }

  const closeMappingModal = () => {
    setShowMappingModal(false)
    setMappableRows([])
    setInstrumentType(null)
    setShowImportModal(true) // Volver a abrir modal de importación
  }

  const openImportModal = () => setShowImportModal(true)
  const closeImportModal = () => setShowImportModal(false)

  const handleSaveManualResult = async (values: ManualResultFormValues) => {
    if (!selectedManualTecnica || !selectedManualTecnica.id_tecnica) {
      notify('No se pudo identificar la técnica seleccionada', 'error')
      return
    }

    const idMuestra = getTecnicaMuestraId(selectedManualTecnica)
    if (!idMuestra) {
      notify('No se pudo identificar la muestra asociada', 'error')
      return
    }

    const sanitizedValues: ManualResultFormValues = {
      tipo_res: values.tipo_res || undefined,
      valor: values.valor || undefined,
      valor_texto: values.valor_texto || undefined,
      valor_fecha: values.valor_fecha || undefined,
      unidades: values.unidades || undefined
    }

    const existingResultado = selectedManualTecnica.resultados?.[0]

    setIsSavingManualResult(true)
    try {
      if (existingResultado?.id_resultado) {
        await resultadoService.updateResultado(existingResultado.id_resultado, {
          ...sanitizedValues,
          updated_by: user?.id
        })
        notify('Resultado actualizado correctamente', 'success')
      } else {
        await resultadoService.createResultado({
          ...sanitizedValues,
          id_muestra: idMuestra,
          id_tecnica: selectedManualTecnica.id_tecnica,
          created_by: user?.id
        })
        notify('Resultado creado correctamente', 'success')
      }

      await refetchWorkList()
      setShowManualResultsModal(false)
      setSelectedManualTecnica(null)
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'Error al guardar resultado manual'
      notify(errorMessage, 'error')
      console.error('Error guardando resultado manual:', error)
    } finally {
      setIsSavingManualResult(false)
    }
  }

  const handleStartTecnicas = async () => {
    try {
      await worklistService.startTecnicasInWorkList(worklistId)
      refetchWorkList()
      notify('Técnicas iniciadas correctamente', 'success')
    } catch (error) {
      console.error('Error starting técnicas:', error)
      notify('Error al iniciar técnicas', 'error')
    }
  }

  const handleDeleteWorklist = async () => {
    if (window.confirm(`¿Está seguro de eliminar el worklist "${worklistName}"?`)) {
      try {
        await useDeleteWorklist()
        navigate('/worklist')
        notify('Worklist eliminada correctamente', 'success')
      } catch (error) {
        notify('Error al eliminar la worklist', 'error')
        console.error('Error deleting worklist:', error)
      }
    }
  }

  const handlePlantillaTecnica = () => {
    const hasValidTecnicas = tecnicas && tecnicas.length > 0
    const hasIdTecnicaProc = tecnicas?.some(tecnica => tecnica.id_tecnica_proc)
    // const hasPlantillaTecnica = tecnicas?.some(tecnica => tecnica

    if (!hasValidTecnicas) {
      notify('El worklist no tiene técnicas asignadas', 'warning')
      return
    }

    if (!hasIdTecnicaProc) {
      notify('Las técnicas no tienen plantilla técnica asociada', 'warning')
      return
    }

    navigate(`/worklist/${worklistId}/plantillaTecnica`)
  }

  const handleLotes = () => {
    navigate(`/worklist/${worklistId}/lotes`)
  }

  const handleBack = () => {
    navigate('/worklist')
  }

  return {
    selectedTecnicoId,
    isAssigningTecnico,
    showImportModal,
    showMappingModal,
    showManualResultsModal,
    mappableRows,
    instrumentType,
    tecnicas,
    selectedManualTecnica,
    isSavingManualResult,
    openImportModal,
    closeImportModal,
    closeMappingModal,
    closeManualResultsModal,
    openManualResultsModal,
    handleTecnicoChange,
    handleImportDataResults,
    handleConfirmMapping,
    handleSaveManualResult,
    handleDeleteWorklist,
    handleStartTecnicas,
    handlePlantillaTecnica,
    handleLotes,
    handleBack
  }
}
