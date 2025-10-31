// src/features/workList/hooks/useWorklistActions.ts

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { worklistService } from '../services/worklistService'
import { resultadoService } from '../services/resultadoService'
import { useDeleteWorklist } from './useWorklists'
import { rawDataToMappableRows } from '../utils/rawDataMapper'
import { Tecnica, MappableRow, InstrumentType } from '../interfaces/worklist.types'

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
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('')
  const [isAssigningTecnico, setIsAssigningTecnico] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [mappableRows, setMappableRows] = useState<MappableRow[]>([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [instrumentType, setInstrumentType] = useState<InstrumentType | null>(null)

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
      // Paso 1: Llamar al servicio para cargar en tabla RAW
      // El backend trunca la tabla y carga los nuevos datos
      const response = await resultadoService.importDataResults(worklistId, file)

      if (!response.type) {
        notify('Error: no se pudo determinar el tipo de instrumento', 'error')
        return
      }

      const type = response.type as InstrumentType

      // Paso 2: Verificar si es un tipo que se importa directamente (sin mapeo)
      if (type === 'NANODROP') {
        // Leer datos de la tabla RAW
        const nanodropData = await resultadoService.getRawNanodropData()
        console.log('Datos Nanodrop importados:', nanodropData)

        notify('Los datos de Nanodrop se han importado correctamente', 'success')
        refetchWorkList()
        setShowImportModal(false)
        // return
      }

      if (type === 'QUBIT') {
        // Leer datos de la tabla RAW
        const qubitData = await resultadoService.getRawQubitData()
        console.log('Datos Qubit importados:', qubitData)

        notify('Los datos de Qubit se han importado correctamente', 'success')
        refetchWorkList()
        setShowImportModal(false)
        // return
      }
      console.log('Instrument type requiring mapping:', type)
      // Paso 3: Para otros tipos, cargar datos RAW y preparar modal de mapeo
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

      // Convertir datos RAW a formato mapenable
      const mappableData = rawDataToMappableRows(rawData, type)
      // console.log('mappableData:', mappableData)
      // Guardar estado y abrir modal de mapeo
      setMappableRows(mappableData)
      setCurrentFile(file)
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
    if (!currentFile) {
      notify('Error: no hay archivo para importar', 'error')
      return
    }

    try {
      const response = await resultadoService.importDataResults(worklistId, currentFile, mapping)
      refetchWorkList()
      notify(response.message, response.success ? 'success' : 'error')
      setShowMappingModal(false)
      setMappableRows([])
      setCurrentFile(null)
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
    setCurrentFile(null)
    setInstrumentType(null)
    setShowImportModal(true) // Volver a abrir modal de importación
  }

  const openImportModal = () => setShowImportModal(true)
  const closeImportModal = () => setShowImportModal(false)

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
    navigate(`/worklist/${worklistId}/plantillaTecnica`)
  }

  const handleBack = () => {
    navigate('/worklist')
  }

  return {
    selectedTecnicoId,
    isAssigningTecnico,
    showImportModal,
    showMappingModal,
    mappableRows,
    instrumentType,
    tecnicas,
    openImportModal,
    closeImportModal,
    closeMappingModal,
    handleTecnicoChange,
    handleImportDataResults,
    handleConfirmMapping,
    handleDeleteWorklist,
    handleStartTecnicas,
    handlePlantillaTecnica,
    handleBack
  }
}
