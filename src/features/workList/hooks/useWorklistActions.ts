// src/features/workList/hooks/useWorklistActions.ts

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { worklistService } from '../services/worklistService'
import { useDeleteWorklist } from './useWorklists'

interface UseWorklistActionsProps {
  worklistId: number
  worklistName: string
  refetchWorkList: () => void
}

export const useWorklistActions = ({
  worklistId,
  worklistName,
  refetchWorkList
}: UseWorklistActionsProps) => {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('')
  const [isAssigningTecnico, setIsAssigningTecnico] = useState(false)

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

  const handleImportDataResults = async () => {
    try {
      await worklistService.importDataResults(worklistId)
      refetchWorkList()
      notify('Resultados importados correctamente', 'success')
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

  const handleBack = () => {
    navigate('/worklist')
  }

  return {
    selectedTecnicoId,
    isAssigningTecnico,
    handleTecnicoChange,
    handleImportDataResults,
    handleDeleteWorklist,
    handleStartTecnicas,
    handleBack
  }
}
