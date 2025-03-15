// src/components/molecules/Card.tsx
import { FC, ReactNode } from 'react'

interface CardProps {
  title?: string
  href?: string
  className?: string
  children: ReactNode
}

const Card: FC<CardProps> = ({ title, href = '#', className = '', children }) => {
  return (
    <a
      href={href}
      className={`block max-w-sm p-6 bg-white border border-accent rounded-lg shadow-sm hover:bg-accent/10 dark:bg-gray-800 dark:border-accent dark:hover:bg-gray-700 ${className}`}
    >
      {title && (
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      )}
      {children}
    </a>
  )
}

export default Card
