interface TooltipPayloadItem {
  name?: string
  value?: number
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  unit?: string
  formatLabel?: (label: string) => string
  formatValue?: (value: number, unit: string) => string
}

function formatValue(value: number, unit: string) {
  return `${value} ${unit}`
}

export default function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
  formatLabel,
  formatValue: customFormat,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-hairline bg-white px-3 py-2 shadow-card text-caption">
      <span className="font-medium text-ink">
        {formatLabel ? formatLabel(label ?? '') : label}
      </span>
      <span className="text-muted ml-2">
        {customFormat
          ? customFormat(payload[0].value ?? 0, unit)
          : formatValue(payload[0].value ?? 0, unit)}
      </span>
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
}

export function NameValueTooltip({ active, payload }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-hairline bg-white px-3 py-2 shadow-card text-caption">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-ink font-medium">{entry.name}</span>
          <span className="text-muted">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

interface ChartLegendProps {
  items: { label: string; value: number; color: string }[]
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="hidden sm:flex flex-col gap-2 text-caption">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-ink">{item.label}</span>
          <span className="text-muted">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
