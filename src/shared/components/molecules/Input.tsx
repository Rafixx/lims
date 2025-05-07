export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border border-muted rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary ${props.className ?? ''}`}
  />
)
