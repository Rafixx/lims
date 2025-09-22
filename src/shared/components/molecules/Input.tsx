import clsx from 'clsx'

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className } = props
  const baseInputClass =
    'w-full px-3 py-2 border border-surface-300 rounded-lg bg-white text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed transition-colors duration-200'
  return <input {...props} className={clsx(baseInputClass, className)} />
}
