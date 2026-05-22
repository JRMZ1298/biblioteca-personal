import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    const next = !isDark

    if (!document.startViewTransition || prefersReducedMotion()) {
      setIsDark(next)
      return
    }

    document.startViewTransition(() => {
      applyTheme(next)
      flushSync(() => {
        setIsDark(next)
      })
    })
  }, [isDark])

  return { isDark, toggle }
}
