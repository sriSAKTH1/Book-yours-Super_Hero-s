
import DashboardIcon, { type DashboardIconName } from './DashboardIcon'

const settings = [
  {
    title: 'Website Header',
    description: 'Manage website navigation and branding',
    href: '/admin/globals/header',
    icon: 'compass',
  },
  {
    title: 'Superhero HQ Footer',
    description: 'Manage footer content and links',
    href: '/admin/globals/footer',
    icon: 'footer',
  },
  {
    title: 'Hero Network Settings',
    description: 'Manage global website settings',
    href: '/admin/globals/firm-settings',
    icon: 'settings',
  },
]

export default function SiteSettings() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <h2>Site Settings</h2>
          <p>Manage your website configuration</p>
        </div>
      </div>

      <div className="site-settings-grid">
        {settings.map((setting) => (
          <a
            href={setting.href}
            className="site-setting-card"
            key={setting.href}
          >
            <div className="site-setting-icon">
              <DashboardIcon name={setting.icon as DashboardIconName} />
            </div>

            <div>
              <h3>{setting.title}</h3>
              <p>{setting.description}</p>
            </div>

            <span>→</span>
          </a>
        ))}
      </div>
    </section>
  )
}
