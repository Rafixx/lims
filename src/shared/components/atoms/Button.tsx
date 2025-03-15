// src/components/atoms/Button.tsx
import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' // Puedes definir variantes para estilos diferentes
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  // Define estilos base y variantes. Aquí se puede utilizar Tailwind, CSS Modules, styled-components, etc.
  const baseStyles = 'px-4 py-2 font-medium rounded'
  const variantStyles =
    variant === 'primary'
      ? 'border border-primary hover:text-white hover:bg-primary/80'
      : 'border border-secondary hover:text-white hover:bg-secondary/80'
  return (
    <button className={`${baseStyles} ${variantStyles} ${className ?? ''}`} {...props}>
      {children}
    </button>
  )
}

export default Button
