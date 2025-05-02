// src/components/EstadoMuestra.tsx
import React from 'react'

interface EstadoMuestraProps {
  estado: string
}

const EstadoMuestra: React.FC<EstadoMuestraProps> = ({ estado }) => {
  return <span>{estado}</span>
}

export default EstadoMuestra
