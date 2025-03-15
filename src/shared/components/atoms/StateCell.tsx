// src/customComponents/atoms/StateCell.tsx
import React from 'react'
import { getClassEstado } from '../../hooks/useMuestras'

interface StateCellProps {
  state: string
}

const StateCell: React.FC<StateCellProps> = ({ state }) => {
  return <td className={`p-2 ${getClassEstado(state)}`}>{state}</td>
}

export default StateCell
