//src/shared/components/molecules/FormBasic.tsx
import { useForm, FieldValues, DefaultValues, Path, Controller } from 'react-hook-form'
import Button, { ButtonVariants } from '../atoms/Button'
import SortableList from '../molecules/SortableList' // Ajusta la ruta según corresponda

export interface FieldConfig {
  name: string
  label: string
  type: string // "text", "select", "checkbox", "sortable", etc.
  placeholder?: string
  // Para selects o campos sortable, define las opciones
  options?: { label: string; value: string; allowDuplicates?: boolean }[]
}

interface GenericFormProps<T extends FieldValues> {
  defaultValues: DefaultValues<T>
  fields: FieldConfig[]
  onSubmit: (data: T) => void
}

export function FormBasic<T extends FieldValues>({
  defaultValues,
  fields,
  onSubmit
}: GenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<T>({ defaultValues })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-start mx-4"
    >
      {fields.map(field => (
        <div className="flex flex-col p-3 w-full" key={field.name}>
          <label htmlFor={field.name} className="mb-1">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              {...register(field.name as Path<T>, {
                required: `${field.label} es requerido`
              })}
              className="border border-gray-400 rounded w-full p-2"
            >
              <option value="">Seleccione...</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <input
              id={field.name}
              type="checkbox"
              {...register(field.name as Path<T>, {
                required: `${field.label} es requerido`
              })}
              className="border border-gray-400 rounded p-2"
            />
          ) : field.type === 'sortable' ? (
            <Controller
              name={field.name as Path<T>}
              control={control}
              rules={{ required: `${field.label} es requerido` }}
              render={({ field: { onChange } }) => (
                <SortableList
                  list_in={
                    field.options?.map(opt => ({
                      descripcion: opt.label
                    })) || []
                  }
                  allowDuplicates={field.options?.some(opt => opt.allowDuplicates)}
                  onChange={onChange}
                />
              )}
            />
          ) : (
            <input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name as Path<T>, {
                required: `${field.label} es requerido`
              })}
              className="border border-gray-400 rounded w-full p-2"
            />
          )}
          {errors[field.name as keyof T] && (
            <span style={{ color: 'red' }}>{errors[field.name as keyof T]?.message as string}</span>
          )}
        </div>
      ))}
      <Button type="submit" variant={ButtonVariants.PRIMARY}>
        Guardar
      </Button>
    </form>
  )
}
