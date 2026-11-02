import DashboardIcon from './DashboardIcon'

interface EmptyStateProps {
  title?: string
  description?: string
}

export default function EmptyState({
  title = 'No data available',
  description = 'There is nothing to display here yet.',
}: EmptyStateProps) {
  return (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-icon"><DashboardIcon name="chart" /></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

