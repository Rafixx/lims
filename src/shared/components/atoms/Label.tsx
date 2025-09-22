type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export const Label = ({ className = '', children, ...props }: LabelProps) => {
  return (
    <label {...props} className={`block text-sm font-medium text-surface-700 mb-1 ${className}`}>
      {children}
    </label>
  )
}
