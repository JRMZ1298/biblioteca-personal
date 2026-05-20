import { type ReactNode } from 'react'

interface BookProps {
  fill: string
  stroke: string
  className?: string
  children?: ReactNode
}

function BookSVG({ fill, stroke, className, children }: BookProps) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 52" fill="none" className={className}>
      <rect x="4" y="2" width="32" height="48" rx="2" fill={fill} stroke={stroke} strokeOpacity="0.4" />
      <rect x="4" y="2" width="7" height="48" rx="1.5" fill={stroke} fillOpacity="0.15" />
      <rect x="11" y="4" width="23" height="44" rx="1" fill="white" fillOpacity="0.08" />
      <line x1="14" y1="15" x2="30" y2="15" stroke={stroke} strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="22" x2="26" y2="22" stroke={stroke} strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
      <rect x="14" y="30" width="12" height="2" rx="1" fill={stroke} fillOpacity="0.15" />
      <rect x="14" y="35" width="8" height="2" rx="1" fill={stroke} fillOpacity="0.1" />
      {children}
    </svg>
  )
}

const items = [
  { fill: '#a7e5d3', stroke: '#6b9e8c', size: 36, left: '8%', top: '18%', delay: '0s', dur: 'animate-float', rotate: '-12deg' },
  { fill: '#c8b8e0', stroke: '#9a87b5', size: 44, left: '82%', top: '22%', delay: '1.5s', dur: 'animate-float-slow', rotate: '8deg' },
  { fill: '#f4c5a8', stroke: '#c49a7e', size: 28, left: '18%', top: '55%', delay: '3s', dur: 'animate-float-slow', rotate: '6deg' },
  { fill: '#a8c8e8', stroke: '#7a9fc4', size: 40, left: '72%', top: '60%', delay: '0.8s', dur: 'animate-float', rotate: '-6deg' },
  { fill: '#e8b8c4', stroke: '#c48e9e', size: 32, left: '48%', top: '70%', delay: '2.5s', dur: 'animate-float', rotate: '-3deg' },
  { fill: '#a7e5d3', stroke: '#6b9e8c', size: 24, left: '90%', top: '75%', delay: '4s', dur: 'animate-float-slow', rotate: '15deg' },
  { fill: '#c8b8e0', stroke: '#9a87b5', size: 34, left: '30%', top: '12%', delay: '5s', dur: 'animate-float', rotate: '-18deg' },
  { fill: '#f4c5a8', stroke: '#c49a7e', size: 30, left: '55%', top: '38%', delay: '1.2s', dur: 'animate-float', rotate: '-8deg' },
  { fill: '#a8c8e8', stroke: '#7a9fc4', size: 22, left: '5%', top: '80%', delay: '3.5s', dur: 'animate-float-slow', rotate: '10deg' },
  { fill: '#e8b8c4', stroke: '#c48e9e', size: 38, left: '65%', top: '10%', delay: '4.5s', dur: 'animate-float', rotate: '5deg' },
  { fill: '#a7e5d3', stroke: '#6b9e8c', size: 26, left: '40%', top: '45%', delay: '0.5s', dur: 'animate-float-slow', rotate: '-10deg' },
  { fill: '#c8b8e0', stroke: '#9a87b5', size: 42, left: '15%', top: '40%', delay: '6s', dur: 'animate-float', rotate: '12deg' },
  { fill: '#f4c5a8', stroke: '#c49a7e', size: 20, left: '75%', top: '45%', delay: '2s', dur: 'animate-float-slow', rotate: '-5deg' },
  { fill: '#a8c8e8', stroke: '#7a9fc4', size: 35, left: '50%', top: '85%', delay: '5.5s', dur: 'animate-float', rotate: '7deg' },
  { fill: '#e8b8c4', stroke: '#c48e9e', size: 28, left: '35%', top: '25%', delay: '7s', dur: 'animate-float-slow', rotate: '-15deg' },
]

export default function AuthBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {items.map((book, i) => (
        <div
          key={i}
          className={`absolute ${book.dur}`}
          style={{
            left: book.left,
            top: book.top,
            width: book.size,
            height: book.size * 1.3,
            animationDelay: book.delay,
            transform: `rotate(${book.rotate})`,
            opacity: 0.3,
          }}
        >
          <BookSVG fill={book.fill} stroke={book.stroke} />
        </div>
      ))}
    </div>
  )
}
