// src/customComponents/atoms/StateCell.tsx
import React from 'react'

interface StateCellProps {
  state: string
}

const stateStyles: { [key: string]: string } = {
  Pendiente: 'bg-yellow-300 text-black',
  EnCurso: 'bg-blue-300 text-white',
  Finalizada: 'bg-green-500 text-white',
  Actualizado: 'bg-purple-500 text-white'
}

const StateCell: React.FC<StateCellProps> = ({ state }) => {
  const style = stateStyles[state] || 'bg-gray-300 text-black'
  return <td className={`p-2 ${style}`}>{state}</td>
}

export default StateCell
