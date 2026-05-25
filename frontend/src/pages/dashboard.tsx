import {
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
} from "recharts";
import {
  useOverviewStats,
  useFavoriteGenres,
  useTopAuthors,
} from "../hooks/use-stats";
import Card from "../components/ui/card";
import EmptyState from "../components/ui/empty-state";
import { StatCardSkeleton } from "../components/ui/skeleton";
import ChartTooltip, { ChartLegend } from "../components/chart/chart-tooltip";
import {
  getChartColors,
  PIE_COLORS,
  STATUS_COLORS,
  getChartAxisStyles,
} from "../components/chart/chart-theme";
import { useTheme } from "../hooks/use-theme";
import type { OverviewStats } from "../types/stats";

interface MetricDef {
  key: keyof OverviewStats;
  label: string;
  color: string;
}

const metrics: MetricDef[] = [
  { key: "total_books", label: "Total libros", color: "text-ink" },
  {
    key: "completed_books",
    label: "Completados",
    color: "text-semantic-success",
  },
  { key: "reading_books", label: "Leyendo", color: "text-amber-500" },
  { key: "pending_books", label: "Pendientes", color: "text-blue-500" },
  { key: "total_pages", label: "Páginas leídas", color: "text-ink" },
  {
    key: "avg_pages_per_book",
    label: "Prom. páginas/libro",
    color: "text-muted",
  },
];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-caption-uppercase text-muted">{label}</span>
      <span className={`font-display text-display-sm leading-none ${color}`}>
        {value}
      </span>
    </Card>
  );
}

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div>
        <h2 className="font-display text-title-md text-ink mb-4">{title}</h2>
        {children}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const { data: overview, isLoading: overviewLoading } = useOverviewStats();
  const { data: favoriteGenres, isLoading: genresLoading } =
    useFavoriteGenres();
  const { data: topAuthors, isLoading: authorsLoading } = useTopAuthors();

  const loading =
    overviewLoading || genresLoading || authorsLoading;

  const colors = getChartColors();
  const axisStyles = getChartAxisStyles();

  const statusData = overview
    ? [
        { name: "Pendientes", value: overview.pending_books },
        { name: "Leyendo", value: overview.reading_books },
        { name: "Completados", value: overview.completed_books },
      ]
    : [];

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
                      stroke={colors.hairline}
                      horizontal={false}
                    />
                    <XAxis type="number" {...axisStyles} />
                    <YAxis
                      key={isDark ? "dark" : "light"}
                      dataKey="author"
                      type="category"
                      tick={{ fontSize: 12, fill: colors.muted }}
                      axisLine={false}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip content={<ChartTooltip unit="libros" />} />
                    <Bar
                      dataKey="count"
                      fill={colors.muted}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          ) : (
            <Card className="p-6">
              <h2 className="font-display text-title-md text-muted mb-4">
                Autores más leídos
              </h2>
              <EmptyState
                title="Sin datos"
                description="No hay autores registrados aún."
              />
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
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
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
                <h2 className="font-display text-title-md text-ink mb-4">
                  Géneros favoritos
                </h2>
                <EmptyState
                  title="Sin datos"
                  description="No hay géneros registrados aún."
                />
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
                          <Cell
                            key={i}
                            fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                          />
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
  );
}
