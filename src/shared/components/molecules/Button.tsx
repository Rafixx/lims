interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'danger'
    | 'ghost'
    | 'outline'
    | 'soft'
    | 'success'
    | 'warning'
    | 'info'
    | 'link'
    | 'icon'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  // Variants basados en la configuración de Tailwind (tailwind.config.js)
  const variants = {
    // === VARIANTS PRINCIPALES ===
    primary:
      'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500 shadow-sm',
    secondary:
      'bg-surface-100 text-surface-700 border-surface-200 hover:bg-surface-200 hover:border-surface-300 focus:ring-surface-500',
    accent:
      'bg-accent-600 text-white border-accent-600 hover:bg-accent-700 hover:border-accent-700 focus:ring-accent-500 shadow-sm',
    danger:
      'bg-danger-600 text-white border-danger-600 hover:bg-danger-700 hover:border-danger-700 focus:ring-danger-500 shadow-sm',

    // === VARIANTS SUTILES ===
    ghost:
      'bg-transparent text-surface-600 border-transparent hover:bg-surface-100 hover:text-surface-700 focus:ring-surface-500',
    outline:
      'bg-transparent text-primary-600 border-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500',
    soft: 'bg-primary-50 text-primary-700 border-primary-100 hover:bg-primary-100 hover:border-primary-200 focus:ring-primary-500',

    // === VARIANTS DE ESTADO ===
    success:
      'bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700 focus:ring-success-500 shadow-sm',
    warning:
      'bg-warning-600 text-white border-warning-600 hover:bg-warning-700 hover:border-warning-700 focus:ring-warning-500 shadow-sm',
    info: 'bg-info-600 text-white border-info-600 hover:bg-info-700 hover:border-info-700 focus:ring-info-500 shadow-sm',

    // === VARIANTS ESPECIALES ===
    link: 'bg-transparent text-primary-600 border-transparent hover:text-primary-700 hover:underline focus:ring-primary-500 p-0',
    icon: 'bg-transparent text-surface-500 border-transparent hover:bg-surface-100 hover:text-surface-700 focus:ring-surface-500 p-2 rounded-full'
  }

  // Tamaños
  const sizes = {
    xs: 'px-2 py-1 text-xs font-medium',
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-5 py-2.5 text-base font-medium',
    xl: 'px-6 py-3 text-base font-semibold'
  }

  // Clases base comunes basadas en la configuración de Tailwind
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    border rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${variant !== 'link' && variant !== 'icon' ? sizes[size] : ''}
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
  `

  return (
    <button {...props} disabled={disabled || loading} className={`${baseClasses} ${className}`}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}
