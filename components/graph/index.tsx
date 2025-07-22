"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  LineChart
} from "recharts"


interface OverviewProps {
  data: any[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{`${label}`}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.dataKey === 'revenue' ? 'Revenue: ' : 'Orders: '}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {entry.dataKey === 'revenue'
                ? `$${entry.value?.toLocaleString()}`
                : entry.value?.toLocaleString()
              }
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  const theme = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  const isDark = theme === 'dark'

  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#9ca3af' : '#6b7280'
  const primaryColor = '#3b82f6'
  const secondaryColor = '#10b981'

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: textColor }}
          />
          <YAxis
            yAxisId="revenue"
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: textColor }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            stroke={textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: textColor }}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
              color: textColor
            }}
          />
          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            fill={primaryColor}
            radius={[4, 4, 0, 0]}
            name="Revenue"
            opacity={0.8}
          />
          <Bar
            yAxisId="orders"
            dataKey="orders"
            fill={secondaryColor}
            radius={[4, 4, 0, 0]}
            name="Orders"
            opacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
