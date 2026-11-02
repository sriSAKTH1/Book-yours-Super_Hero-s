import type { DashboardStats } from '@/lib/dashboard/dashboardTypes'
import StatsCard from './StatsCard'

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    { title: 'Users', value: stats.users, icon: 'users' as const, description: 'In your hero network', accent: '#1677ff', href: '/admin/collections/users' },
    { title: 'Media', value: stats.media, icon: 'media' as const, description: 'Uploaded files', accent: '#8b42ef', href: '/admin/collections/media' },
    { title: 'Pages', value: stats.pages, icon: 'page' as const, description: 'Published website pages', accent: '#20a34a', href: '/admin/collections/pages' },
    { title: 'Forms', value: stats.forms, icon: 'forms' as const, description: 'Active forms', accent: '#f18b16', href: '/admin/collections/forms' },
    { title: 'Form Submissions', value: stats.formSubmissions, icon: 'inbox' as const, description: 'Received responses', accent: '#ef4444', href: '/admin/collections/form-submissions' },
  ]

  return (
    <section className="dashboard-stats-section" aria-label="Dashboard overview">
      <div className="dashboard-stats-grid">
        {cards.map((card) => <StatsCard key={card.title} {...card} />)}
      </div>
    </section>
  )
}
