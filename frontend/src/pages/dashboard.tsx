import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { useOverviewStats, usePagesPerMonth, useFavoriteGenres, useTopAuthors } from '../hooks/use-stats'
import { Card, StatCardSkeleton, EmptyState } from '../components/ui'
import ChartTooltip, { ChartLegend } from '../components/chart/chart-tooltip'
import { CHART_COLORS, PIE_COLORS, STATUS_COLORS, CHART_AXIS_STYLES } from '../components/chart/chart-theme'
import type { OverviewStats } from '../types/stats'

interface MetricDef {
  key: keyof OverviewStats
  label: string
  color: string
}

const metrics: MetricDef[] = [
  { key: 'total_books', label: 'Total libros', color: 'text-ink' },
  { key: 'completed_books', label: 'Completados', color: 'text-semantic-success' },
  { key: 'reading_books', label: 'Leyendo', color: 'text-blue-600' },
  { key: 'pending_books', label: 'Pendientes', color: 'text-muted' },
  { key: 'total_pages', label: 'Páginas leídas', color: 'text-ink' },
  { key: 'avg_pages_per_book', label: 'Prom. páginas/libro', color: 'text-muted' },
]

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-caption-uppercase text-muted">{label}</span>
      <span className={`font-display text-display-sm leading-none ${color}`}>{value}</span>
    </Card>
  )
}

interface SectionCardProps {
  title: string
  children: React.ReactNode
  decorative?: boolean
}

function SectionCard({ title, children, decorative }: SectionCardProps) {
  return (
    <Card className={`relative overflow-hidden p-6 ${decorative ? 'isolate' : ''}`}>
      {decorative && (
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, #a7e5d3 0%, #c8b8e0 40%, #f4c5a8 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative">
        <h2 className="font-display text-title-md text-ink mb-4">{title}</h2>
        {children}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useOverviewStats()
  const { data: pagesPerMonth, isLoading: pagesLoading } = usePagesPerMonth()
  const { data: favoriteGenres, isLoading: genresLoading } = useFavoriteGenres()
  const { data: topAuthors, isLoading: authorsLoading } = useTopAuthors()

  const loading = overviewLoading || pagesLoading || genresLoading || authorsLoading

  const statusData = overview
    ? [
        { name: 'Pendientes', value: overview.pending_books },
        { name: 'Leyendo', value: overview.reading_books },
        { name: 'Completados', value: overview.completed_books },
      ]
    : []

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-6 lg:py-8 space-y-6">
      <h1 className="font-display text-display-sm text-ink">Estadísticas</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {overview &&
              metrics.map((m) => (
                <StatCard
                  key={m.key}
                  label={m.label}
                  value={overview[m.key]}
                  color={m.color}
                />
              ))}
          </div>

          {pagesPerMonth && pagesPerMonth.length > 0 && (
            <SectionCard title="Páginas por mes" decorative>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pagesPerMonth} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.hairline} />
                    <XAxis dataKey="month" {...CHART_AXIS_STYLES} />
                    <YAxis {...CHART_AXIS_STYLES} />
                    <Tooltip content={<ChartTooltip unit="págs" />} />
                    <Line
                      type="monotone"
                      dataKey="pages"
                      stroke={CHART_COLORS.ink}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.ink, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: CHART_COLORS.ink }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          )}

          {topAuthors && topAuthors.length > 0 ? (
            <SectionCard title="Autores más leídos">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topAuthors}
                    margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={CHART_COLORS.hairline}
                      horizontal={false}
                    />
                    <XAxis type="number" {...CHART_AXIS_STYLES} />
                    <YAxis
                      dataKey="author"
                      type="category"
                      tick={{ fontSize: 12, fill: CHART_COLORS.ink }}
                      axisLine={false}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip content={<ChartTooltip unit="libros" />} />
                    <Bar
                      dataKey="count"
                      fill={CHART_COLORS.ink}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          ) : (
            <Card className="p-6">
              <h2 className="font-display text-title-md text-ink mb-4">Autores más leídos</h2>
              <EmptyState title="Sin datos" description="No hay autores registrados aún." />
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favoriteGenres && favoriteGenres.length > 0 ? (
              <SectionCard title="Géneros favoritos">
                <div className="h-72 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={favoriteGenres}
                        dataKey="count"
                        nameKey="genre"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                      >
                        {favoriteGenres.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip unit="libros" />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend
                    items={favoriteGenres.map((g, i) => ({
                      label: g.genre,
                      value: g.count,
                      color: PIE_COLORS[i % PIE_COLORS.length],
                    }))}
                  />
                </div>
              </SectionCard>
            ) : (
              <Card className="p-6">
                <h2 className="font-display text-title-md text-ink mb-4">Géneros favoritos</h2>
                <EmptyState title="Sin datos" description="No hay géneros registrados aún." />
              </Card>
            )}

            {statusData.some((s) => s.value > 0) && (
              <SectionCard title="Estado de lectura">
                <div className="h-72 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                      >
                        {statusData.map((_, i) => (
                          <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip unit="libros" />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ChartLegend
                    items={statusData.map((s, i) => ({
                      label: s.name,
                      value: s.value,
                      color: STATUS_COLORS[i % STATUS_COLORS.length],
                    }))}
                  />
                </div>
              </SectionCard>
            )}
          </div>
        </>
      )}
    </div>
  )
}
