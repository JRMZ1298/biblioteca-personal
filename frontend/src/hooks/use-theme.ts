import { useState, useEffect, useCallback } from 'react'

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

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(isDark)
  }, [isDark])

  const toggle = useCallback(() => {
    if (!document.startViewTransition) {
      setIsDark((prev) => !prev)
      return
    }
    document.startViewTransition(() => {
      setIsDark((prev) => !prev)
    })
  }, [])

  return { isDark, toggle }
}
