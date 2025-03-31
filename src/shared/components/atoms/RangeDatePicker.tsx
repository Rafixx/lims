// src/shared/components/atoms/RangeDatePicker.tsx
import React, { useState, useEffect } from 'react'

interface RangeDatePickerProps {
  onChange?: (startDate: string, endDate: string) => void
  initialStartDate?: string
  initialEndDate?: string
}

export const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  onChange,
  initialStartDate = '',
  initialEndDate = ''
}) => {
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  // Llama a onChange cada vez que cambian las fechas
  useEffect(() => {
    if (onChange) {
      onChange(startDate, endDate)
    }
  }, [startDate, endDate, onChange])

  return (
    <div className="flex flex-col ">
      <label htmlFor="startDate" className="text-sm my-2 font-medium text-gray-700">
        Desde
      </label>
      <input
        id="startDate"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <label htmlFor="endDate" className="text-sm my-2 font-medium text-gray-700">
        Hasta
      </label>
      <input
        id="endDate"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

export default RangeDatePicker
