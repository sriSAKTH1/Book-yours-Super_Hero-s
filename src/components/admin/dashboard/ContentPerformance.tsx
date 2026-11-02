
import type { ContentPerformanceSummary } from '@/lib/dashboard/dashboardTypes'

interface ContentPerformanceProps {
  summary: ContentPerformanceSummary
}

export default function ContentPerformance({
  summary,
}: ContentPerformanceProps) {
  return (
    <section className="dashboard-performance">
      <div className="dashboard-section-heading">
        <h2>Content Performance</h2>
        <p>Overview of your website content</p>
      </div>

      <div className="performance-total">
        <div>
          <span>Total Content</span>
          <h3>{summary.total}</h3>
        </div>

        <div className="performance-percentage">
          {summary.publishedPercentage}%
          <small>Published</small>
        </div>
      </div>

      <div className="performance-progress">
        <div
          className="performance-progress-published"
          style={{ width: `${summary.publishedPercentage}%` }}
        />
      </div>

      <div className="performance-breakdown">
        <div>
          <span className="performance-dot published-dot" />
          <span>Published</span>
          <strong>{summary.published}</strong>
        </div>

        <div>
          <span className="performance-dot draft-dot" />
          <span>Drafts</span>
          <strong>{summary.drafts}</strong>
        </div>

        <div>
          <span className="performance-dot archived-dot" />
          <span>Archived</span>
          <strong>{summary.archived}</strong>
        </div>
      </div>
    </section>
  )
}
