// src/components/atoms/Button.tsx
import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants
  children: React.ReactNode
}

export enum ButtonVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  MENU = 'menu',
  ACCENT = 'accent',
  DEFAULT = 'default'
}

const Button: React.FC<ButtonProps> = ({
  variant = ButtonVariants.DEFAULT,
  children,
  className,
  ...props
}) => {
  // Define estilos base y variantes. Aquí se puede utilizar Tailwind, CSS Modules, styled-components, etc.
  const baseStyles = 'px-4 py-2 font-medium rounded'
  const variantStyles = () => {
    switch (variant) {
      case ButtonVariants.PRIMARY:
        return 'bg-primary text-white hover:bg-white hover:text-primary hover:border-primary border border-primary'
      case ButtonVariants.SECONDARY:
        return 'bg-secondary text-white hover:bg-white hover:text-secondary hover:border-secondary border border-secondary'
      case ButtonVariants.MENU:
        return 'text-menuText hover:text-primary hover:bg-menuText'
      case ButtonVariants.ACCENT:
        return 'bg-accent-dark text-white hover:bg-white hover:text-accent-dark hover:border-accent border border-accent'
      default:
        return ''
      // variant === 'primary'
      //   ? 'border border-primary hover:text-white hover:bg-primary/80'
      //   : 'border border-secondary hover:text-white hover:bg-secondary/80'
    }
  }

  return (
    <button className={`${baseStyles} ${variantStyles()}  ${className ?? ''}`} {...props}>
      {children}
    </button>
  )
}

export default Button
