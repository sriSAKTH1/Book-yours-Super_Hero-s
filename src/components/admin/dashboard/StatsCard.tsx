
import Link from 'next/link'
import DashboardIcon, { type DashboardIconName } from './DashboardIcon'

interface StatsCardProps {
  title: string
  value: number
  icon: DashboardIconName
  description: string
  accent: string
  href: string
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  accent,
  href,
}: StatsCardProps) {
  return (
    <Link className="dashboard-stat-card" href={href}>
      <div className="dashboard-stat-top">
        <div
          className="dashboard-stat-icon"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          <DashboardIcon name={icon} />
        </div>

        <div className="dashboard-stat-copy">
          <div className="dashboard-stat-title">{title}</div>
          <div className="dashboard-stat-value">{value.toLocaleString()}</div>
        </div>

        <span className="dashboard-stat-arrow" aria-hidden="true">›</span>
      </div>

      <div className="dashboard-stat-description">
        {description}
      </div>
    </Link>
  )
}
