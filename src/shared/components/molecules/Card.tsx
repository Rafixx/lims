// src/shared/components/molecules/Card.tsx
import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
  className?: string
  variant?: 'default' | 'ghost'
}

export const Card = ({ children, className, variant = 'default' }: Props) => {
  const baseStyles = 'rounded p-4 shadow-sm'
  const variantStyles =
    variant === 'ghost'
      ? 'bg-transparent border border-gray-200'
      : 'bg-white border border-gray-300'

  return <div className={clsx(baseStyles, variantStyles, className)}>{children}</div>
}
