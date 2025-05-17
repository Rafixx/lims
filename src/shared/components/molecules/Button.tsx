interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'danger' | 'ghost' | 'dark_ghost'
}

export const Button = ({ variant, className = '', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-80',
    accent: 'bg-accent text-white hover:bg-opacity-80',
    danger: 'bg-danger text-white hover:bg-opacity-80',
    ghost: 'bg-transparent text-white hover:text-gray-800',
    dark_ghost: 'bg-transparent text-gray-800 hover:text-gray-400'
  }
  const base = variant
    ? `px-4 py-2 rounded text-sm font-medium transition-colors ${variants[variant]}`
    : ''
  return <button {...props} className={`${base} ${className}`} />
}
