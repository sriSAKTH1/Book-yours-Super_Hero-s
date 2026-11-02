
import DashboardIcon from './DashboardIcon'

export default function WelcomeHeader() {
  const updatedAt = new Intl.DateTimeFormat('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date())

  return (
    <section className="dashboard-welcome">
      <div>
        <span className="dashboard-welcome-label">
          SUPERHERO HQ · ADMIN CENTER
        </span>

        <h1 className="dashboard-welcome-greeting">Good morning, Admin! <DashboardIcon name="sparkle" /></h1>

        <p>
          Here&apos;s what&apos;s happening across your Superhero HQ today.
        </p>

        <div className="dashboard-welcome-meta">
          <span className="dashboard-status"><i /> System operational</span>
          <span className="dashboard-updated"><DashboardIcon name="clock" />&nbsp; Last updated: {updatedAt}</span>
        </div>
      </div>

      <div className="dashboard-welcome-decoration">
        <span>MANAGE<br />CREATE<br />INSPIRE</span>
        <i />
      </div>
    </section>
  )
}
