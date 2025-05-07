// src/shared/components/molecules/Tabs.tsx
import { ReactNode, useState } from 'react'
import { Button } from '@/shared/components/molecules/Button'
import clsx from 'clsx'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: Tab[]
  defaultTabId?: string
}

export const Tabs = ({ tabs, defaultTabId }: Props) => {
  const [activeTab, setActiveTab] = useState(defaultTabId ?? tabs[0].id)

  return (
    <div>
      {/* Encabezado de tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <Button
            variant="dark_ghost"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'pb-2 font-semibold text-sm transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div>{tabs.find(t => t.id === activeTab)?.content}</div>
    </div>
  )
}
