function cssVar(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function getChartColors() {
  return {
    ink: cssVar('--color-ink'),
    muted: cssVar('--color-muted'),
    mutedSoft: cssVar('--color-muted-soft'),
    hairline: cssVar('--color-hairline'),
    surfaceCard: cssVar('--color-surface-card'),
  }
}

export const PIE_COLORS = ['#a7e5d3', '#f4c5a8', '#c8b8e0', '#a8c8e8', '#e8b8c4', '#292524']

export const STATUS_COLORS = ['#f4c5a8', '#a8c8e8', '#a7e5d3']

export function getChartAxisStyles() {
  const c = getChartColors()
  return {
    tick: { fontSize: 12, fill: c.muted },
    axisLine: { stroke: c.hairline },
    tickLine: false,
  } as const
}
