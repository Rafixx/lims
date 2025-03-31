// src/features/usuario/components/UsuarioForm.tsx
import React from 'react'
import { FormBasic, FieldConfig } from '../../../shared/components/molecules/FormBasic'
import { Usuario } from '../interfaces/usuario.interface'

interface UsuarioFormProps {
  initialData?: Usuario
  onSubmit: (data: Usuario) => void
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ initialData, onSubmit }) => {
  // Si no hay datos iniciales, se asume que se está creando un nuevo aparato
  const defaultValues: Usuario = initialData || {
    id: '',
    nombre: '',
    email: '',
    rol: '',
    fechaCreacion: ''
  }

  const fields: FieldConfig[] = [
    { name: 'id', label: 'ID', type: 'text', placeholder: 'Ingrese el ID' },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ingrese el nombre' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Ingrese el email' },
    { name: 'rol', label: 'Rol', type: 'text', placeholder: 'Ingrese el rol' },
    {
      name: 'fechaCreacion',
      label: 'Fecha de Creación',
      type: 'date',
      placeholder: 'Ingrese la fecha de creación (yyyy-mm-dd)'
    }
  ]

  return (
    <div>
      <FormBasic<Usuario> defaultValues={defaultValues} fields={fields} onSubmit={onSubmit} />
    </div>
  )
}
