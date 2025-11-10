import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface DataPoint {
  status?: string
  name?: string
  count?: number
  value?: number
  [key: string]: any
}

interface StatusPieChartProps {
  data: DataPoint[]
  title?: string
  description?: string
  nameKey?: string
  valueKey?: string
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(142, 71%, 45%)', // green
  'hsl(38, 92%, 50%)',  // orange
  'hsl(346, 77%, 50%)', // red
]

export default function StatusPieChart({
  data,
  title = 'Distribution',
  description,
  nameKey = 'status',
  valueKey = 'count',
}: StatusPieChartProps) {
  // Normalize data to use name/value
  const normalizedData = data.map(item => ({
    name: item[nameKey] || item.name || item.status,
    value: item[valueKey] || item.value || item.count,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = normalizedData.reduce((sum, item) => sum + (item.value || 0), 0)
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{payload[0].name}</p>
          <p className="text-sm">Count: {payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices < 5%

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.value.toLocaleString()})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
