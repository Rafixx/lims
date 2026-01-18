import React from 'react'
import {
  Calendar,
  CalendarCheck2,
  FlaskConical,
  Package,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  FlaskConicalOff
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string | null
  icon: React.ReactNode
  status: 'completed' | 'active' | 'pending' | 'warning'
  onClick?: () => void
  editable?: boolean
  additionalInfo?: React.ReactNode // Para mostrar información extra como técnico asignado
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const getStatusColor = (status: TimelineEvent['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 border-green-600'
    case 'active':
      return 'bg-blue-500 border-blue-600'
    case 'pending':
      return 'bg-primary-500 border-primary-200'
    case 'warning':
      return 'bg-orange-500 border-orange-600'
    default:
      return 'bg-gray-300 border-gray-400'
  }
}

const getLineColor = (status: TimelineEvent['status']) => {
  switch (status) {
    case 'completed':
      return 'border-green-300'
    case 'active':
      return 'border-blue-300'
    case 'pending':
      return 'border-gray-300'
    case 'warning':
      return 'border-orange-300'
    default:
      return 'border-gray-300'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null

  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return null

    return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
  } catch {
    return null
  }
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        const formattedDate = formatDate(event.date)

        return (
          <div key={event.id} className="relative flex items-start group">
            {!isLast && (
              <div
                className={`absolute left-6 top-12 w-0.5 h-16 border-l-2 ${getLineColor(event.status)}`}
              />
            )}

            <div
              className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(event.status)} shadow-sm transition-all duration-200 group-hover:scale-110`}
            >
              <div className="text-white">{event.icon}</div>
            </div>

            <div className="ml-4 flex-1 pb-8">
              <div
                className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-200 group-hover:shadow-md ${
                  event.editable ? 'cursor-pointer hover:border-blue-300' : ''
                }`}
                onClick={event.onClick}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  {event.editable && (
                    <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-2">{event.description}</p>

                {formattedDate ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formattedDate}
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-400 italic">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Falta introducir la fecha de {event.title.toLowerCase()}
                  </div>
                )}

                {event.additionalInfo && (
                  <div className="mt-2 pt-2 border-t border-gray-100">{event.additionalInfo}</div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const MuestraIcons = {
  creacion: <Calendar className="w-5 h-5" />,
  entrada: <Package className="w-5 h-5" />,
  toma: <FlaskConical className="w-5 h-5" />,
  recepcion: <CheckCircle2 className="w-5 h-5" />,
  verificacion: <ClipboardCheck className="w-5 h-5" />,
  compromiso: <CalendarCheck2 className="w-5 h-5" />,
  entrega: <RotateCcw className="w-5 h-5" />,
  resultado: <CheckCircle2 className="w-5 h-5" />,
  agotada: <FlaskConicalOff className="w-5 h-5" />,
  destruccion: <Trash2 className="w-5 h-5" />,
  devolucion: <RotateCcw className="w-5 h-5" />
}
