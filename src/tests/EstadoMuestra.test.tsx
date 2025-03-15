// src/tests/EstadoMuestra.test.tsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import EstadoMuestra from '../shared/components/organisms/EstadoMuestra'

test('Debe mostrar el estado correcto de la muestra', () => {
  render(<EstadoMuestra estado="En Curso" />)
  expect(screen.getByText(/En Curso/i)).toBeInTheDocument()
})
