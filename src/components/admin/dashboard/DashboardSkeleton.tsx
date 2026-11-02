export default function DashboardSkeleton() {
  return (
    <main className="dashboard-container dashboard-skeleton">
      <div className="skeleton-block skeleton-welcome" />

      <div className="dashboard-stats-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="skeleton-block skeleton-stat" key={index} />
        ))}
      </div>

      <div className="dashboard-performance-section">
        <div className="skeleton-block skeleton-panel" />
        <div className="skeleton-block skeleton-panel" />
      </div>

      <div className="dashboard-management-section">
        <div className="skeleton-block skeleton-panel" />
        <div className="skeleton-block skeleton-panel" />
      </div>
    </main>
  )
}
