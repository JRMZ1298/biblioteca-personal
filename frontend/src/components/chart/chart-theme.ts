export const CHART_COLORS = {
  ink: '#292524',
  muted: '#777169',
  mutedSoft: '#a8a29e',
  hairline: '#e7e5e4',
  surfaceCard: '#ffffff',
} as const

export const PIE_COLORS = ['#a7e5d3', '#f4c5a8', '#c8b8e0', '#a8c8e8', '#e8b8c4', '#292524']

export const STATUS_COLORS = ['#f4c5a8', '#a8c8e8', '#a7e5d3']

export const CHART_AXIS_STYLES = {
  tick: { fontSize: 12, fill: CHART_COLORS.muted },
  axisLine: { stroke: CHART_COLORS.hairline },
  tickLine: false,
} as const
