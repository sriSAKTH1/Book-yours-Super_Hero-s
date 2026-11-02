
import DashboardIcon, { type DashboardIconName } from './DashboardIcon'

const collectionGroups = [
  {
    title: 'Collections',
    description: 'Manage your CMS data',
    items: [
      { name: 'Users', slug: 'users', icon: 'users' },
      { name: 'Media', slug: 'media', icon: 'media' },
      { name: 'Pages', slug: 'pages', icon: 'page' },
      { name: 'Forms', slug: 'forms', icon: 'forms' },
      {
        name: 'Search',
        slug: 'search',
        icon: 'search',
      },
    ],
  },
  {
    title: 'Superhero Content',
    description: 'Manage your website content',
    items: [
      { name: 'Services', slug: 'services', icon: 'service' },
      { name: 'Superheroes', slug: 'developers', icon: 'shield' },
      { name: 'Posts', slug: 'posts', icon: 'posts' },
    ],
  },
  {
    title: 'Forms & Audience',
    description: 'Review form submissions and subscribers',
    items: [
      {
        name: 'Form Submissions',
        slug: 'form-submissions',
        icon: 'inbox',
      },
      {
        name: 'Newsletter Subscribers',
        slug: 'newsletter-subscribers',
        icon: 'newsletter',
      },
    ],
  },
]

export default function CollectionExplorer() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <h2>Collection Explorer</h2>
          <p>Quick access to your existing collections</p>
        </div>
      </div>

      <div className="collection-groups">
        {collectionGroups.map((group) => (
          <div className="collection-group" key={group.title}>
            <div className="collection-group-heading">
              <div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>

              <span>{group.items.length} items</span>
            </div>

            <div className="collection-grid">
              {group.items.map((item) => (
                <a
                  href={`/admin/collections/${item.slug}`}
                  className="collection-card"
                  key={item.slug}
                >
                  <span className="collection-card-icon">
                    <DashboardIcon name={item.icon as DashboardIconName} />
                  </span>

                  <span>{item.name}</span>

                  <span className="collection-card-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
