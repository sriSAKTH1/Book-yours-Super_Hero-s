
'use client'

import { useState } from 'react'
import type { ContentPerformanceSummary } from '@/lib/dashboard/dashboardTypes'

import ContentChart from './ContentChart'
import { fetchContentPerformance } from '@/app/(payload)/admin/dashboardActions'

import type {
  ContentChartItem,
  DashboardDateRange,
} from '@/lib/dashboard/dashboardTypes'

interface ContentChartClientProps {
  initialData: ContentChartItem[]
  initialSummary: ContentPerformanceSummary
}

export default function ContentChartClient({
  initialData,
  initialSummary,
}: ContentChartClientProps) {
  const [data, setData] = useState(initialData)
  const [summary, setSummary] = useState(initialSummary)
  const [range, setRange] = useState<DashboardDateRange>('7days')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRangeChange(nextRange: DashboardDateRange) {
    if (nextRange === range || loading) return

    setLoading(true)
    setError('')

    try {
      const result = await fetchContentPerformance(nextRange)

      setData(result.chartData)
      setSummary(result.summary)
      setRange(nextRange)
    } catch (err) {
      console.error('Dashboard chart error:', err)
      setError('Unable to load chart data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-chart-wrapper">
      <ContentChart
        data={data}
        range={range}
        onRangeChange={handleRangeChange}
        summary={summary}
      />

      {loading && (
        <p className="dashboard-chart-loading">
          Updating chart...
        </p>
      )}

      {error && (
        <p className="dashboard-chart-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
