
'use client'

import type {
  ContentChartItem,
  ContentPerformanceSummary,
  DashboardDateRange,
} from '@/lib/dashboard/dashboardTypes'

interface ContentChartProps {
  data: ContentChartItem[]
  range: DashboardDateRange
  onRangeChange: (range: DashboardDateRange) => void
  summary: ContentPerformanceSummary
}

const ranges: { label: string; value: DashboardDateRange }[] = [
  { label: '7 Days', value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: '90 Days', value: '90days' },
]

export default function ContentChart({
  data,
  range,
  onRangeChange,
  summary,
}: ContentChartProps) {
  const maxValue = Math.max(
    1,
    ...data.map((item) => item.published + item.drafts),
  )

  return (
    <section className="dashboard-chart-card">
      <div className="dashboard-chart-header">
        <div>
          <h2>Content Performance</h2>
        </div>

        <div className="dashboard-chart-filters">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              className={range === item.value ? 'active' : ''}
              onClick={() => onRangeChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-chart-content">
       <div className="dashboard-chart-area">
        <div className="dashboard-chart-legend">
          <span><i className="published-dot" /> Published</span>
          <span><i className="draft-dot" /> Draft</span>
        </div>
        <div className="dashboard-chart">
        {data.map((item) => {
          const publishedHeight =
            (item.published / maxValue) * 100

          const draftHeight =
            (item.drafts / maxValue) * 100

          return (
            <div className="dashboard-chart-column" key={item.date}>
              <div className="dashboard-chart-bars">
                <div
                  className="chart-bar published-bar"
                  style={{ height: `${publishedHeight}%` }}
                  title={`Published: ${item.published}`}
                />

                <div
                  className="chart-bar draft-bar"
                  style={{ height: `${draftHeight}%` }}
                  title={`Drafts: ${item.drafts}`}
                />
              </div>

              <span>
                {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                  'en-IN',
                  { day: 'numeric', month: 'short' },
                )}
              </span>
            </div>
          )
        })}
        </div>
       </div>
       <aside className="dashboard-performance-summary" aria-label="Publishing summary">
        <div className="performance-donut" style={{ '--published': `${summary.publishedPercentage}%` } as React.CSSProperties}>
          <strong>{summary.publishedPercentage}%</strong><span>Published</span>
        </div>
        <div className="performance-breakdown">
          <div><span className="performance-dot published-dot" />Published<strong>{summary.published}</strong></div>
          <div><span className="performance-dot draft-dot" />Drafts<strong>{summary.drafts}</strong></div>
          <div><span className="performance-dot archived-dot" />Others<strong>{summary.archived}</strong></div>
        </div>
       </aside>
      </div>

      {data.length === 0 && (
        <p className="dashboard-chart-empty">
          No content activity available for this period.
        </p>
      )}
    </section>
  )
}
