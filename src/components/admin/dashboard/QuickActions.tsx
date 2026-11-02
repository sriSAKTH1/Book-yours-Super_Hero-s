import DashboardIcon, { type DashboardIconName } from './DashboardIcon'

const actions = [
  { title: 'Add User', description: 'Create a new user', icon: 'users', href: '/admin/collections/users/create' },
  { title: 'Upload Media', description: 'Add a new media file', icon: 'media', href: '/admin/collections/media/create' },
  { title: 'Create Page', description: 'Add a new page', icon: 'page', href: '/admin/collections/pages/create' },
  { title: 'Create Form', description: 'Build a new form', icon: 'forms', href: '/admin/collections/forms/create' },
  { title: 'Add Service', description: 'Create a service', icon: 'service', href: '/admin/collections/services/create' },
  { title: 'Add Superhero', description: 'Create a superhero', icon: 'shield', href: '/admin/collections/developers/create' },
  { title: 'Create Post', description: 'Publish new content', icon: 'posts', href: '/admin/collections/posts/create' },
  { title: 'Form Submissions', description: 'Review website messages', icon: 'inbox', href: '/admin/collections/form-submissions' },
]

export default function QuickActions() {
  return (
    <section className="dashboard-quick-actions">
      <div className="dashboard-section-heading">
        <h2>Quick Actions</h2>
        <p>Jump straight into your next task</p>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <a href={action.href} key={action.title} className="quick-action-card">
            <span className="quick-action-icon"><DashboardIcon name={action.icon as DashboardIconName} /></span>
            <span className="quick-action-copy"><strong>{action.title}</strong><small>{action.description}</small></span>
            <span className="quick-action-arrow" aria-hidden="true">›</span>
          </a>
        ))}
      </div>
    </section>
  )
}
