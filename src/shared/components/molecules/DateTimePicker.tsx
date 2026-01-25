import React, { useState } from 'react'
import { Calendar, Clock, X } from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

interface DateTimePickerProps {
  value?: string | null
  onChange: (value: string | null) => void
  label: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push(timeString)
    }
  }
  return options
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Seleccionar fecha y hora',
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Inicializar valores desde props
  React.useEffect(() => {
    if (value) {
      try {
        const date = parseISO(value)
        if (isValid(date)) {
          setSelectedDate(format(date, 'yyyy-MM-dd'))
          setSelectedTime(format(date, 'HH:mm'))
        }
      } catch {
        setSelectedDate('')
        setSelectedTime('')
      }
    } else {
      setSelectedDate('')
      setSelectedTime('')
    }
  }, [value])

  const handleApply = () => {
    if (selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}:00.000Z`
      onChange(dateTimeString)
    } else if (selectedDate) {
      const dateTimeString = `${selectedDate}T00:00:00.000Z`
      onChange(dateTimeString)
    } else {
      onChange(null)
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedDate('')
    setSelectedTime('')
    onChange(null)
    setIsOpen(false)
  }

  const formatDisplayValue = () => {
    if (!value) return placeholder

    try {
      const date = parseISO(value)
      if (isValid(date)) {
        return format(date, "dd/MM/yyyy 'a las' HH:mm", { locale: es })
      }
    } catch {
      return placeholder
    }

    return placeholder
  }

  const timeOptions = generateTimeOptions()

  const handleOpen = () => {
    // Si no hay valor, establecer fecha y hora actual
    if (!value) {
      const now = new Date()
      const currentDate = format(now, 'yyyy-MM-dd')
      const currentTime = format(now, 'HH:mm')
      setSelectedDate(currentDate)
      setSelectedTime(currentTime)
    }
    setIsOpen(true)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${value ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{formatDisplayValue()}</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar hora</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar cuando se hace clic fuera */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
