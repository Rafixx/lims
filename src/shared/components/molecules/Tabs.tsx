// src/shared/components/molecules/Tabs.tsx
import { ReactNode } from 'react'
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
  activeTab?: string
  setActiveTab?: (tabId: string) => void
}

export const Tabs = ({
  tabs,
  defaultTabId,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}: Props) => {
  // Si se pasan activeTab y setActiveTab como props, usar modo controlado
  // Si no, usar estado interno (modo no controlado)
  const isControlled = externalActiveTab !== undefined && externalSetActiveTab !== undefined

  // En modo no controlado, usar el primer tab o el defaultTabId
  const fallbackActiveTab = defaultTabId ?? tabs[0].id

  const activeTab = isControlled ? externalActiveTab : fallbackActiveTab
  const setActiveTab = externalSetActiveTab || (() => {})

  return (
    <div>
      {/* Encabezado de tabs */}
      <div className="flex gap-4 border-b border-surface-200 mb-4">
        {tabs.map(tab => (
          <Button
            variant="ghost"
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'pb-2 font-semibold text-sm transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-surface-500 hover:text-primary-600'
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
