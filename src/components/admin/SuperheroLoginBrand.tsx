export function SuperheroLoginBrand() {
  return (
    <>
      <aside className="superhero-login-brand" aria-labelledby="superhero-login-title">
        <div className="superhero-login-brand-content">
          <div className="superhero-login-copy">
            <p className="superhero-login-eyebrow">SECURE ADMIN WORKSPACE</p>
            <h1 id="superhero-login-title">Your universe.<br /><span>Your control.</span></h1>
            <p className="superhero-login-description">
              Manage heroes, services, insights, and website content from one secure workspace.
            </p>
            <div className="superhero-login-rule" aria-hidden="true"><span /></div>
          </div>

          <p className="superhero-login-foot">POWERED BY SUPERHERO SERVICES</p>
        </div>
      </aside>

      <header className="superhero-login-welcome">
        <p className="superhero-login-welcome-kicker">ADMIN PORTAL</p>
        <h2>Welcome back</h2>
        <p>Sign in to your admin workspace.</p>
      </header>
    </>
  )
}
