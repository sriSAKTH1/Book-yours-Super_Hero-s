
import type { RecentActivityItem } from '@/lib/dashboard/dashboardTypes'
import DashboardIcon, { type DashboardIconName } from './DashboardIcon'

interface RecentActivityProps {
  activities: RecentActivityItem[]
}

const actionIcons = {
  created: 'plus',
  updated: 'refresh',
  published: 'check',
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <h2>Recent Activity</h2>
          <p>Latest updates across your CMS</p>
        </div>

        <span className="dashboard-live-label">Latest</span>
      </div>

      {activities.length === 0 ? (
        <div className="dashboard-empty-state">
          <span className="dashboard-empty-icon"><DashboardIcon name="empty" /></span>
          <h3>No recent activity</h3>
          <p>Your latest CMS updates will appear here.</p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <a
              href={activity.href}
              className="activity-item"
              key={activity.id}
            >
              <div className={`activity-icon activity-${activity.action}`}>
                <DashboardIcon name={actionIcons[activity.action] as DashboardIconName} />
              </div>

              <div className="activity-content">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <span>
                  {new Date(activity.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              <span className="activity-arrow">→</span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
