import { ReactNode } from 'react'

type IconEffect = 'scale' | 'rotate' | 'bounce' | 'none'

interface IconButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  icon: ReactNode
  title: string
  className?: string
  effect?: IconEffect
}

const effectClasses: Record<IconEffect, string> = {
  scale: 'transition-transform duration-200 hover:scale-125',
  rotate: 'transition-transform duration-200 hover:rotate-12',
  bounce: 'hover:animate-bounce', // requiere clase extendida o plugins si quieres algo más fino
  none: ''
}

export const IconButton = ({
  onClick,
  icon,
  title,
  className = '',
  effect = 'scale'
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={className}
      // className={`p-1 rounded hover:bg-gray-200 transition ${className}`}
    >
      <div className={effectClasses[effect]}>{icon}</div>
    </button>
  )
}
