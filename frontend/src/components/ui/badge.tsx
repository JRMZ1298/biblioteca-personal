import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

const variants = {
  default: 'bg-surface-strong text-ink',
  success: 'bg-[#e8f5e9] text-semantic-success',
  warning: 'bg-[#fff8e1] text-[#e6a700]',
  info: 'bg-[#e3f2fd] text-[#1565c0]',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption-uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
