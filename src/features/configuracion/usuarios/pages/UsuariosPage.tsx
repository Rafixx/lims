import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuarios, useDeleteUsuario } from '../hooks/useUsuarios'
import { useListFilters } from '@/shared/hooks/useListFilters'
import { useSortAndPaginate } from '@/shared/hooks/useSortAndPaginate'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { SearchFilter } from '@/shared/components/organisms/Filters/FilterComponents'
import { FilterContainer } from '@/shared/components/organisms/Filters/FilterContainer'
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { getErrorMessage } from '@/shared/utils/errorUtils'
import { createMultiFieldSearchFilter } from '@/shared/utils/filterUtils'
import { UsuarioListHeader, UsuarioListDetail } from '../components/UsuarioList'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { Pagination } from '@/shared/components/molecules/Pagination'
import type { Usuario } from '../interfaces/usuario.types'

const USUARIO_COLUMNS = [
  { label: 'Nombre', span: 3, sortKey: 'nombre' },
  { label: 'Usuario', span: 3, sortKey: 'username' },
  { label: 'Email', span: 3, sortKey: 'email' },
  { label: 'Rol', span: 2 },
  { label: '', span: 1 }
]

export const UsuariosPage = () => {
  const { data: usuarios, isLoading, error, refetch } = useUsuarios()
  const deleteMutation = useDeleteUsuario()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const [usuarioParaCambioPassword, setUsuarioParaCambioPassword] = useState<Usuario | null>(null)

  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<Usuario>(u => [u.nombre, u.username, u.email, u.rol_name])
      }
    }),
    []
  )

  const {
    filters,
    filteredItems,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters<Usuario>(usuarios || [], filterConfig)

  const { sortKey, sortDirection, onSort, page, setPage, pageSize, setPageSize, totalPages, paginatedItems } =
    useSortAndPaginate(filteredItems, { defaultSortKey: 'nombre' })

  const handlers = {
    onNew: () => navigate('/usuarios/nuevo'),
    onEdit: (usuario: Usuario) => navigate(`/usuarios/${usuario.id_usuario}/editar`),
    onDelete: async (usuario: Usuario) => {
      const confirmed = await confirm({
        title: 'Eliminar usuario',
        message: `¿Eliminar al usuario "${usuario.nombre}" (@${usuario.username})? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      })
      if (!confirmed) return
      try {
        await deleteMutation.mutateAsync(usuario.id_usuario)
        notify('Usuario eliminado correctamente', 'success')
        refetch()
      } catch (err) {
        notify(getErrorMessage(err, 'Error al eliminar el usuario'), 'error')
      }
    },
    onChangePassword: (usuario: Usuario) => setUsuarioParaCambioPassword(usuario)
  }

  const renderFilters = () => (
    <FilterContainer onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
      <SearchFilter
        label="Búsqueda"
        value={filters.busqueda as string}
        onChange={value => updateFilter('busqueda', value)}
        placeholder="Buscar por nombre, usuario, email..."
        className="min-w-[300px]"
      />
    </FilterContainer>
  )

  return (
    <>
      <ListPage
        title="Gestión de Usuarios"
        data={{ items: filteredItems, isLoading, error, refetch }}
        handlers={handlers}
        renderFilters={renderFilters}
        config={{
          newButtonText: 'Nuevo usuario',
          emptyStateMessage: 'No hay usuarios registrados'
        }}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <UsuarioListHeader fieldList={USUARIO_COLUMNS} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
          {paginatedItems.map(usuario => (
            <UsuarioListDetail
              key={usuario.id_usuario}
              usuario={usuario}
              onEdit={handlers.onEdit}
              onDelete={handlers.onDelete}
              onChangePassword={handlers.onChangePassword}
              fieldSpans={USUARIO_COLUMNS.map(col => col.span)}
            />
          ))}
          <Pagination page={page} totalPages={totalPages} totalItems={filteredItems.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </ListPage>

      <ChangePasswordModal
        usuario={usuarioParaCambioPassword}
        onClose={() => setUsuarioParaCambioPassword(null)}
      />
    </>
  )
}
