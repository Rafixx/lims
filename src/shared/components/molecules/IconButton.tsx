import { ButtonHTMLAttributes, ReactNode } from 'react'

type IconEffect = 'scale' | 'rotate' | 'bounce' | 'none'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  type = 'button',
  icon,
  title,
  className = '',
  effect = 'scale',
  disabled = false,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      title={title}
      className={className}
      disabled={disabled}
      {...rest}
      // className={`p-1 rounded hover:bg-gray-200 transition ${className}`}
    >
      <div className={effectClasses[effect]}>{icon}</div>
    </button>
  )
}
