import clsx from 'clsx'

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className } = props
  const baseInputClass =
    'w-full px-3 py-2 border rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary'
  return <input {...props} className={clsx(baseInputClass, className)} />
}
