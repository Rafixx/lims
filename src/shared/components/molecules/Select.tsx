export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full px-3 py-2 border border-surface-300 rounded-lg bg-white text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed transition-colors duration-200 ${props.className ?? ''}`}
  />
)
