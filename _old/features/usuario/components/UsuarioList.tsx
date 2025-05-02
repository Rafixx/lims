//src/features/usuario/components/UsuarioList.tsx
import React from 'react'
import { Usuario } from '../interfaces/usuario.interface'
import { getUsuario } from '../services/usuario.service'
import { UsuarioForm } from './UsuarioForm'
import { ListBasic } from '../../../shared/components/molecules/ListBasic'
import { Column } from '../../../shared/components/molecules/TableBasic'

const usuarioColumns: Column<Usuario>[] = [
  { header: 'ID', accessor: 'id' as keyof Usuario },
  { header: 'Nombre', accessor: 'nombre' as keyof Usuario },
  { header: 'Email', accessor: 'email' as keyof Usuario },
  { header: 'Rol', accessor: 'rol' as keyof Usuario },
  { header: 'Fecha de Creación', accessor: 'fechaCreacion' as keyof Usuario }
]

export const UsuarioList: React.FC = () => {
  return (
    <ListBasic<Usuario>
      queryKey={['usuarios']}
      queryFn={getUsuario}
      columns={usuarioColumns}
      FormComponent={UsuarioForm}
      mutationFn={(data: Usuario) => Promise.resolve(data)} // Aquí integrarías tu llamada a la API
      title="Usuario"
    />
  )
}
